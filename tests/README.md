# Local verification

Production dependencies do not include browser or audit tooling. Install the optional test tools into the ignored directory:

```powershell
npm install --prefix .qa --no-save playwright-core axe-core lighthouse @electric-sql/pglite
npm run build
npm run start -- --port 3100
```

Use a separate terminal for the checks. Google Chrome must be installed. `QA_CHROME_PATH` can specify its executable path, and `QA_BASE_URL` can override the default `http://localhost:3100`.

```powershell
node tests/seo.cjs
node tests/conversion-events.cjs
node tests/cms-db.cjs
node tests/public-ui.cjs
node tests/cms-browser-fixture.cjs
node tests/performance.cjs
```

`public-ui.cjs` checks 34 English/Arabic pages, localized contact links, internal links, missing routes, security headers and cookie-based entry redirects. It exercises homepage layouts from 320px to 2560px, representative internal pages on mobile/tablet/desktop, service and project filters, service/area disclosures, FAQ, unobscured anchor destinations, navigation and locale persistence, mouse/keyboard/touch comparison, gallery focus return, and client-side quote validation. The quote handoff is intercepted; no external enquiries are opened or sent. The expected WhatsApp number defaults to the existing business number; use `QA_WHATSAPP_NUMBER` if the server was intentionally built with an override.

The old `hero-refinement-check.cjs` and `whatsapp-check.cjs` commands remain as scoped entry points into the current suite. They no longer assume removed product routes, old service slugs, disabled WhatsApp, or automatic comparison rotation.

Screenshots and JSON results are written to ignored `test-results/public-ui/`. `QA_WIDTHS` accepts a comma-separated subset for investigation, `QA_SCREENSHOTS=0` skips captures, and `QA_SKIP_AXE=1` skips automated accessibility scans. Final verification should use the complete default matrix. Axe includes WCAG 2.2 AA rules where supported; a passing automated scan does not establish full WCAG conformance and does not replace manual keyboard, screen-reader, contrast and visual review.

Full-page screenshot exports temporarily set `content-visibility: visible` so Chrome paints sections beyond the viewport. The screenshot API removes that style immediately. Functional, responsive, axe and Lighthouse checks retain the website's normal content visibility and rendering behavior.

`cms-db.cjs` uses local PostgreSQL through PGlite to apply the real migrations and check policies, publication protection, image replacement and service updates. It does not connect to Supabase. The migration seeds intentionally retain four legacy CMS services; the public catalogue adapter supplies the complete nine-service catalogue.

The pre-existing migration seeds are `grass-cutting`, `garden-maintenance`, `landscaping` and `plant-and-irrigation`. Only the first two overlap the current nine public slugs. CMS rows still need provisioning for `date-palm-tree-care`, `landscape-design`, `irrigation-systems`, `grass-plantation`, `soil-fertilization`, `garden-cleaning` and `indoor-plants` before all current services can be edited through the admin. Until then the public site serves the existing typed content for those seven services. No database migration or live provider change is performed by this QA pass. The browser fixture selects its supported `grass-cutting` record explicitly and uses a unique project slug/key to prevent repeat-run cache contamination.

`conversion-events.cjs` verifies the optional conversion hook remains safe during server rendering, stays inactive without configuration and never includes contact-form entries, enquiry text or URL query values in its payload.

`cms-browser-fixture.cjs` starts its own production server on 3101 and a disposable Supabase-shaped HTTP fixture on 54419. It requires a completed production build. It tests authentication and admin CRUD, publication, media errors, ordering, preview, public invalidation, service edits and logout. Media delivery/uploads are local substitutes; this does not verify live Supabase or Cloudinary operation.

`performance.cjs` runs separate Lighthouse mobile and desktop lab audits of the English and Arabic homepages and saves HTML/JSON plus `test-results/lighthouse/summary.json`. Run it after other browser work has finished to reduce measurement interference. Results depend on the machine and local server. Lab LCP, CLS and total blocking time are reported; real-user INP and production Core Web Vitals require field traffic. An intentionally non-indexable local preview may lose SEO points for its robots directive.
