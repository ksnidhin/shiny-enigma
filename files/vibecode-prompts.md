# Vibecode Prompts — RetroTimeCo (for Antigravity)

How to use this file:
- Keep `PROJECT_CONTEXT.md` in the repo root. Start every new Antigravity session by pointing it at that file first — either paste it in or reference it explicitly ("Read PROJECT_CONTEXT.md before doing anything").
- Run milestones **in order, one per session**. Don't jump ahead — later prompts assume earlier ones are done.
- Paste each milestone block below as-is. Replace nothing unless a prompt says `[fill in]`.
- After Antigravity finishes a milestone, check it against that milestone's **Acceptance Criteria** before starting the next one. If it fails, use the Bug Fixing template at the bottom rather than re-running the whole milestone prompt.

---

## M0 — Foundation

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Scaffold the monorepo foundation. No visual components yet — this milestone is config only.

FILES TO CREATE:
- Monorepo root with turborepo (pnpm workspaces): apps/storefront, apps/backend, packages/shared-types
- apps/storefront: Next.js 15 App Router + TypeScript project
- Tailwind CSS v4 config with the exact design tokens from PROJECT_CONTEXT.md (colors, radius, shadow) added as theme extensions, not hardcoded per-component
- Font loading via next/font: Cormorant Garamond (headings) and Inter (body), self-hosted, no Google Fonts CDN link tags
- ESLint + Prettier + strict tsconfig (no implicit any, no any type allowed)
- packages/shared-types with an initial empty index.ts we'll fill in M6

CONSTRAINTS:
- Follow the stack table in PROJECT_CONTEXT.md exactly — do not add any dependency not listed there
- Do not create any page content yet beyond a blank app/page.tsx that just renders "RetroTimeCo" in the heading font, to prove fonts/colors are wired correctly

ACCEPTANCE CRITERIA:
- `pnpm dev` runs the storefront with no errors
- The homepage placeholder renders "RetroTimeCo" in Cormorant Garamond
- Tailwind classes using the custom color tokens (e.g. bg-brand, text-primary) work and render the correct hex values
- No shadcn, no GSAP, no Lenis, no Zustand present anywhere in package.json
```

---

## M1 — Design System Primitives

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Build the core custom UI primitives that every later page will depend on. No prebuilt component library — Radix UI only where explicitly listed.

FILES:
- apps/storefront/components/ui/Button.tsx (primary and secondary variants per PROJECT_CONTEXT.md button spec)
- apps/storefront/components/ui/Input.tsx
- apps/storefront/components/ui/Select.tsx (wraps Radix Select, fully custom-styled, no default Radix theme visible)
- apps/storefront/components/ui/Dialog.tsx (wraps Radix Dialog)
- apps/storefront/components/ui/Tooltip.tsx (wraps Radix Tooltip)
- apps/storefront/components/ui/Typography.tsx (Heading, Body, Label components mapping to the two-font system)
- apps/storefront/app/style-guide/page.tsx — a temporary internal page rendering every primitive in every state (default, hover, focus, disabled, error where applicable)

CONSTRAINTS:
- Radix primitives must be unstyled imports, restyled entirely with our Tailwind tokens — no visible trace of Radix's default look
- Every interactive primitive must have a visible focus state (keyboard accessibility, not just mouse hover)
- Border radius is 16px everywhere, shadow is the subtle token only, never heavier

ACCEPTANCE CRITERIA:
- /style-guide renders all primitives and all their states without errors
- Tabbing through the style-guide page with keyboard only reaches every interactive element with a visible focus ring
- No component imports anything from shadcn/ui, Radix Themes, or any other prebuilt styled library
```

---

## M2 — Layout & Navigation

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Build the site shell — Nav, Footer, and the page layout wrapper. Use mock/placeholder links; no real pages behind them yet.

FILES:
- apps/storefront/components/layout/Nav.tsx
- apps/storefront/components/layout/Footer.tsx
- apps/storefront/components/layout/MobileMenu.tsx (uses Dialog primitive from M1)
- apps/storefront/app/layout.tsx (wires Nav + Footer around all pages)

