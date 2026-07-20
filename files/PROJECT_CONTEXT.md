# PROJECT_CONTEXT.md — RetroTimeCo
### Read this file in full at the start of every session before writing any code.

This file is the single source of truth for stack, constraints, data model, and conventions. Every milestone prompt in `vibecode-prompts.md` assumes you have read this. If a milestone prompt conflicts with this file, this file wins — flag the conflict instead of silently picking one.

---

## Stack (locked — do not substitute)

| Layer | Choice |
|---|---|
| Frontend | Next.js 15, App Router, TypeScript (strict, no `any`) |
| Styling | Tailwind CSS v4 — utility classes only, no separate CSS files unless justified |
| Component primitives | Radix UI (unstyled) — **only** for Dialog, Dropdown Menu, Popover, Select, Tooltip. Everything else built from scratch. |
| Icons | Lucide React only |
| Animation | Framer Motion only — scoped to page transitions, image transitions, hover states, gallery interactions |
| Forms | React Hook Form + Zod |
| Data fetching | Server Components by default. TanStack Query only for client-side interactions that genuinely need caching/refetch. |
| State | URL search params + React Context. Zustand only if a real cross-page client state need appears — do not add it preemptively. |
| Backend | Medusa v2 |
| Database | PostgreSQL |
| Search | Postgres filtering via Medusa modules (V1). Meilisearch only when catalog size/filter complexity justifies it — not yet. |
| Storage | Cloudflare R2 (S3-compatible) |
| CDN | Cloudflare |
| Deploy — frontend | Vercel |
| Deploy — backend | Railway |
| Fonts | Cormorant Garamond (headings), Inter (body/UI) — self-hosted via `next/font` |

## Hard constraints (never violate, never ask to relax)

1. **No shadcn/ui, DaisyUI, Flowbite, MagicUI, Aceternity, NextUI, Material UI, Ant Design, Chakra, Bootstrap, or any prebuilt design system.** Radix primitives listed above are the only exception, and they must be unstyled/custom-styled, not used with any prebuilt theme.
2. **No GSAP, no Lenis.** Framer Motion only, and only for the interactions listed above. Do not add scroll-hijacking or complex animation sequencing.
3. **No cart, no checkout, no payment integration, no customer accounts anywhere in V1.** Purchase intent is handled entirely by a WhatsApp deep link generated from product data. Do not build toward a cart "just in case" — it adds surface area we don't need yet.
4. **Every watch listing has `inventory_quantity = 1` and `allow_backorder = false`, enforced at the database/module level, not just in the UI.** No SKU is ever restocked. This must be true even for common/high-volume references (Seiko, HMT, etc.) — every unit is a specific physical watch.
5. **Reference number, caliber, case size, condition grade, dial variant, and other filterable/searchable spec fields must be first-class typed fields in the `watch-attributes` custom module — never stored only in Medusa's generic `metadata` JSON.**
6. **Product URLs are permanent for the entire lifecycle of a listing** (live → reserved → sold → archived). Never redirect, never delete, never noindex a sold/archived product page.
7. **The Sold Archive is a public, permanent page — not a fallback or a "coming later" feature.** It must exist from the first milestone that touches catalog browsing.
8. **`listing_tier` field exists on every product** (`archive` | `catalog`) even though V1 UI treats both the same way (WhatsApp-only). This is forward compatibility for a future checkout flow on the `catalog` tier — do not build that checkout flow now, just don't block it later.
9. **Mock data must match the shape in `packages/shared-types` exactly**, so swapping mock data for real Medusa API calls (M10/M11) is a data-source swap only, with zero visual change.
10. **Sold status visual treatment is muted grey, never red.** Sold is an archive state, not an error or urgency state.

## Design Tokens

