# TERRA · Garden & Landscape

A frontend-only Next.js App Router site for a Qatar landscaping brand concept. English and Modern Standard Arabic pages share the same URL structure, with native RTL layout in Arabic. No credentials or external services are required.

## Run locally

Requires Node.js 20.9+ (developed with Node 24). Use the checked-in npm lockfile.

```sh
npm ci
npm run dev
npm run lint
npx tsc --noEmit
npm run build
npm start
```

`npm install` is also available for intentional dependency updates. Open the local address printed by Next.js. The root URL redirects permanently to `/en`.

| Route (replace `:locale` with `en` or `ar`) | Contents |
| --- | --- |
| `/:locale` | Home, service and audience highlights, three interactive transformations, essentials and concept gallery |
| `/:locale/services` | Service overview |
| `/:locale/services/:slug` | `grass-cutting`, `garden-maintenance`, `landscaping`, `plant-and-irrigation` |
| `/:locale/projects` | Filterable concept gallery |
| `/:locale/projects/:slug` | `villa-garden-makeover`, `outdoor-living-renewal`, `farm-landscape-care` |
| `/:locale/products` | Display catalogue |
| `/:locale/about` | Placeholder company introduction |
| `/:locale/contact` | Contact availability and local form validation |
| `/robots.txt`, `/sitemap.xml` | Search settings and localized URLs when enabled |

Unknown paths under either supported locale get a localized 404. Unknown locales get an English fallback.

## Content and imagery

Edit brand, shared labels, page copy and property segments in `src/content/site.ts`. The typed records in `src/content/catalog.ts` hold services, project concepts, and product categories. Form labels and validation messages are in `src/components/controls.tsx`. Have a native Arabic editor review the copy before launch.

The bundled WebP images in `public/images` are AI-generated illustrations. The approved HTML and demo photos were not supplied, so the layout follows the written brief. The built-in image tool generated: a contemporary Qatar villa garden at golden hour with date palms and a pale path; a camera-matched contact sheet of a villa lawn, pergola patio, and date farm before and after design changes; and a nursery workbench with seedlings, terracotta pots and soil. No pictured property is claimed as TERRA work.

For approved replacements, keep the before/after images matched in camera position, crop and aspect ratio. Update alt text and set the project sample flag based on the replacement’s provenance; also review the gallery disclaimer and homepage transformation wording before showing real projects. Hero and nursery labels are handled in the page components. Ensure social share crops still read well.

The CMS integration seam is the content record layer: a future server-side adapter can return the same shapes and stable slugs for the page views, route enumeration and metadata. Keep credentials server-side and retain localized alt text and sample provenance.

## Tests

The source checks are in `tests/`. Run the SEO check with `node tests/seo.cjs`. To run the browser checks, install the optional tooling with `npm install --prefix .qa --no-save playwright-core axe-core` and start the production build on port 3100 with `npm run start -- --port 3100`. With Google Chrome installed, run `node tests/hero-refinement-check.cjs` and `node tests/whatsapp-check.cjs` against a build with WhatsApp unset. The browser checks write screenshots to the ignored `test-results/` directory.

## Contact and launch settings

Copy `.env.example` to `.env.local` only when needed. Set `TERRA_WHATSAPP_NUMBER` to the verified TERRA WhatsApp number with country code and digits only, then rebuild the site. When configured, the public number is shown on Contact and in the footer. WhatsApp opens with a localized draft based on the page or product category. The visitor edits and sends it in WhatsApp. A missing or invalid number disables the actions and skips the floating reminder. The quotation form checks entries in the browser. It never sends or stores them. The catalogue has no inventory, pricing, checkout or payments.

Set `NEXT_PUBLIC_SITE_URL` to the verified HTTPS origin with no path, and set `SITE_ALLOW_INDEXING=true` only for the intended public host. Rebuild after changing these settings. Without explicit opt-in, pages use noindex, robots disallows crawling, and the sitemap is empty. A valid configured origin enables canonical, hreflang, social image and structured data URLs. No LocalBusiness data is asserted.

Before release, confirm the final brand, Arabic copy, verified contact details and approved portfolio imagery. Add inquiry delivery and any CMS work in a separate phase. Field Core Web Vitals need production traffic to measure.
