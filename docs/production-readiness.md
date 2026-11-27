# AB Gardening production-readiness report

Date: 27 November 2026.

## Executive summary

The existing Next.js, React and TypeScript website has been refined across English and Arabic public pages while preserving AB Gardening's forest green and warm cream identity, floating pill navigation, landscaping photography, editorial headings, rounded cards, botanical details and final consultation section.

The main improvements shorten mobile service discovery, make contact controls less intrusive, improve navigation and comparison accessibility, retain every service and supported area, and strengthen localized SEO and production configuration. The public brand and existing contact information remain unchanged. Illustrative concepts remain identified as illustrative; no projects, reviews, statistics, addresses, opening hours or registration credentials were invented.

**Verification status:** the final production build, lint, type checking, unit/integration checks and complete public UI matrix passed, including a repeat after measured performance findings prompted rendering and image improvements. Final Lighthouse accessibility and best-practices scores are 100, and desktop performance is 99 in both languages. Mobile performance is 69 in English and 75 in Arabic; the requested mobile score of 90 and LCP of 2.5 seconds remain unmet. No deployment or external production infrastructure change was performed.

## Changes implemented

| Area | Result |
| --- | --- |
| Desktop | Preserved the floating navigation and hero composition; improved header spacing and contact priorities, consistent section controls, consultation/contact readability and alignment. The complete nine-service catalogue remains available. |
| Mobile | Compact branding and controls fit narrow headers. The homepage initially shows the three featured services under All Services, with an explicit action to reveal all nine. Category filters show all matching services. Service areas initially show six major locations and expand to all 18. Contact links and disclosure controls have larger targets. |
| Tablet | Refined intermediate navigation, grid, section and contact layouts rather than relying only on desktop/mobile endpoints. The final automated matrix includes 600, 768, 820, 834 and 1024px widths. |
| UI/UX | Retained the established premium landscaping presentation. Comparison content is manually controlled, and Before/Compare/After actions provide an alternative to precise dragging. Existing project filters, FAQs, gallery and footer remain accessible. |
| Localization | English and Arabic preserve the selected page when switching. Arabic retains RTL layout and Arabic typography; directional project icons follow RTL. A first-party language preference cookie lasts one year and only changes the root entry redirect. Explicit localized URLs keep their requested language. |
| Accessibility | Mobile navigation supports keyboard opening, Escape, outside dismissal, route-change closure and focus return. Comparison controls expose their value and work with mouse, touch and keyboard while retaining vertical scrolling. Disclosures use expanded state and controlled-region relationships. Skip navigation, form feedback, contact link targets and breadcrumbs are retained or improved. |
| SEO | Localized titles, descriptions, canonicals, hreflang and social metadata remain environment controlled. Internal pages now include visible localized breadcrumbs. JSON-LD describes the Organization, WebSite, WebPage and BreadcrumbList, with Service data on service details. Social images correctly resolve local assets, managed media and HTTPS URLs. |
| Performance | The main hero remains eager and high priority. Responsive WebP sizes include smaller mobile and thumbnail variants. Unnecessary automatic comparison rotation and reveal work were removed. Offscreen sections use native content visibility with intrinsic size estimates; their full content remains in server HTML. Header/widget work avoids repeated offscreen layout measurements. |
| Conversion | Contextual, localized WhatsApp drafts remain available for service and project enquiries. The contact form validates input, prepares a WhatsApp message and provides a fallback link when opening a new window fails. The floating shortcut avoids visible mobile contact actions, menus, dialogs, footer and conflicting content. Telephone and email remain available. |
| Production | Added compatible security headers; retained noindex until a confirmed domain and explicit indexing opt-in are configured. Optional anonymous conversion events require an environment flag and introduce no third-party tracking script. Existing CMS authorization and server-only media secrets were preserved. |

All nine services remain linked in server-rendered HTML. The dedicated Services page keeps the complete catalogue. Compact mobile areas preserve the existing coverage rather than removing locations. The business workflow remains contact, free inspection, customized quotation, execution, and maintenance/support.

