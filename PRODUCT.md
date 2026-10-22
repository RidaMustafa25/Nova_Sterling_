# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Shoppers buying premium and luxury goods online (watches, leather goods, audio, accessories) for themselves or as gifts. They arrive on desktop or phone, browse a small curated range, compare a few items, and buy directly on this site.

## Product Purpose

NOVA STERLING LTD is the company's own online store. Its job is direct sales: a shopper should find a product, trust the business, and complete a purchase here. Success is a shopper moving from homepage or catalog to product page to cart to checkout without doubt about quality or legitimacy.

## Positioning

A small, curated range of higher-end items rather than a broad marketplace catalog: fewer products, higher prices, each one presented with care.

## Operating Context

- Products are managed by one administrator through the admin area (`/admin`, separate login at `/admin/login`). Products saved there currently live in the admin's browser storage; sample products ship in `content/products/*.json`.
- Shoppers use a cart drawer, a checkout page (order summary only), and a demo customer account (`/login`, `/register`, `/account`).
- Company, contact, privacy and terms pages exist to establish legitimacy.

## Capabilities and Constraints

- Next.js 15 App Router, React 19, Tailwind CSS 3, TypeScript, lucide-react icons; deployed on Vercel (`novasterlingltd.vercel.app`).
- Prices: `src/lib/site.ts` says USD / en-US, while several pages hard-code "£". Currency is an open decision; do not invent one.
- Payment is not connected; checkout shows an order summary only.
- Customer login is demo-only (browser storage, no backend). Admin login is server-checked.
- Open: real company details. `src/lib/site.ts` holds placeholders in [square brackets] for phone, company number and address.

## Brand Commitments

- Name: NOVA STERLING LTD (short form NOVA STERLING).
- Standing visual preference (user, 2026-10-21): a light, familiar premium e-commerce look executed at high craft, alongside Apple Store, Aesop, Mr Porter / SSENSE and Bellroy / Nothing; floating pill navigation; rich but tasteful transitions, hover effects and animations. A bold themed concept (dark leather swatch book) was tried and rejected. The admin dashboard must be designed to the same standard.
- The user has made two components binding for the redesign: the 3D perspective tunnel hero at the top of the homepage (`src/components/ui/perspective-tunnel-hero.tsx`) and the animated full-screen kinetic navigation used as the site header (`src/components/ui/sterling-gate-kinetic-navigation.tsx`).

## Evidence on Hand

- Product data: `content/products/*.json` (8 sample products with placeholder SVG images in `public/uploads`) and 4 hard-coded demo products with Unsplash photos on the homepage.
- No real testimonials, reviews, press, customer counts, awards or shipping/returns figures exist. Do not fabricate them.
- No logo file; the brand mark is currently text plus a lucide icon.

## Product Principles

1. Trust before persuasion: a shopper must believe the business is real and the goods are genuine before any flourish matters.
2. Let the product lead: imagery and price are the content; interface recedes around them.
3. Few items, presented well: depth on each product beats breadth.
4. Buying stays effortless: cart, product and checkout paths are never sacrificed for spectacle.
