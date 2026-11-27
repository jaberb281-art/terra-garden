# AB Gardening

Commercial gardening and landscaping website for Doha and Qatar, built with Next.js 16 App Router, React and TypeScript. English and Arabic share the same pages, with native RTL in Arabic. The public brand is AB Gardening; `terra` remains the internal project name.

## Local development

Requires Node.js 22+ and the checked-in npm lockfile.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start -- --port 3200
```

The root URL redirects to `/en`, or `/ar` after an explicit Arabic language selection. The first-party preference cookie `ab-gardening-locale` lasts one year; the root redirect is private and uncached. Explicit localized URLs always retain their requested language.

| Route (`:locale` is `en` or `ar`) | Content |
| --- | --- |
| `/:locale` | Home, nine services, garden comparisons, property categories, service areas and FAQs |
| `/:locale/services` | Complete nine-service catalogue |
| `/:locale/services/:slug` | Individual service, scope, preparation, related concepts and quotation action |
| `/:locale/projects` | Filterable garden concepts, with sample imagery clearly identified |
| `/:locale/projects/:slug` | Concept story, before/after comparison, gallery and related services |
| `/:locale/about` | Business introduction and five-step working process |
| `/:locale/contact` | WhatsApp, telephone, email and quotation-message preparation |
| `/admin` | Authenticated CMS; see [CMS documentation](docs/cms.md) |
| `/robots.txt`, `/sitemap.xml` | Environment-controlled search discovery |

Unknown public routes return a real localized 404. There is no `/products` page. The current service slugs are `garden-maintenance`, `grass-cutting`, `date-palm-tree-care`, `landscape-design`, `irrigation-systems`, `grass-plantation`, `soil-fertilization`, `garden-cleaning` and `indoor-plants`.

## Content and responsive behavior

Brand copy and translations live in `src/content/site.ts`; services and concepts in `src/content/catalog.ts`; contact and area data in `src/content/business.ts`. The public CMS adapter is `src/lib/cms/public.ts`.

On the mobile homepage (up to 760px), All Services initially shows the three featured services. Show All expands the complete nine-service list; category filters independently show all matching services. All nine service links remain in server-rendered HTML. Desktop and the dedicated Services page show the complete catalogue. Mobile service areas initially show six major areas; Show All reveals all 18 existing supported locations.

Comparisons are manually controlled: native range dragging, keyboard arrows, project choices and Before/Compare/After buttons. Horizontal range interaction retains normal vertical page scrolling. The floating WhatsApp control avoids visible mobile section contact actions, menus, dialogs, the footer and overlapping content. The compact navigation remains available.

The hero image loads eagerly with high fetch priority; copy and contact controls appear immediately. Responsive WebP images handle decorative backgrounds as well as content photography. Long below-fold sections use native `content-visibility` with intrinsic size estimates to defer rendering; keyboard and find-in-page navigation still reach their full HTML. Header and floating-contact effects avoid measuring offscreen descendants or alternating layout reads and writes.

The bundled WebP imagery and garden concepts are illustrative, not evidence of completed client work. Keep provenance labels accurate. Replace illustrative assets with approved photographs when available; before/after pairs need matched camera position, crop and aspect ratio. Do not add unverified testimonials, figures, credentials, addresses, hours or registration claims. Social icons are explicitly labeled Coming Soon and do not link to invented profiles.

## Contact and conversion events

Existing verified contact data is centralized in `src/content/business.ts`. `TERRA_WHATSAPP_NUMBER` optionally overrides the configured business WhatsApp number using international digits only. Invalid configured numbers disable WhatsApp actions. Public drafts are localized and contextual on service and project pages.

The contact form validates the location and work description, then opens a prepared WhatsApp message. It also exposes a fallback link if the browser blocks the new window. The visitor reviews and sends the message in WhatsApp; the website does not submit or store a customer enquiry. No test sends an enquiry to the business.

There is no analytics provider configured and no third-party tracking script added. Optional anonymous UI event hooks are disabled by default. To integrate an owner-approved provider:

1. Review the privacy and consent requirements for that provider with the business owner.
2. Set `NEXT_PUBLIC_CONVERSION_EVENTS_ENABLED=true` and rebuild.
3. Listen for `window` events named `abgardening:conversion` in the approved integration.

Events are `whatsapp_click`, `telephone_click`, `email_click`, `free_inspection_request`, `service_quote_request` and `project_enquiry`. Detail contains event, channel, UI context, locale and pathname. It excludes telephone/email values, query strings, message text, customer names and form entries. An intent event records opening/preparing a contact route; it is not proof of a delivered message or completed booking. No provider credentials, cookie identifiers or network transport are included.

## SEO and production configuration

Copy `.env.example` only when configuration is needed. Confirm `NEXT_PUBLIC_SITE_URL` as the production HTTPS origin without a path, query or port. Set `SITE_ALLOW_INDEXING=true` only for the approved production host, then rebuild. Until both values are valid, public pages use noindex, robots disallows crawling and the sitemap stays empty. Local development needs no credentials.

Configured production pages provide localized titles/descriptions, canonical and hreflang URLs, social metadata, visible breadcrumbs and accurate Organization/WebSite/WebPage/BreadcrumbList schemas. Service detail pages also provide Service schema. LocalBusiness address/rating/hours data is omitted until verified. The headers disable MIME sniffing and framing by other origins, limit referrer disclosure and disable unneeded camera/microphone/geolocation permissions. A strict CSP/HSTS policy must be matched to the final hosting and CMS configuration rather than guessed locally.

CMS, Supabase and Cloudinary setup and owner provisioning are documented in [CMS documentation](docs/cms.md). Cloudinary secrets remain server-side. Do not publish secret values or commit `.env.local`.

## Verification

See [test instructions](tests/README.md) for optional local QA dependencies, fixture isolation, screenshots and Lighthouse. Core checks:

```sh
npm run lint
npm run typecheck
npm run build
node tests/seo.cjs
node tests/conversion-events.cjs
node tests/cms-db.cjs
node tests/cms-browser-fixture.cjs
```

Run the production public UI suite with `QA_BASE_URL` set to the local server URL, then `node tests/public-ui.cjs`. The optional tooling lives in ignored `.qa/`; results and screenshots live in ignored `test-results/`. Tests exercise both languages, 17 viewport widths from 320 to 2560px, internal pages, contact links, filters/disclosures, menus, comparison, forms, gallery, accessibility and layout checks. Only report actual results from a completed run. Synthetic lab metrics do not establish field INP or real-world Core Web Vitals.

## Launch dependencies

- Confirm the production domain, hosting environment and indexing opt-in.
- Business-owner review of contact ownership, offer wording and service coverage.
- Native Arabic review of business-specific terminology and final copy.
- Owner-approved privacy/legal wording and any business registration disclosures required for launch; registration is still in progress.
- Authentic portfolio photographs, permission to publish them and accurate sample/completed-work provenance.
- Real social profile URLs before enabling the Coming Soon icons.
- Owner-approved analytics provider and consent configuration if tracking is wanted.
- CMS/media credentials and owner provisioning if hosted CMS editing is enabled.
- Provision CMS records for the newer service slugs before editing the complete catalogue in admin. Existing migrations retain four legacy service records; the public adapter supplies all nine current services regardless.
- Production-device, network and field performance monitoring after launch.

No deployment or external production infrastructure changes are part of this refinement.
