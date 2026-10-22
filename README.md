# NOVA STERLING LTD - Online Store

Modern, responsive e-commerce storefront built with **Next.js (App Router)**, **Tailwind CSS**, **Lucide icons** and **Decap CMS** for product management. Made for deployment on **Vercel** (`novasterlingltd.vercel.app`).

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (run this once before pushing)
```

Requires Node.js 20.9+.

## What's included

| Area | Route | Notes |
| --- | --- | --- |
| Home | `/` | Hero ("Welcome to NOVA STERLING LTD"), Fast Dispatch / Secure Checkout / Quality Guarantee, Featured Products grid |
| Catalog | `/catalog` | Search + sort over all products |
| Product page | `/product/[id]` | Main image + 1-5 thumbnail switcher, price, markdown description, Add to Cart, schema.org Product data |
| Cart | slide-over drawer | Quantities, line totals, subtotal; saved in the browser (localStorage) |
| Checkout | `/checkout` | Order summary only. **Payment is not connected** (see "Next steps") |
| Login / Register | `/login`, `/register` | Validation, error states, redirect to `/account` |
| Account | `/account` | Simple dashboard with logout |
| About / Contact | `/about`, `/contact` | Company overview; contact form, support email, address, hours |
| Legal | `/privacy`, `/terms` | E-commerce Privacy Policy and Terms of Service |
| Admin | `/admin` | Decap CMS: add, edit, delete products, upload 1-5 images each |

## Folder structure

```
nova-sterling-ltd/
├── content/products/          # one JSON file per product (the "database")
├── public/
│   ├── admin/config.yml       # Decap CMS config (git-gateway)
│   ├── admin/config.test.yml  # Decap "test-repo" fallback (open /admin?backend=test)
│   └── uploads/               # product images (Decap media folder)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # fonts + metadata
│   │   ├── admin/page.tsx     # embeds Decap CMS (no storefront header/footer)
│   │   ├── not-found.tsx
│   │   └── (site)/            # storefront pages share header, footer, cart drawer
│   │       ├── layout.tsx, page.tsx
│   │       ├── catalog/, product/[id]/
│   │       ├── login/, register/, account/, checkout/
│   │       └── about/, contact/, privacy/, terms/
│   ├── components/            # Header, CartDrawer, ProductCard, ProductGallery, forms...
│   ├── context/               # CartContext, AuthContext
│   └── lib/                   # site.ts (business details), products.ts, format.ts, validation.ts
├── tailwind.config.ts, postcss.config.mjs, next.config.mjs, tsconfig.json
└── package.json
```

## Product data

Each file in `content/products/` looks like:

```json
{
  "id": "sterling-steel-insulated-bottle",
  "title": "Sterling Steel Insulated Bottle",
  "price": 34,
  "description": "Markdown or plain text...",
  "images": ["/uploads/bottle-1.jpg", "/uploads/bottle-2.jpg"],
  "featured": true
}
```

- `images` holds **1 to 5** paths. The first is the cover image. (Separate `image1` ... `image5` keys are also understood.)
- The page URL is `/product/<id>`. If `id` is missing, the file name is used.
- The 8 sample products and their SVG placeholder images are **demo content** - replace them from `/admin`.

## Decap CMS (`/admin`)

`public/admin/config.yml` defines the Products collection (title, price, markdown description, featured toggle, 1-5 images) with `media_folder: public/uploads` and `public_folder: /uploads`. Saving in the CMS commits to Git, and Vercel redeploys automatically.

**Local editing (no login needed):**

```bash
npm run cms     # terminal 1 - Decap local proxy
npm run dev     # terminal 2
# open http://localhost:3000/admin
```

**Try the editor without any backend:** open `/admin?backend=test` (in-memory `test-repo`; nothing is saved).

### Decap CMS on Vercel - important

`git-gateway` is a Netlify service (Netlify Identity + Git Gateway). It only works if a Netlify site with Identity and Git Gateway enabled backs the login. If you deploy **only** to Vercel, switch the `backend` block in `public/admin/config.yml` to the GitHub backend:

```yaml
backend:
  name: github
  repo: YOUR-GITHUB-USER/YOUR-REPO
  branch: main
  base_url: https://YOUR-OAUTH-PROXY.example.com   # a small OAuth proxy, e.g. a self-hosted decap-cms-oauth-provider
```

Create a GitHub OAuth app, deploy an OAuth proxy for Decap, and keep `media_folder`/`public_folder` as they are. See the Decap docs: https://decapcms.org/docs/github-backend/

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New -> Project**, import the repo (framework preset: Next.js, no env vars needed).
3. Deploy, then set the project domain to `novasterlingltd.vercel.app` if it isn't assigned automatically.

## Before you submit the site for eBay / marketplace verification

Edit `src/lib/site.ts` and replace every `[bracketed]` placeholder with your **real** details: registered business address, company number, phone number and a working support email on your own domain. Then review the legal pages:

- `src/app/(site)/terms/page.tsx` - return window (30 days), dispatch time (1-2 business days), governing law
- `src/app/(site)/privacy/page.tsx` - make sure it matches how you actually handle data

These policies are solid starting templates, **not legal advice** - have them reviewed for your jurisdiction. Also replace the sample products with your real ones.

## Next steps / known limitations

- **Authentication is a demo.** Accounts live in the visitor's own browser (localStorage) so the flows work without a backend. Swap `src/context/AuthContext.tsx` for a real provider (Auth.js, Clerk, Supabase, Firebase) before collecting real customer data. Nothing else in the app needs to change.
- **Checkout has no payment.** Connect Stripe Checkout or PayPal and create orders server-side.
- **Contact form** opens the visitor's email app (`mailto:`). Swap `handleSubmit` in `src/components/ContactForm.tsx` for a form service (Formspree, Resend) to receive messages directly.
- Currency and locale are set in `src/lib/site.ts` (`USD` / `en-US`).

## Saving products on Vercel (Blob storage)

The admin saves products, page content and uploaded images on the server. Vercel's filesystem is read-only, so connect a Blob store: Vercel project -> **Storage** -> **Create** -> **Blob**, and connect it to the project. This adds `BLOB_READ_WRITE_TOKEN`; redeploy afterwards. Without the token (e.g. local `npm run dev`) files are written to `/content` on disk.