## Important files

| Files | Purpose |
| --- | --- |
| [Global styles](../src/app/globals.css), [services styles](../src/components/services-overview.module.css), [projects styles](../src/components/projects-overview.module.css) | Responsive layout, header and touch-target refinements, compact mobile content, comparison presentation and rendering improvements. |
| [Site sections](../src/components/site.tsx), [mobile disclosure](../src/components/mobile-disclosure.tsx) | Shared services/areas expansion and contextual consultation actions. |
| [Controls](../src/components/controls.tsx), [comparison](../src/components/comparison.tsx), [language selection](../src/components/language-select.tsx) | Navigation, quotation fallback, comparison interaction and persistent locale preference. |
| [Floating WhatsApp control](../src/components/whatsapp-widget.tsx), [motion](../src/components/motion.tsx) | Context-sensitive contact visibility and reduced unnecessary scroll/render work. |
| [Public page composition](../src/components/public-page.tsx), [SEO configuration](../src/content/config.ts), [structured data](../src/content/structured-data.ts), [breadcrumbs](../src/components/breadcrumbs.tsx) | Accurate localized metadata, social image resolution, visible breadcrumbs and safe JSON-LD. |
| [Root entry route](../src/app/route.ts), [robots](../src/app/robots.ts), [sitemap](../src/app/sitemap.ts), [Next configuration](../next.config.ts) | Cookie-aware private redirect, indexing gates, responsive image variants and security headers. |
| [Conversion listener](../src/components/conversion-events.tsx), [conversion adapter](../src/lib/conversion-events.ts), [.env.example](../.env.example) | Optional event integration without provider IDs, customer message text, form contents or network transport. |
| [Test instructions](../tests/README.md), [public UI suite](../tests/public-ui.cjs), [performance suite](../tests/performance.cjs), [SEO tests](../tests/seo.cjs), [conversion tests](../tests/conversion-events.cjs) | Reproducible verification and isolated optional QA dependencies. |

See the [repository README](../README.md) for environment setup and the [CMS documentation](cms.md) for provider provisioning and authorization behavior.

## Verification results

The final application build and responsive checks were repeated after the performance pass. CMS integration checks used the same unchanged CMS application code.

| Check | Observed result |
| --- | --- |
| `npm run lint` | Passed, including the final performance changes and test files. |
| `npm run typecheck` | Passed, including generated Next route types and the final performance changes. |
| `npm run build` | Final production build passed; 40 static outputs generated. |
| `node tests/seo.cjs` | Passed: sitemap discovery, localized canonical/hreflang URLs, indexing gates, social images, schemas, language entry redirect and headers. |
| `node tests/conversion-events.cjs` | Passed: opt-in behavior, server safety and event payload privacy. |
| `node tests/cms-db.cjs` | Passed real migration/policy/publication/media/service checks in local PGlite. |
| `node tests/cms-browser-fixture.cjs` | Passed isolated authentication/admin/publication/media-error/service-edit checks using local substitutes. |
| `node tests/public-ui.cjs` | Final full run passed: 16 grouped checks, 34 public routes, 34 internal links, eight missing-route checks, 17 homepage widths in each language, six internal page types at 390/834/1440px, and interactions. |
| Additional interaction checks | Passed project property filters, sticky-header anchor clearance and native mouse dragging in English and Arabic. |
| Automated accessibility | Final run completed 30 axe scans with zero reported violations. Image/background contrast cases were marked incomplete for manual review. |
| Browser errors | Final public suite reported no console, runtime or HTTP errors. |
| `git diff --check` | Passed. |
| `npm audit --omit=dev --json` | Passed: zero known vulnerabilities; audit reported 42 production dependencies. No dependency updates were made. |
| Tracked-file credential heuristic | Scanned 102 tracked files, including 87 text files: zero detected literal credentials. Four candidates in `supabase/config.toml` were environment references. `.env.example` was the only tracked credential-named file. |

