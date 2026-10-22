/**
 * Everything on the storefront that the admin can edit from /admin/content.
 *
 * The saved copy lives in content/site.json (see ./store.ts). Anything missing from that file
 * falls back to DEFAULT_CONTENT below, so new fields can be added here without migrating data.
 *
 * Text may contain placeholders that are filled in from the business details when the page is
 * shown: {name} {shortName} {email} {phone} {companyNumber} {address} {hours} {firstHours} {currency}.
 */

export interface Hours {
  days: string;
  time: string;
}

export interface ImageRef {
  src: string;
  alt: string;
}

export interface TitledText {
  title: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export interface SiteContent {
  business: {
    name: string;
    shortName: string;
    email: string;
    phone: string;
    companyNumber: string;
    address: string[];
    hours: Hours[];
  };
  seo: {
    title: string;
    description: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroPrimaryLabel: string;
    heroSecondaryLabel: string;
    heroImages: { src: string; title: string }[];
    newArrivalsHeading: string;
    categoriesHeading: string;
    categories: { label: string; query: string; image: string; alt: string }[];
    editorialHeading: string;
    editorialBody: string;
    editorialImage: ImageRef;
    ticker: string[];
    faqHeading: string;
    faqIntro: string;
    service: TitledText[];
  };
  catalog: {
    heading: string;
    intro: string;
  };
  product: {
    stockLine: string;
    returnsLine: string;
    deliveryText: string;
    returnsText: string;
    relatedHeading: string;
  };
  about: {
    heading: string;
    intro: string;
    image: ImageRef;
    principles: TitledText[];
  };
  contact: {
    heading: string;
    intro: string;
  };
  faq: {
    heading: string;
    intro: string;
    groups: FaqGroup[];
    ctaHeading: string;
    ctaBody: string;
  };
  footer: {
    tagline: string;
  };
  auth: {
    image: ImageRef;
    loginHeading: string;
    loginIntro: string;
    registerHeading: string;
    registerIntro: string;
  };
  legal: {
    updated: string;
    terms: string;
    privacy: string;
  };
}

const unsplash = (id: string, w = 600) => `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop`;

const TERMS = `These Terms of Service ("Terms") govern your use of the {name} website and any purchase you make from us. Please read them carefully. By using the website or placing an order, you agree to be bound by these Terms and by our [Privacy Policy](/privacy).

## 1. About us

{name} (company number {companyNumber}), registered at {address}. Contact: [{email}](mailto:{email}).

## 2. Eligibility and accounts

You must be at least 18 years old, or have the consent of a parent or guardian, to place an order. If you create an account you are responsible for keeping your login details confidential and for all activity under your account. Please give accurate information and tell us promptly if it changes.

## 3. Products and pricing

We make every effort to describe products and show images accurately, but colours and appearance may vary slightly between screens. Prices are shown in {currency} and may change at any time; the price that applies is the one displayed when you place your order. If we discover a pricing error we may cancel the affected order and refund you in full.

## 4. Orders and payment

Placing an order is an offer to buy. A contract is formed when we confirm that your order has been accepted and dispatched. We may decline or cancel an order, for example because an item is unavailable, an error is found, or we suspect fraud. Payment is taken through our payment providers, and you confirm that you are authorised to use the payment method you choose.

## 5. Shipping and delivery

We aim to dispatch orders promptly, usually within 1–2 business days of payment. Delivery times depend on your location and the carrier and are estimates, not guarantees. Risk in the goods passes to you on delivery. Please check your parcel on arrival and tell us quickly about any damage.

## 6. Returns, refunds and quality guarantee

We want you to be happy with your purchase. If you change your mind, you may return unused items in their original condition and packaging within 30 days of delivery for a refund of the product price. If an item arrives faulty, damaged or not as described, contact us within the same period and we will arrange a replacement or a full refund, including reasonable return shipping costs. To start a return, email [{email}](mailto:{email}) with your order details. Refunds are issued to the original payment method once the returned item has been received and checked. Nothing in these Terms limits any rights you have under consumer protection law.

## 7. Intellectual property

All content on this website, including text, images, logos and design, belongs to {name} or its licensors and is protected by intellectual property laws. You may not copy, reproduce or exploit it without our written permission.

## 8. Acceptable use

You agree not to misuse the website, including attempting to gain unauthorised access, interfering with its operation, using automated tools to scrape it, or using it for any unlawful purpose.

## 9. Disclaimers and limitation of liability

The website is provided "as is" and we do not guarantee it will be uninterrupted or error-free. To the fullest extent permitted by law, we are not liable for indirect or consequential losses, and our total liability for any claim relating to an order is limited to the amount you paid for that order. Nothing in these Terms excludes liability that cannot be excluded by law, including for death or personal injury caused by negligence, or for fraud.

## 10. Third-party links

The website may link to third-party sites. We are not responsible for their content or privacy practices.

## 11. Governing law

These Terms are governed by the laws of [your country or jurisdiction]. Any dispute will be handled by the courts of that jurisdiction, subject to any mandatory consumer rights you have in your own country.

## 12. Changes to these Terms

We may update these Terms from time to time. The version published on this page when you place an order is the one that applies to that order.

## 13. Contact

Questions about these Terms? Email [{email}](mailto:{email}) or use our [Contact page](/contact).
`;

const PRIVACY = `This Privacy Policy explains how {name} ("we", "us", "our") collects, uses, stores and shares your personal information when you visit our website, create an account, or buy from us. By using our website you agree to the practices described here.

## 1. Who we are

{name} is the controller of your personal data. Company number: {companyNumber}. Registered address: {address}. You can contact us at [{email}](mailto:{email}).

## 2. Information we collect

- **Account details:** your name, email address and password (stored in protected form) when you register.
- **Order details:** products purchased, delivery and billing address, and contact details needed to fulfil and support your order.
- **Payment information:** payments are processed by third-party payment providers. We do not store full card numbers on our servers.
- **Messages:** information you send us through the contact form or by email.
- **Technical data:** basic information such as browser type, device, and pages visited, used to keep the site working and secure.

## 3. How we use your information

- To create and manage your account.
- To process, ship and support your orders, including returns and refunds.
- To respond to your questions and requests.
- To detect, prevent and investigate fraud, abuse and security incidents.
- To improve our website, products and services.
- To meet our legal, tax and accounting obligations.

## 4. Cookies and browser storage

Our website stores a small amount of information in your browser so that it works properly, for example the contents of your shopping cart and your signed-in session. This storage is essential to the shop and stays on your device. You can clear it at any time through your browser settings; doing so will empty your cart and sign you out. If we add analytics or advertising cookies in the future, we will update this policy and ask for consent where the law requires it.

## 5. Sharing your information

We do not sell your personal information. We share it only with:

- Delivery and courier companies, so that your order reaches you.
- Payment providers, so that we can take payment and issue refunds.
- Service providers that host our website or help us operate the store, under appropriate confidentiality and security obligations.
- Authorities or advisers where we are legally required to, or to protect our rights.

## 6. How long we keep your information

We keep personal data only for as long as needed for the purposes above. Order and invoice records are kept for the period required by tax and accounting law. Account information is kept until you ask us to delete your account, unless we must keep some of it by law.

## 7. Security

We use reasonable technical and organisational measures to protect your information, including encrypted connections (HTTPS). No method of transmission or storage is completely secure, so we cannot guarantee absolute security.

## 8. Your rights

Depending on where you live, you may have the right to access, correct, delete or export your personal data, to object to or restrict certain processing, and to withdraw consent at any time. To exercise these rights, email [{email}](mailto:{email}). You may also have the right to complain to your local data protection authority.

## 9. Children

Our website is not directed at children under 16, and we do not knowingly collect their personal information. If you believe a child has given us personal data, please contact us and we will delete it.

## 10. International transfers

Our service providers may process data in countries other than your own. Where this happens we take steps to ensure your information remains protected in line with this policy.

## 11. Changes to this policy

We may update this policy from time to time. The "Last updated" date above shows when it was last changed. Continued use of the website after an update means you accept the revised policy.

## 12. Contact us

Questions about this policy? Email [{email}](mailto:{email}) or visit our [Contact page](/contact).
`;

export const DEFAULT_CONTENT: SiteContent = {
  business: {
    name: "NOVA STERLING LTD",
    shortName: "NOVA STERLING",
    email: "support@novasterlingltd.com",
    phone: "[+00 000 000 0000]",
    companyNumber: "[Company registration number]",
    address: ["[Registered business address, line 1]", "[City, Postcode / ZIP]", "[Country]"],
    hours: [
      { days: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
      { days: "Saturday", time: "10:00 AM – 2:00 PM" },
      { days: "Sunday", time: "Closed" },
    ],
  },
  seo: {
    title: "NOVA STERLING LTD | Quality Goods Store",
    description: "Official store of NOVA STERLING LTD featuring curated products.",
  },
  home: {
    heroTitle: "Crafted\nto last.",
    heroSubtitle: "A small collection of watches, leather and audio, each piece chosen to be used for years.",
    heroPrimaryLabel: "Shop the collection",
    heroSecondaryLabel: "Our story",
    heroImages: [
      { src: unsplash("1523275335684-37898b6baf30"), title: "Timepieces" },
      { src: unsplash("1505740420928-5e560c06d30e"), title: "Audio" },
      { src: unsplash("1526170375885-4d8ecf77b99f"), title: "Cameras" },
      { src: unsplash("1542291026-7eec264c27ff"), title: "Footwear" },
      { src: unsplash("1572635196237-14b3f281503f"), title: "Eyewear" },
      { src: unsplash("1585386959984-a4155224a1ad"), title: "Fragrance" },
      { src: unsplash("1553062407-98eeb64c6a62"), title: "Leather" },
      { src: unsplash("1546868871-7041f2a55e12"), title: "Wearables" },
      { src: unsplash("1491553895911-0055eca6402d"), title: "Sneakers" },
    ],
    newArrivalsHeading: "New arrivals",
    categoriesHeading: "Shop by category",
    categories: [
      { label: "Timepieces", query: "watch", image: unsplash("1524805444758-089113d48a6d", 1000), alt: "A chronograph watch with a brown leather strap" },
      { label: "Leather", query: "leather", image: unsplash("1627123424574-724758594e93", 1000), alt: "A worn brown leather wallet" },
      { label: "Audio", query: "audio", image: unsplash("1505740420928-5e560c06d30e", 1000), alt: "Over-ear headphones on a yellow background" },
      { label: "Vintage", query: "vintage", image: unsplash("1526170375885-4d8ecf77b99f", 1000), alt: "A vintage instant camera" },
    ],
    editorialHeading: "Chosen to be used for years.",
    editorialBody:
      "We specialize in curating high-quality precision instruments, vintage equipment, and luxury accessories for everyday life and professional work.",
    editorialImage: {
      src: unsplash("1553062407-98eeb64c6a62", 1600),
      alt: "A dark backpack standing on a pale wooden floor in soft window light",
    },
    ticker: ["Timepieces", "Leather goods", "Audio", "Eyewear", "Fragrance", "Cameras", "Everyday carry"],
    faqHeading: "Good to know",
    faqIntro: "Delivery, returns, payment and accounts, straight from our terms.",
    service: [
      { title: "Dispatched in 1–2 business days", body: "Orders usually leave us within 1–2 business days of payment." },
      { title: "30-day returns", body: "Return unused items in their original packaging within 30 days of delivery." },
      { title: "Real people, real answers", body: "{email} · {firstHours}" },
    ],
  },
  catalog: {
    heading: "Shop all",
    intro: "Every piece in the store. Sort by price or name, or search for what you have in mind.",
  },
  product: {
    stockLine: "In stock and ready for dispatch",
    returnsLine: "Return unused within 30 days of delivery",
    deliveryText:
      "We aim to dispatch orders promptly, usually within 1–2 business days of payment. Delivery times depend on your location and the carrier and are estimates, not guarantees.",
    returnsText:
      "Return unused items in their original condition and packaging within 30 days of delivery for a refund of the product price.",
    relatedHeading: "You may also like",
  },
  about: {
    heading: "About {name}",
    intro:
      "Welcome to {name}. We specialize in curating high-quality precision instruments, vintage equipment, and luxury accessories for everyday life and professional work.",
    image: {
      src: unsplash("1553062407-98eeb64c6a62", 1800),
      alt: "A dark backpack standing on a pale wooden floor in soft window light",
    },
    principles: [
      {
        title: "Our Mission",
        body: "To deliver outstanding products with complete transparency, reliability, and top-tier customer satisfaction.",
      },
      { title: "Quality Assured", body: "Every item in our inventory undergoes standard quality verification before listing." },
    ],
  },
  contact: {
    heading: "Contact us",
    intro: "Have a question? Send us a message.",
  },
  faq: {
    heading: "Questions, answered",
    intro: "Delivery, returns, payment and accounts. For anything else, we're a message away.",
    groups: [
      {
        title: "Orders and delivery",
        items: [
          {
            question: "How quickly will my order ship?",
            answer:
              "We aim to dispatch orders promptly, usually within 1–2 business days of payment. Delivery times depend on your location and the carrier, and are estimates rather than guarantees.",
          },
          {
            question: "When is my order confirmed?",
            answer:
              "Placing an order is an offer to buy. The contract is formed when we confirm that your order has been accepted and dispatched.",
          },
          { question: "What should I do when my parcel arrives?", answer: "Please check your parcel on arrival and tell us quickly about any damage." },
        ],
      },
      {
        title: "Returns and refunds",
        items: [
          {
            question: "Can I return something if I change my mind?",
            answer:
              "Yes. You may return unused items in their original condition and packaging within 30 days of delivery for a refund of the product price.",
          },
          {
            question: "What if an item arrives faulty or damaged?",
            answer:
              "Contact us within 30 days of delivery and we will arrange a replacement or a full refund, including reasonable return shipping costs.",
          },
          {
            question: "How do I start a return?",
            answer:
              "Email {email} with your order details. Refunds go back to your original payment method once the returned item has been received and checked.",
          },
        ],
      },
      {
        title: "Payment and pricing",
        items: [
          {
            question: "Which currency are prices shown in?",
            answer: "Prices are shown in {currency}. The price that applies is the one displayed when you place your order.",
          },
          {
            question: "How is payment taken?",
            answer:
              "Payment is taken through our payment providers at checkout. You confirm that you are authorised to use the payment method you choose.",
          },
        ],
      },
      {
        title: "Your account",
        items: [
          {
            question: "Who can create an account?",
            answer:
              "You must be at least 18 years old, or have the consent of a parent or guardian, to place an order. Please keep your login details confidential.",
          },
          { question: "How do I get in touch?", answer: "Email {email} or use the contact form. We're available {hours}." },
        ],
      },
    ],
    ctaHeading: "Still have a question?",
    ctaBody: "Send us a message and a real person will get back to you.",
  },
  footer: {
    tagline: "Questions about an order or a product? We're here to help.",
  },
  auth: {
    image: {
      src: unsplash("1523275335684-37898b6baf30", 1400),
      alt: "A minimal silver wristwatch on a pale background",
    },
    loginHeading: "Welcome back",
    loginIntro: "Log in to your {shortName} account.",
    registerHeading: "Create an account",
    registerIntro: "Join {name}.",
  },
  legal: {
    updated: "October 21, 2026",
    terms: TERMS,
    privacy: PRIVACY,
  },
};

// ---------------------------------------------------------------------------
// Normalising: whatever comes in (a saved file, an admin request) is merged onto the defaults,
// keeping only values of the right type, so a bad edit can never break a page.

type Json = unknown;

function mergeShape<T>(shape: T, value: Json): T {
  if (typeof shape === "string") return (typeof value === "string" ? value : shape) as T;
  if (Array.isArray(shape)) {
    if (!Array.isArray(value)) return shape;
    const template = shape[0];
    // Arrays of strings or objects: each saved item is shaped like the first default item,
    // and items of the wrong kind are dropped.
    if (template === undefined) return shape;
    const kind = (v: Json) => (v === null ? "null" : Array.isArray(v) ? "array" : typeof v);
    return value.filter((item) => kind(item) === kind(template)).map((item) => mergeShape(template, item)) as T;
  }
  if (shape && typeof shape === "object") {
    const source = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, Json>) : {};
    const out: Record<string, Json> = {};
    for (const [key, def] of Object.entries(shape as Record<string, Json>)) {
      out[key] = key in source ? mergeShape(def, source[key]) : def;
    }
    return out as T;
  }
  return shape;
}

export function normalizeContent(value: Json): SiteContent {
  return mergeShape(DEFAULT_CONTENT, value);
}

// ---------------------------------------------------------------------------
// Placeholders

export const PLACEHOLDERS = [
  "{name}",
  "{shortName}",
  "{email}",
  "{phone}",
  "{companyNumber}",
  "{address}",
  "{hours}",
  "{firstHours}",
  "{currency}",
] as const;

function placeholderValues(business: SiteContent["business"], currency: string): Record<string, string> {
  const open = business.hours.filter((h) => h.days.trim() && h.time.trim() && h.time.trim().toLowerCase() !== "closed");
  return {
    name: business.name,
    shortName: business.shortName,
    email: business.email,
    phone: business.phone,
    companyNumber: business.companyNumber,
    address: business.address.filter((l) => l.trim()).join(", "),
    hours: open.map((h) => `${h.days}, ${h.time}`).join(" and "),
    firstHours: open[0] ? `${open[0].days}, ${open[0].time}` : "",
    currency,
  };
}

function fillDeep<T>(value: T, fill: (s: string) => string): T {
  if (typeof value === "string") return fill(value) as T;
  if (Array.isArray(value)) return value.map((v) => fillDeep(v, fill)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fillDeep(v, fill)])) as T;
  }
  return value;
}

/** The content as visitors see it: every {placeholder} replaced with the business details. */
export function resolveContent(content: SiteContent, currency: string): SiteContent {
  const values = placeholderValues(content.business, currency);
  const fill = (s: string) => s.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
  return { ...fillDeep(content, fill), business: content.business };
}
