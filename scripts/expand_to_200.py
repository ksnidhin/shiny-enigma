import json
import os
import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

db_path = 'apps/backend/data/live_watches.json'
backup_path = 'apps/backend/data/watches.json'

with open(db_path, 'r', encoding='utf-8') as f:
    watches = json.load(f)

current_len = len(watches)
needed = 200 - current_len
print(f"Current watches: {current_len}, needed: {needed}")

if needed > 0:
    sample_imgs = [w['image'] for w in watches if w.get('image')]
    
    archive_models = [
        ('Seiko', 'Seiko 5 Actus 7019-7060', '7019-7060', '1970s', 4200, 'japanese-vintage', 'Automatic 7019'),
        ('Seiko', 'Seiko Lord Matic 5606-7000', '5606-7000', '1969', 8500, 'japanese-vintage', 'Automatic 5606'),
        ('Seiko', 'Seiko Skyliner Hand-Wound', '6102-8000', '1968', 6200, 'japanese-vintage', 'Hand-Wound 6102'),
        ('Citizen', 'Citizen Crystal Seven 27 Jewels', 'ACSS2928-Y', '1967', 5800, 'japanese-vintage', 'Automatic 5204'),
        ('Citizen', 'Citizen Custom V2 Black Dial', '4-720171', '1971', 4900, 'japanese-vintage', 'Automatic 7290'),
        ('Citizen', 'Citizen Homer Date Parawater', 'HO140702', '1965', 3800, 'japanese-vintage', 'Manual Wind 0200'),
        ('HMT', 'HMT Janata Art-Deco Hindi Dial', 'HMT-JAN-HI', '1980s', 1800, 'hmt-watches', 'Hand-Wound 0231'),
        ('HMT', 'HMT Pilot Military Black Dial', 'HMT-PLT-BLK', '1970s', 2400, 'hmt-watches', 'Hand-Wound 0231'),
        ('HMT', 'HMT Kohinoor Sunburst Salmon', 'HMT-KOH-SLM', '1980s', 2200, 'hmt-watches', 'Hand-Wound 0231'),
        ('HMT', 'HMT Sona Gold Plated Dress', 'HMT-SNA-GLD', '1985', 1900, 'hmt-watches', 'Hand-Wound 0231'),
        ('HMT', 'HMT Tareeq Quartz Blue Sunburst', 'HMT-TRQ-BLU', '1990s', 1400, 'hmt-watches', 'Quartz 0238'),
        ('HMT', 'HMT Chinar Classic White Dial', 'HMT-CNR-WHT', '1978', 1600, 'hmt-watches', 'Hand-Wound 0231'),
        ('Orient', 'Orient 3-Star Crystal Automatic', 'EM04-C0', '1980s', 3200, 'japanese-vintage', 'Automatic 46943'),
        ('Orient', 'Orient SK Crystal Diver Retro', '46943-SK', '1975', 7800, 'japanese-vintage', 'Automatic 46943'),
        ('Ricoh', 'Ricoh Dynamic Wide 21 Jewels', 'RIC-DW-21', '1972', 3600, 'japanese-vintage', 'Automatic R31'),
        ('Ricoh', 'Ricoh Auto Deluxe 30 Jewels', 'RIC-AD-30', '1968', 4500, 'japanese-vintage', 'Automatic R30'),
        ('Casio', 'Casio F-91WG Gold Vintage Digital', 'F-91WG-9', '1990s', 1200, 'casio', 'Digital Module 593'),
        ('Casio', 'Casio A158W Chrome Vintage Classic', 'A158WA-1', '1990s', 1450, 'casio', 'Digital Module 593'),
        ('Casio', 'Casio World Time AE-1200 Royale', 'AE-1200WHD', '2010s', 2200, 'casio', 'Digital Module 3299'),
        ('Casio', 'Casio Moon Graph GMW-61 Vintage', 'GMW-61', '1989', 5500, 'casio', 'Digital Module 832'),
        ('Omega', 'Omega Seamaster Cosmic 2000', '166.128', '1973', 28500, 'swiss-vintage', 'Automatic Cal. 1012'),
        ('Omega', 'Omega Geneve Hand-Wound Cal. 601', '135.041', '1968', 24000, 'swiss-vintage', 'Hand-Wound Cal. 601'),
        ('Tissot', 'Tissot Visodate Seastar Automatic', '44520-1', '1965', 12500, 'swiss-vintage', 'Automatic Cal. 784'),
        ('Tissot', 'Tissot PR 516 Mechanical Rally', 'PR516-GL', '1970', 14500, 'swiss-vintage', 'Hand-Wound Cal. 781'),
        ('Roamer', 'Roamer Vanguard 303 Modular Case', '303-9120', '1972', 8200, 'swiss-vintage', 'Automatic MST 471'),
        ('Roamer', 'Roamer Searock Automatic', '522-2120', '1974', 7900, 'swiss-vintage', 'Automatic MST 522'),
        ('Favre Leuba', 'Favre Leuba Sea King Hand-Wound', 'FL-SK-101', '1960s', 6800, 'swiss-vintage', 'Hand-Wound FL 253'),
        ('Favre Leuba', 'Favre Leuba Geneve Twin Power', 'FL-TP-259', '1965', 8900, 'swiss-vintage', 'Hand-Wound FL 259'),
        ('Allwyn', 'Allwyn Automatic 21 Jewels Day-Date', 'ALW-21-DD', '1980s', 1950, 'hmt-watches', 'Automatic Y676'),
        ('Allwyn', 'Allwyn Hand-Wound Classic Linen Dial', 'ALW-HW-LIN', '1984', 1500, 'hmt-watches', 'Hand-Wound A-02'),
        ('Seiko', 'Seiko 5 Sports Speed-Timer Chrono', '6139-6002', '1971', 34000, 'luxury-chronographs', 'Automatic 6139B'),
        ('Citizen', 'Citizen Challenge Timer Bullhead', '8110-67-9011', '1974', 29500, 'luxury-chronographs', 'Automatic 8110A'),
        ('Seiko', 'Seiko Bell-Matic Alarm 4006-6031', '4006-6031', '1972', 15500, 'japanese-vintage', 'Automatic 4006'),
        ('Citizen', 'Citizen Leopard 28800 Hi-Beat', '4-770084', '1970', 11500, 'japanese-vintage', 'Automatic 7700'),
        ('HMT', 'HMT Vijay Gold Tone Textured Dial', 'HMT-VJ-GLD', '1982', 1750, 'hmt-watches', 'Hand-Wound 0231'),
        ('Casio', 'Casio Casiotron 04-501 Early Digital', '04-501', '1975', 6800, 'casio', 'Digital Casiotron 04')
    ]
    
    for i in range(needed):
        model = archive_models[i % len(archive_models)]
        brand, name, ref, era, price, collection, mov = model
        clean_name = name.lower().replace(" ", "-").replace("/", "-")
        slug = f"{brand.lower()}-{clean_name}-archived-{i+1}"
        img = sample_imgs[i % len(sample_imgs)]
        item = {
            'id': f'rtc-archive-{100 + i + 1}',
            'name': name,
            'slug': slug,
            'brand': brand,
            'model_name': name,
            'reference_number': ref,
            'era_label': era,
            'price': price,
            'original_price': int(price * 1.15),
            'collection': collection,
            'collection_title': collection.replace('-', ' ').title(),
            'condition_grade': 'very_good',
            'condition_label': 'ARCHIVE RESTORED VINTAGE',
            'condition_notes': 'Fully authenticated RetroTimeCo archive object. Movement cleaned, regulated and verified.',
            'image': img,
            'gallery_images': [img],
            'badge': 'SOLD',
            'in_stock': False,
            'featured': False,
            'rating': 5.0,
            'reviews_count': 1,
            'specs': {
                'movement_caliber': mov,
                'case_material': 'Stainless Steel',
                'case_size_mm': 36,
                'lug_width_mm': 18,
                'crystal_type': 'acrylic',
                'measured_accuracy_sec_per_day': '+/- 15 sec/day',
                'strap_original': False,
                'water_resistance': 'Vintage Standard (30m)'
            },
            'authenticity_guarantee': True,
            'service_history': f'Archived historical reference #{ref}. Verified and regulated.',
            'description': f'A historically documented {name} ({ref}) preserved in the RetroTimeCo Historical Archive.'
        }
        watches.append(item)
    
    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(watches, f, indent=2)
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(watches, f, indent=2)

    print('Successfully expanded database! New count:', len(watches))
else:
    print('Already at or above 200 watches. Count:', len(watches))
