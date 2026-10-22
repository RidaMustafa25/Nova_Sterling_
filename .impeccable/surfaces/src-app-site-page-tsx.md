---
version: 1
slug: "src-app-site-page-tsx"
primary_target: "src/app/(site)/page.tsx"
related_targets: ["src/app/(site)/layout.tsx","src/components/Header.tsx"]
---

# Storefront (whole site)

Scope: every storefront route under src/app/(site) plus shared Header, Footer, CartDrawer, product cards. Home and catalog are Persuade; product, cart, checkout, account, login/register are Operate inside the same world; privacy/terms are Read inside the same world.

Audience and action: premium/luxury shoppers buying for themselves or as gifts; the action is add to cart then checkout. Proof available: real product data only. No reviews, press or shipping claims exist; none may be invented. Constraints: keep the perspective tunnel hero and the kinetic navigation (user-pinned); keep every working function.

Memorable moment: stitched swatches flying through the oxblood tunnel, then a fanned swatch book you open one piece at a time.

## Direction contract

THESIS: The store is a tannery's swatch book. Each product is a tabbed, stitched card cut from a saturated hide. It refuses the category default of white pages, a centred headline and a row of equal grey cards.

OWN-WORLD: Saturated hide colour fields own whole regions: oxblood #5a1a1f ground, saddle #a8582a, bridle #1c1411, veg-tan #d6a46a; ivory thread #ece0c8 only for type and stitching. Dashed saddle-stitch seams inset from swatch edges, die-cut index tabs, debossed labels, die-stamped sequence numbers (Nº 004). No boxed cards or drop shadows; hierarchy by scale contrast and colour field alone. Strict edge grid: tabs, labels and prices flush to the swatch edges.

STORY: The visitor sees goods made to last, trusts a careful maker, opens one piece and adds it to the cart without friction.

FIRST VIEWPORT: Kinetic bar across the top (logo left, Menu right). Tunnel hero on the oxblood field: stitched swatches fly toward the viewer; centred eyebrow NOVA STERLING LTD, debossed display headline CRAFTED / TO LAST. at about 130px, primary action Shop the collection directly beneath. The swatch book's tabs peek at the bottom edge.

FORM: Tannery colour card, candidate 3 of 7 (roll-assigned). seed:a443467b2d45407b. Raises: one piece held at a time (hover dims the rest); scale-contrast hierarchy; product page piece owns the centre with facts ranked in its corners; strict edge grid; sequence numbers on every swatch.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Currency: site.ts says USD, pages show £. Keep whatever each page shows until the owner decides.
- Real company details are placeholders in src/lib/site.ts.