The width matrix was 320, 360, 375, 390, 414, 430, 480, 600, 768, 820, 834, 1024, 1280, 1440, 1536, 1920 and 2560px. Tests covered service and project filters, mobile disclosures, FAQ, menu/language behavior, keyboard/touch comparisons, gallery focus return, form validation and intercepted WhatsApp handoff. They did not send enquiries to the business.

The final full run completed on 27 November 2026 at approximately 18:28 Asia/Karachi (13:28 UTC). Its [JSON evidence](../test-results/public-ui/results-all.json) and [follow-up interaction evidence](../test-results/public-ui/results-interactions.json) are local ignored artifacts. Normal deferred rendering was retained for functional, layout and accessibility checks.

## Measured performance

Lighthouse 13.6.0 ran against the local production server on English and Arabic homepages. The following baseline was captured before the final rendering/performance adjustments:

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| English mobile | 69 | 100 | 100 | 66 | 3.96s | 736ms | 0 |
| Arabic mobile | 73 | 100 | 100 | 66 | 3.23s | 815ms | 0 |
| English desktop | 99 | 100 | 100 | 66 | 0.59s | 83ms | 0.0008 |
| Arabic desktop | 96 | 100 | 100 | 66 | 1.18s | 125ms | 0.0012 |

Baseline evidence is retained in [Lighthouse baseline summary](../test-results/lighthouse-baseline/summary.json). The local preview intentionally blocks indexing, which lowers its SEO score. Indexing must only be enabled for the approved production domain; improving a preview score is not a reason to remove that protection.

Final measurements after the performance pass used the same stock mobile (412×823, slow 4G simulation) and desktop (1350×940) presets:

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| English mobile | 69 | 100 | 100 | 66 | 3.76s | 846ms | 0 |
| Arabic mobile | 75 | 100 | 100 | 66 | 3.41s | 632ms | 0 |
| English desktop | 99 | 100 | 100 | 66 | 0.90s | 45ms | 0.0017 |
| Arabic desktop | 99 | 100 | 100 | 66 | 0.76s | 73ms | 0.0058 |

[Final Lighthouse summary](../test-results/lighthouse/summary.json), [English mobile HTML report](../test-results/lighthouse/en-mobile.html), [Arabic mobile HTML report](../test-results/lighthouse/ar-mobile.html). All four audits completed successfully. The only failed SEO audit was intentional preview `noindex`.

Hero high-priority discovery now passes. English mobile FCP improved from 1.62s to 1.23s and Speed Index from 2.65s to 1.71s. Total main-thread work fell from about 4.9s to 4.2s in English and 4.6s to 3.9s in Arabic. Mobile blocking time remains high and varies between runs; the mobile 90 score and 2.5s LCP targets remain unmet. Further mobile JavaScript/hydration, font and image profiling is required before performance sign-off. These results are reported without changing the stock throttling preset to inflate scores.

Lab TBT is not field INP. Real-user INP, production Core Web Vitals and representative Qatar mobile network/device behavior remain unmeasured. Local lab results vary with machine load, image cache state and simultaneous browser work.

## Visual verification

Local screenshot evidence includes:

| View | Screenshot |
| --- | --- |
| Mobile before final visual polish | [English mobile reference](../test-results/review/mobile-before-final-polish.jpg) |
| Arabic desktop before final visual polish | [Arabic desktop reference](../test-results/review/arabic-desktop-before-final-polish.jpg) |
| Desktop after visual polish | [Desktop](../test-results/review/desktop-final.jpg) |
| Mobile after visual polish | [Mobile](../test-results/review/mobile-final.jpg), [footer](../test-results/review/mobile-footer-final.jpg) |
| Tablet Services page | [Tablet](../test-results/review/tablet-services-final.jpg) |
| Arabic mobile | [RTL mobile](../test-results/review/arabic-mobile-final.jpg) |
| Full-page responsive captures | [English 390px](../test-results/public-ui/en-home-390.png), [English 834px](../test-results/public-ui/en-home-834.png), [English 1440px](../test-results/public-ui/en-home-1440.png), [Arabic 390px](../test-results/public-ui/ar-home-390.png), [Arabic 1440px](../test-results/public-ui/ar-home-1440.png) |