NAV LINKS (placeholder hrefs are fine, routes don't exist yet): Live Watches, Archive, Brands, Authenticity, Contact
FOOTER: repeats nav links + Condition & Service, Shipping & Returns, FAQ + a short brand statement line + social placeholder

CONSTRAINTS:
- Desktop: full horizontal nav. Mobile: hamburger opening the MobileMenu Dialog with a focus trap and correct ARIA (Radix Dialog gives you this — don't break it with custom styling that removes focus handling)
- Footer uses role="contentinfo"
- Animation: Framer Motion only, for the mobile menu open/close — subtle fade/slide, 0.25s duration, no bounce

ACCEPTANCE CRITERIA:
- Nav and Footer render on every route via the root layout
- Mobile menu opens/closes correctly, traps focus while open, and returns focus to the trigger button on close
- No layout shift or console errors when resizing between mobile/tablet/desktop breakpoints
```

---

## M3 — Medusa Data Model

```
Read PROJECT_CONTEXT.md in full before starting. This milestone is backend-only — no frontend work.

OBJECTIVE: Implement the three custom Medusa v2 modules exactly as specified in PROJECT_CONTEXT.md's Data Model section.

FILES:
- apps/backend/src/modules/watch-attributes/models/watch-attributes.ts (all fields listed in PROJECT_CONTEXT.md, correct types, correct enums, correct nullability)
- apps/backend/src/modules/watch-attributes/service.ts
- apps/backend/src/modules/watch-attributes/index.ts
- apps/backend/src/modules/service-history/models/service-record.ts + service.ts + index.ts
- apps/backend/src/modules/authenticity-verification/models/verification-record.ts + service.ts + index.ts
- Module links connecting each of these to the core Medusa Product entity
- Migration files for all three modules

CONSTRAINTS:
- reference_number must be indexed/searchable at the database level, not just present as a field
- condition_grade and archival_status and listing_tier must be real enums, not free-text fields
- Core Product setup: one Variant per Product, inventory_quantity locked to 1, allow_backorder false — this must be enforced by the module/migration, not left to application-layer discipline alone
- Do not touch anything frontend-related in this milestone

ACCEPTANCE CRITERIA:
- Running Medusa Admin (default UI, no custom widget yet) lets you create a Product and see the linked watch-attributes record fields, even in raw/JSON form
- Attempting to set inventory_quantity above 1 on a variant fails at the database/module level
- All three modules pass their own migration cleanly on a fresh database
```

---

## M4 — Admin Extensions

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Build a custom Medusa Admin UI widget so staff fill in watch-attributes through a real form, not raw metadata/JSON. Also implement the Admin/Editor role split.

FILES:
- apps/backend/src/admin/widgets/watch-attributes-form.tsx — grouped sections: Identity, Mechanical, Condition, Accessories, Provenance, Lifecycle — matching the field groupings in PROJECT_CONTEXT.md's data model
- Role/permission setup distinguishing Admin (full access) from Editor (create/edit/upload only — no delete, no mark-sold, no reserve, no settings) per PROJECT_CONTEXT.md's Roles section

CONSTRAINTS:
- Use React Hook Form + Zod for the widget form, with a single shared Zod schema that mirrors the required-fields list in PROJECT_CONTEXT.md exactly
- Publish must be blocked (disabled button + inline validation errors) until every field on the "Required fields for publish" list is filled
- Editor role must see the same form but must not be able to change archival_status to "reserved" or "sold", or access user management

ACCEPTANCE CRITERIA:
- Logging in as an Editor account: can create and save a Draft with all fields, cannot publish/reserve/mark-sold, cannot see user management
- Logging in as an Admin account: can do everything above plus publish, reserve, mark sold, manage users
- Attempting to publish with a missing required field shows a specific inline error naming the missing field, not a generic failure
```

---

## M5 — Mark-Sold Workflow

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Implement the mark-watch-sold workflow as a single atomic, idempotent action, plus the separate manual Reserve action.

FILES:
- apps/backend/src/workflows/mark-watch-sold.ts
- Wire this workflow to an Admin action (button/menu item) visible only to Admin role, on the product detail view in Medusa Admin
- A separate, simpler "Reserve" action (Admin only) that sets archival_status to "reserved" without going through the full sold workflow

CONSTRAINTS:
- The workflow must be a genuine Medusa Workflow (steps, not a single inline function) so it's retryable and auditable
- Running the workflow twice on the same product must not cause any inconsistent state — it should be safely idempotent
- This workflow only changes archival_status and any directly dependent fields — do not add notify-me matching or sitemap triggers yet, that's a later phase

ACCEPTANCE CRITERIA:
- Clicking "Mark Sold" as Admin transitions archival_status from live/reserved to sold reliably
- Triggering the workflow a second time on an already-sold product does not error or corrupt data — write a quick manual test proving this
- Editor role cannot see or trigger either action
```

---

## M6 — Homepage (mock data)

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Build the Home page against mock data only. No backend calls in this milestone.

FILES:
- apps/storefront/app/page.tsx
- packages/shared-types/index.ts — define the Watch type here now (mirroring watch-attributes fields from PROJECT_CONTEXT.md exactly, since this shape must survive unchanged into M10)
- apps/storefront/lib/mock-data/watches.ts — 6-8 realistic mock Watch objects matching the Watch type, mixing archive and catalog tier, mixing live and sold status
- apps/storefront/components/layout/FeaturedWatchGrid.tsx
- apps/storefront/components/layout/TrustStrip.tsx
- apps/storefront/components/layout/CuratorNote.tsx

PAGE CONTENT: hero area (brand statement, not a generic banner), FeaturedWatchGrid pulling 3-6 mock watches flagged is_featured, CuratorNote (short founder-voice paragraph), TrustStrip (authenticity process line, years dealing, archive count — use placeholder real-sounding numbers).

CONSTRAINTS:
- No carousels of unrelated marketing banners — this page should read like the front page of a small credible archive, not a generic e-commerce homepage
- Everything must be typed against packages/shared-types, not ad hoc inline types

ACCEPTANCE CRITERIA:
- Homepage renders fully from mock data with no backend dependency
- All rendered watch data is typed via the shared Watch type, verifiable by hovering the mock array in the editor
- Responsive at mobile/tablet/desktop per the grid spec in PROJECT_CONTEXT.md
```

---

## M7 — Catalog Pages (mock data)

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Build Live Watches and Sold Archive browsing, filtering entirely against mock data.

FILES:
- apps/storefront/app/watches/page.tsx (Live Watches)
- apps/storefront/app/archive/page.tsx (Sold Archive)
- apps/storefront/components/watch/WatchCard.tsx
- apps/storefront/components/watch/WatchGrid.tsx
- apps/storefront/components/watch/FilterBar.tsx
- apps/storefront/components/ui/EmptyState.tsx

WATCHCARD CONTENT (only): large image, brand, model, reference number, price, availability status. No extra badges or clutter, per the design system's product card spec.
SOLD STATUS VISUAL: muted grey label, never red, per PROJECT_CONTEXT.md.
FILTERBAR: brand, type, era, price range — filter state lives in the URL as search params, not component state.

CONSTRAINTS:
- Live Watches and Sold Archive should reuse WatchCard/WatchGrid, differing only in which mock data set they pull from and a "Sold" visual variant on the card
- Zero-result filter combination must render EmptyState with a real message ("No watches currently match these filters"), not a blank grid
- No client-side global state library — filters via URL search params only

ACCEPTANCE CRITERIA:
- Filtering by brand/type/era/price correctly narrows the mock grid and updates the URL
- Reloading the page with filters already in the URL restores the same filtered view (proves state lives in the URL, not memory)
- Sold Archive displays the same layout pattern as Live Watches, with sold items visually distinct via the muted grey treatment
- A filter combination with zero mock matches renders EmptyState, not an empty <div>
```

---

## M8 — Product Page (mock data)

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Build the full Product Page against one mock Watch object. This is the highest-stakes page in the app — treat every section as load-bearing for trust, not decorative.

FILES:
- apps/storefront/app/watches/[brand]/[slug]/page.tsx
- apps/storefront/components/watch/PhotoGallery.tsx (uses Dialog primitive for lightbox)
- apps/storefront/components/watch/SpecTable.tsx
- apps/storefront/components/watch/ConditionBlock.tsx
- apps/storefront/components/watch/ServiceHistoryTimeline.tsx
- apps/storefront/components/watch/AuthenticityBadge.tsx
- apps/storefront/components/cta/WhatsAppCTA.tsx
- apps/storefront/lib/whatsapp.ts — implement buildWhatsAppLink(product, intent) using the exact message templates in PROJECT_CONTEXT.md
- apps/storefront/lib/grading-scale.ts — the single source of truth for condition grade labels, imported by ConditionBlock (this file will also be referenced by the Condition & Service static page in M9 — do not duplicate the labels there)

LAYOUT ORDER (top to bottom, per design system): Gallery → title/brand/reference → price → WhatsAppCTA (Buy Now, primary) + secondary Ask a Question CTA next to it, not buried below → SpecTable → ConditionBlock (grade + condition_notes + originality_notes, visually separated from each other, not blended into one paragraph) → ServiceHistoryTimeline → AuthenticityBadge (short form, links to /authenticity) → Related Watches placeholder (can be a static mock list, real logic comes later).

CONSTRAINTS:
- WhatsAppCTA must render as a real <a> tag with a proper wa.me href — not a JS-only onClick handler — so it works without JS and is screen-reader friendly
- ConditionBlock: condition_notes and originality_notes are visually separate blocks, not merged
- PhotoGallery lightbox: keyboard arrow navigation, focus returns to the trigger thumbnail on close

ACCEPTANCE CRITERIA:
- Product page renders completely from one mock Watch object with no backend calls
- Clicking Buy Now opens a WhatsApp link containing the correct prefilled message with real product data substituted in
- Clicking Ask a Question opens a WhatsApp link with the open-ended template, not the Buy Now template
- Keyboard-only navigation can open the gallery lightbox, move between images, and close it, with focus landing back on the original thumbnail
```

---

## M9 — Static Trust Pages

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Build the static trust/policy pages.

FILES:
- apps/storefront/app/authenticity/page.tsx
- apps/storefront/app/condition-and-service/page.tsx
- apps/storefront/app/shipping-and-returns/page.tsx
- apps/storefront/app/faq/page.tsx
- apps/storefront/app/contact/page.tsx

CONTENT NOTES:
- Authenticity page: describe a specific verification process (staff review, what's checked, credentials), not a vague guarantee statement
- Condition & Service page: render the grading scale from lib/grading-scale.ts (import it, do not re-type the labels here) plus a servicing philosophy paragraph
- Shipping & Returns: state the 5-day replacement policy scoped explicitly to defect/authenticity issues, not general buyer's remorse — this distinction should be stated in the copy itself, not just implied
- FAQ: use an accordion built from the Dialog/Disclosure pattern already established, not a new pattern
- Contact page: WhatsAppCTA in "general" intent variant (no product prefill), plus a visible phone number and email as non-JS fallback

CONSTRAINTS:
- Condition & Service page must import the same grading-scale source of truth used on the Product Page — do not hardcode the labels a second time anywhere

ACCEPTANCE CRITERIA:
- All five pages render with real (not lorem ipsum) copy following the notes above
- The grading scale displayed on /condition-and-service is provably the same data source as ConditionBlock on the product page (change one label in lib/grading-scale.ts and confirm both places update)
- Contact page's WhatsApp link opens with the general-intent template, distinct from the product-page templates
```

---

## M10 — API Integration: Catalog

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Replace mock data on Live Watches and Sold Archive with real Medusa Store API queries. This is a data-source swap only — no visual changes permitted.

FILES:
- apps/storefront/lib/medusa-client.ts — thin fetch wrapper against the Medusa Store API
- Modify apps/storefront/app/watches/page.tsx and apps/storefront/app/archive/page.tsx to query real data
- URL search params from FilterBar should now translate into real query params against the watch-attributes fields (brand, type, era, price range) via Postgres filtering — no Meilisearch yet

CONSTRAINTS:
- Do not touch WatchCard, WatchGrid, FilterBar, or EmptyState visually — only the data source changes
- Confirm the Medusa API response maps 1:1 onto the Watch type in packages/shared-types with no shape mismatches; if a mismatch exists, fix the type or the query, do not silently cast with `as`

ACCEPTANCE CRITERIA:
- Live Watches and Sold Archive render real data from Medusa with zero visual diff from the M7 mock-data version
- Filtering still works identically, now hitting the real database instead of the mock array
- TypeScript has no `any` or unsafe casts introduced during this integration
```

---

## M11 — API Integration: Product Page

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Replace the mock Watch object on the Product Page with a real Medusa query, including all three custom modules (watch-attributes, service-history, authenticity-verification).

FILES:
- Modify apps/storefront/app/watches/[brand]/[slug]/page.tsx to fetch real product data by slug
- Extend medusa-client.ts as needed to pull linked service-history and authenticity-verification records alongside the core product and watch-attributes

CONSTRAINTS:
- No visual changes from M8 — this is a data-source swap only
- If a product has zero service-history records, ServiceHistoryTimeline must render its existing empty state, not break or hide the section silently
- WhatsAppCTA message generation must now use real product data — verify the generated message text is correct for a real product, not just structurally similar to the mock version

ACCEPTANCE CRITERIA:
- A real product's page renders identically in layout/behavior to the M8 mock-data version
- Buy Now / Ask a Question links generate correct messages from real data
- A product with no service history renders the correct empty state without errors
```

---

## M12 — Empty States & Error Flows

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Implement the remaining error/empty flows not yet covered.

FILES:
- apps/storefront/app/watches/[brand]/[slug]/not-found.tsx (invalid slug → 404, links to Live Watches and Archive)
- apps/storefront/app/archive/page.tsx — add an "early archive" empty state (distinct copy from the zero-filter-result empty state built in M7) for when the archive genuinely has zero items yet
- A non-JS fallback on WhatsAppCTA: if the wa.me link somehow fails to open (rare, mostly a desktop edge case), the CTA area should also show a visible phone number and "or email us" link at all times, not just on failure — build it as always-visible, not a JS-detected fallback

CONSTRAINTS:
- The 404 page and empty states must not read as generic/broken — they should carry the same editorial tone as the rest of the site, per PROJECT_CONTEXT.md's brand voice

ACCEPTANCE CRITERIA:
- Visiting a nonexistent product slug renders the custom 404, not Next.js's default
- Archive with zero mock/real items shows distinct, on-brand copy, not a blank grid
- Product page's WhatsApp CTA area always shows the phone/email fallback alongside the WhatsApp link, visible without needing JS to fail first
```

---

## M13 — SEO

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Implement SEO requirements per PROJECT_CONTEXT.md's permanence rules.

FILES:
- Add generateMetadata to the Product Page for per-product title/description (using seo_title_override/seo_description_override when present, sensible defaults otherwise)
- Add JSON-LD Product schema to the Product Page, with offers.availability reflecting archival_status: live/reserved → InStock, sold/archived → OutOfStock — never remove the Offer block entirely for sold items
- apps/storefront/app/sitemap.ts including live, reserved, sold, and archived products — no exclusions
- Confirm no redirect or noindex logic exists anywhere for sold/archived products

CONSTRAINTS:
- This must not change any product's URL structure — canonical URL is stable for the life of the listing per PROJECT_CONTEXT.md constraint #6

ACCEPTANCE CRITERIA:
- A sold product's page still returns valid Product JSON-LD with availability OutOfStock, not a stripped/removed schema block
- Sitemap includes archived products
- No product route contains redirect or noindex logic tied to archival_status
```

---

## M14 — Performance Pass

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Bring the Product Page's mobile LCP under 2.5s on a representative 4G profile.

FILES: apps/storefront/components/watch/PhotoGallery.tsx and any image-loading logic across WatchCard/PhotoGallery.

CONSTRAINTS:
- Use next/image responsive sizing correctly (proper sizes attribute, priority only on the actual LCP image, not every image)
- No visual regression, and do not over-compress or alter photography in a way that conflicts with the brand's "authentic, unedited photography" rule — this is a delivery optimization, not a re-edit of the images themselves

ACCEPTANCE CRITERIA:
- Measured LCP on a representative product page, mobile, throttled to 4G, is under 2.5s
- No visual diff in image quality/crop/color from before this pass
```

---

## M15 — Accessibility Pass

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Bring Product Page, Live Watches/Archive (filters), and the Admin listing form to WCAG 2.1 AA.

FILES: Audit and fix as needed across PhotoGallery, FilterBar, Dialog-based components, and the Admin watch-attributes-form widget. Do not rewrite components from scratch — patch specific issues found.

CONSTRAINTS:
- Fixes should stay within the existing design token color system; if a token genuinely fails contrast, flag it explicitly rather than silently picking an off-brand color

ACCEPTANCE CRITERIA:
- Automated accessibility audit (e.g. axe) on Product Page, Live Watches, and the Admin form shows zero critical/serious issues
- Full keyboard-only pass: can browse, filter, open a product, open the gallery lightbox, and reach both WhatsApp CTAs, without a mouse
- Screen reader pass confirms condition grade, price, and availability status are all announced clearly on the product page
```

---

## M16 — Testing

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Write automated tests for the highest-risk business rules identified in the blueprint's risk table.

FILES: apps/backend/src/modules/**/*.test.ts and apps/backend/src/workflows/mark-watch-sold.test.ts (or equivalent per whatever test runner is already configured)

TESTS TO WRITE:
1. Inventory quantity cannot be set/incremented above 1 for any product variant — test both the direct DB path and the module path
2. Running the mark-watch-sold workflow twice on the same product does not produce inconsistent state or duplicate side effects
3. A sold/archived product's canonical URL and route remain resolvable and return valid data (no redirect, no 404) — this protects the permanent-archive rule

CONSTRAINTS:
- Each test must be shown failing against a deliberately broken version of the relevant code, then passing against the correct version — don't submit a test that would pass regardless of whether the rule is actually enforced

ACCEPTANCE CRITERIA:
- All three tests exist, pass against current code, and were verified to fail against an intentionally broken version during development
```

---

## M17 — Deployment

```
Read PROJECT_CONTEXT.md in full before starting.

OBJECTIVE: Production deployment per the locked stack — Vercel (frontend), Railway (backend), Cloudflare R2 + Cloudflare CDN (storage).

FILES: vercel.json / Vercel project config, Railway service config, .env.example for both apps (no real secrets committed), any Cloudflare R2 bucket/CDN config docs.

CONSTRAINTS:
- No secrets hardcoded or committed anywhere — .env.example only, with placeholder values and comments explaining each variable
- Admin routes must not be publicly linked from the storefront navigation — internal access only

ACCEPTANCE CRITERIA:
- Production frontend and backend are both live and reachable at their respective domains
- Smoke test of the primary flow passes in production: browse Live Watches → open a product → click Buy Now → WhatsApp opens with the correct prefilled message
- Medusa Admin is reachable but not linked from any public-facing page
```

---

## Utility Prompts (use as needed between milestones)

### Bug Fixing
```
Read PROJECT_CONTEXT.md before starting.
OBJECTIVE: Fix [specific defect] in [file/component].
REPRODUCTION: [steps] — EXPECTED: [behavior] — ACTUAL: [behavior]
CONSTRAINTS: Fix only the named file(s). If the fix requires touching a shared component, stop and state the blast radius before proceeding.
ACCEPTANCE CRITERIA: Reproduction steps no longer trigger the defect. No regression in that component's other states.
```

### Refactoring
```
Read PROJECT_CONTEXT.md before starting.
OBJECTIVE: Refactor [component/module] for [reason].
CONSTRAINTS: No behavior change, no prop/API surface change unless stated and all call sites updated in the same pass.
ACCEPTANCE CRITERIA: All prior acceptance criteria for this component still pass after the refactor.
```
