import json
import zipfile
import hashlib
import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

zip_path = r"C:\Users\PC\Downloads\rtc100.zip"
vps_json_path = "apps/backend/data/live_watches.vps_sync.json"

with open(vps_json_path, "r", encoding="utf-8") as f:
    existing_watches = json.load(f)

with zipfile.ZipFile(zip_path, "r") as z:
    export_data = json.loads(z.read("export.json").decode("utf-8"))

print(f"Comparing {len(export_data)} archive posts against {len(existing_watches)} live watches.\n")

# Let's extract key identifiers from existing watches
existing_refs = {}
existing_names = {}
existing_descriptions = {}

for w in existing_watches:
    ref = str(w.get("reference_number", "")).strip().lower()
    name = str(w.get("name", "")).strip().lower()
    desc = str(w.get("description", "")).strip().lower()
    wid = w.get("id")

    if ref and ref not in ("n/a", "none", "unknown", "-"):
        existing_refs[ref] = w
    if name:
        existing_names[name] = w
    if desc:
        existing_descriptions[wid] = desc

print(f"Existing indexed references: {len(existing_refs)}")
print(f"Existing indexed names: {len(existing_names)}")

# Let's check each post in export_data
exact_matches = []
possible_matches = []
new_candidates = []

for idx, p in enumerate(export_data):
    cap = p.get("caption", "").strip()
    cap_lower = cap.lower()
    post_id = p.get("post_id")
    price = p.get("detected_price")

    # Extract model / ref number from caption if present
    # Examples: "Model number:SGW-300H", "Model number: LDF-52", "Ref: 8200", "Model: 8200"
    model_ref = None
    ref_match = re.search(r"(?:model\s*(?:number|num)?|ref(?:erence)?\s*(?:number|num)?)\s*[:\-]?\s*([A-Za-z0-9_\-\/]+)", cap, re.IGNORECASE)
    if ref_match:
        model_ref = ref_match.group(1).strip()

    # Check for match
    matched_existing = None
    match_reason = None

    # Check reference match
    if model_ref:
        clean_ref = model_ref.lower()
        for eref, ew in existing_refs.items():
            if clean_ref == eref or clean_ref in eref or eref in clean_ref:
                matched_existing = ew
                match_reason = f"Reference match: '{model_ref}' ≈ '{ew.get('reference_number')}'"
                break

    # Check post_id inside existing description or service history or id
    if not matched_existing:
        for ew in existing_watches:
            full_str = (ew.get("description", "") + " " + ew.get("service_history", "") + " " + ew.get("id", "")).lower()
            if post_id.lower() in full_str:
                matched_existing = ew
                match_reason = f"Instagram Post ID match: {post_id}"
                break

    # Check strong title/model similarity
    if not matched_existing:
        for ew in existing_watches:
            ew_name = ew.get("name", "").lower()
            ew_brand = ew.get("brand", "").lower()
            # If both brand and specific model match
            if model_ref and ew_brand in cap_lower and model_ref.lower() in ew_name:
                matched_existing = ew
                match_reason = f"Brand + Model in name: {ew_brand} + {model_ref}"
                break

    if matched_existing:
        # Determine if confirmed or possible
        is_confirmed = False
        if post_id.lower() in (matched_existing.get("description", "") + " " + matched_existing.get("id", "")).lower():
            is_confirmed = True
        elif model_ref and matched_existing.get("reference_number", "").lower() == model_ref.lower():
            # Check price or brand
            if matched_existing.get("brand", "").lower() in cap_lower:
                is_confirmed = True
        
        entry = {
            "post_index": idx + 1,
            "post_id": post_id,
            "model_ref": model_ref,
            "detected_price": price,
            "existing_id": matched_existing.get("id"),
            "existing_name": matched_existing.get("name"),
            "existing_price": matched_existing.get("price"),
            "reason": match_reason,
            "confirmed": is_confirmed
        }
        if is_confirmed:
            exact_matches.append(entry)
        else:
            possible_matches.append(entry)
    else:
        new_candidates.append({
            "post_index": idx + 1,
            "post_id": post_id,
            "model_ref": model_ref,
            "detected_price": price,
            "caption_snippet": cap[:80].replace("\n", " ")
        })

print("=" * 60)
print(f"DEDUPLICATION RESULTS:")
print(f"CONFIRMED DUPLICATES: {len(exact_matches)}")
for m in exact_matches:
    print(f"  [Post {m['post_index']:03d} - {m['post_id']}] -> MATCHES [{m['existing_id']}] {m['existing_name']} (Reason: {m['reason']})")

print(f"\nPOSSIBLE DUPLICATES: {len(possible_matches)}")
for m in possible_matches:
    print(f"  [Post {m['post_index']:03d} - {m['post_id']}] -> MAY MATCH [{m['existing_id']}] {m['existing_name']} (Reason: {m['reason']})")

print(f"\nNEW PRODUCTS: {len(new_candidates)}")