```css
--color-bg-primary: #F7F3EC;      /* warm ivory — page backgrounds */
--color-text-primary: #1B1B1B;    /* charcoal — headings, body */
--color-brand: #173528;           /* deep forest — primary buttons, nav, footer */
--color-brand-hover: #214836;
--color-accent: #A67C3D;          /* antique brass — highlights, badges, links */
--color-surface: #EEE7DC;         /* secondary surface — cards, sections */
--color-border: #D8D1C5;
--color-text-secondary: #6C6A67;
--color-success: #4F6F52;         /* available / verified / authentic */
--color-sold: #8A8A8A;            /* sold status — muted, never red */
--color-error: #A94442;

--radius: 16px;                    /* consistent everywhere */
--shadow: 0 12px 40px rgba(0,0,0,.06);  /* very subtle, never heavier */

font-heading: 'Cormorant Garamond', serif;
font-body: 'Inter', sans-serif;

grid-desktop: 4 columns;
grid-tablet: 3 columns;
grid-mobile: 2 columns;

animation-duration: 0.25s; /* no bounce, no elastic */
```

Primary button: bg `--color-brand`, white text, hover `--color-brand-hover`, radius `--radius`.
Secondary button: transparent bg, border + text `--color-brand`.

## Data Model (Medusa v2 custom modules)

### `watch-attributes` (1:1 with core Product)
```
brand: text
model_name: text
reference_number: text (searchable, indexed)
era_label: text
era_year_start: number | null
era_year_end: number | null
movement_caliber: text
case_material: text
case_size_mm: number
lug_width_mm: number | null
crystal_type: enum("acrylic","mineral","sapphire") | null
crystal_original: boolean | null
dial_description: text
dial_variant_tag: text | null
hands_notes: text | null
strap_or_bracelet: text
strap_original: boolean
clasp_notes: text | null
condition_grade: enum("excellent","very_good","good","fair","project")
condition_notes: text
originality_notes: text
measured_accuracy_sec_per_day: number | null
accessories: json { box: bool, papers: bool, extra_links: bool, service_papers: bool }
provenance_notes: text | null
collector_notes: text | null
rarity_notes: text | null
curator_note: text | null
archival_status: enum("live","reserved","sold","archived") default "live"
listing_tier: enum("archive","catalog")
is_featured: boolean default false
seo_title_override: text | null
seo_description_override: text | null
```

### `service-history` (1:many, per Product)
```
service_date: dateTime
performed_by: text | null
description: text
documentation_ref: text | null
```

### `authenticity-verification` (1:many, per Product)
```
verified_by: text
verified_at: dateTime
method: text
notes: text | null
```

**Required fields for publish** (the Admin form must block publish without these): brand, model_name, reference_number, era_label, movement_caliber, case_material, case_size_mm, dial_description, strap_or_bracelet, strap_original, condition_grade, condition_notes, originality_notes, accessories, price.

## Folder Structure
```
vintage-watch-platform/
├── apps/
│   ├── storefront/          # Next.js
│   │   ├── app/
│   │   ├── components/{watch,cta,layout,forms}/
│   │   └── lib/{medusa-client.ts, whatsapp.ts, grading-scale.ts}
│   └── backend/              # Medusa v2
│       ├── src/modules/{watch-attributes,service-history,authenticity-verification}/
│       ├── src/admin/widgets/
│       ├── src/workflows/{mark-watch-sold.ts}
│       └── src/api/store/
├── packages/shared-types/
└── turbo.json
```

## WhatsApp Message Templates

Buy Now:
```
Hi, I'm interested in this watch:

{Brand} {Model} — Ref. {reference_number}
Condition: {condition_grade_label}
Price: {formatted_price}
Status: {status}
Link: {product_url}

Is it still available?
```

Ask a Question:
```
Hi, I have a question about this watch:

{Brand} {Model} — Ref. {reference_number}
Link: {product_url}

```

Link format: `https://wa.me/{phone}?text={url_encoded_message}`. Build via a single `buildWhatsAppLink(product, intent)` function in `lib/whatsapp.ts` — never hand-write per-listing text.

## Roles
- **Admin:** full access — create, edit, upload, publish, reserve, mark sold, archive/restore, manage users.
- **Editor:** create drafts, edit listings, upload images. Cannot delete, mark sold, change settings, or reserve.

## Non-negotiable acceptance bar for every milestone
- TypeScript strict, no `any`
- No console errors/warnings
- No visual regression from the previous milestone unless the prompt explicitly says otherwise
- Matches design tokens above exactly — no ad hoc colors, radii, or shadows