These ignored artifacts are available in the working checkout, not committed deliverables. The before-polish images show an intermediate state within this refinement, not an original production baseline. Full-page exports temporarily force offscreen content to paint for the screenshot; functional, axe and Lighthouse checks retain normal rendering behavior. The final responsive suite passed and produced 36 updated full-page screenshots after the last performance changes. Manual visual review covered narrow English/Arabic heroes, desktop composition, tablet Services and the mobile footer; no blocking visual regression was observed.

## Remaining launch dependencies

1. **Domain and search indexing:** confirm the public HTTPS origin in `NEXT_PUBLIC_SITE_URL`; keep previews non-indexable. Set `SITE_ALLOW_INDEXING=true` only for the approved production environment and rebuild. Verify live canonical/hreflang URLs, robots and sitemap afterward.
2. **Business/registration/legal:** owner review of business identity, contact ownership, free inspection/quotation wording, coverage and any required registration disclosures. Registration remains in progress. Owner-approved legal/privacy text is still required where applicable; no legal terms or compliance claims were invented.
3. **Arabic:** native-speaker review of business-specific Arabic terminology, customer messages and final copy. Automated RTL/layout tests do not verify translation quality.
4. **Photography and social profiles:** approved authentic photographs and publication rights are needed before replacing sample imagery or calling concepts completed work. Verify before/after pairing and provenance. Supply real social URLs before enabling the Coming Soon icons; no social accounts were fabricated.
5. **Hosted CMS/media:** an approved dedicated Supabase project, Cloudinary environment, authorized owner account and real provider smoke test are required before relying on hosted editing/media. Local tests do not validate provider behavior or production origin headers. No hosted migrations were applied.
6. **Complete CMS service editing:** existing migrations seed four records: two current public slugs (`grass-cutting`, `garden-maintenance`) and two legacy slugs (`landscaping`, `plant-and-irrigation`). Thus only two of the current nine services have matching editable records. Provision approved records for the other seven: `date-palm-tree-care`, `landscape-design`, `irrigation-systems`, `grass-plantation`, `soil-fertilization`, `garden-cleaning` and `indoor-plants`. All nine public services remain available from typed fallback content meanwhile.
7. **Analytics/privacy configuration:** no analytics provider is configured. Optional `abgardening:conversion` events are disabled by default; enabling them requires an owner-approved integration and privacy/consent setup. Events measure contact intent, not message delivery or completed bookings. The language preference cookie should be covered by the approved privacy information.
8. **Production validation:** repeat HTTPS, reverse-proxy, mobile-device and field performance checks after an authorized deployment. Review production security policy, Supabase Auth limits and media operation monitoring with the owner.

## Known limitations

- Mobile performance and LCP targets remain unmet despite the measured rendering improvements. Field INP is unmeasured; desktop lab results do not establish mobile or production Core Web Vitals.
- Zero automated axe violations and Lighthouse accessibility 100 do not establish complete WCAG 2.2 AA conformance. Manual screen-reader, contrast, zoom and device review remain necessary, especially axe's incomplete background/image contrast cases.
- The CMS browser test uses substitutes for Supabase and Cloudinary. The database test exercises local PostgreSQL policies with an Auth identity stub. Neither proves live provider compatibility.
- The credential scan covers the current tracked files at check time, not Git history, untracked/ignored local configuration or deployed secrets. Registry auditing only detects known published advisories and is not a penetration test.
- LocalBusiness rich-result address, coordinates, hours and rating fields are deliberately absent without verified facts. Accurate Organization and Service data are supplied instead.
- No external enquiry was sent, no provider account was changed, and no deployment was performed.
