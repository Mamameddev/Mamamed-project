# CMS verification — local implementation

Checked October 7, 2026 on `feat/sanity-cms`. Nothing pushed or deployed.

Passed:
- Clean `npm ci`, ESLint, TypeScript, and 18 regression tests.
- Website production builds with CMS disabled and enabled, plus Studio production build.
- Initial import: 75 fields, seven existing videos, and the approved image assets. Published content matches the migration snapshot; a repeat import preserves existing content.
- GROQ fixture tests resolve uploaded assets and preserve mixed photo/video ordering; missing alt text and invalid content are rejected.
- Chrome checks at 320, 390, 768, 1024, and 1440px: no page overflow, one footer, keyboard gallery navigation, and no automated WCAG A/AA violations.
- Existing video behavior: deferred loading, muted inline autoplay, explicit sound/native controls, pause, one player, offscreen/hidden-tab pausing, and reduced-motion/data-saving/blocked-autoplay fallbacks.
- Grammarly-injected body attributes do not cause hydration errors; mobile menu works.
- Local HTTP tests: unsigned and wrong-secret webhook requests return 401; valid publishing event returns 200; draft events are ignored. Unconfigured preview fails closed; cross-origin exit returns 403; same-origin exit redirects.

Authenticated verification against project `tpfdrq4k` / `mamameds_data`:
- Photo upload through the Sanity API, mixed-gallery ordering, and image/video metadata changes passed.
- A temporary draft stayed out of the public page. A Sanity-generated preview secret enabled the draft with noindex metadata; invalid secrets were rejected. Exiting preview returned to published content.
- Publishing and a signed local webhook updated the public response and SEO without rebuilding. Original approved content was restored and temporary draft/preview-secret documents were removed.
- The mixed gallery retained 9:16 frames without overflow at all five widths.
- Sanity's `documents validate` checked the imported singleton: zero errors or warnings.
- A simulated upstream outage rejected actual refresh requests while the local page continued serving the validated cache.
- Configured token/secret values were absent from `.next/static` and `studio/dist`.

Both local Studio CORS origins are authorized. CMS delivery is enabled locally, and Studio displays its normal Sanity sign-in screen. The authenticated upload/publish test used API calls and the actual website preview; a human Studio editing walkthrough with Kasite's own account remains part of handoff. No Studio hosting, Vercel deployment, hosted webhook delivery, or account invitation was performed in this turn.

Dependency review: compatible overrides update Sanity tooling's YAML and TOML parsers. `npm audit --omit=dev` still reports 17 transitive advisories (7 high, 10 moderate), originating from braces, sprintf-js, and uuid and their dependency chains. Available automatic recommendations involve major downgrades of Sanity/next-sanity and were not applied. The registry currently has no patched braces/sprintf-js release. Review upstream fixes before production rollout; this is not a clean dependency-security audit.

Browser screenshots and local test logs are under `/tmp/mamameds-browser-qa/` and are not committed. Follow `CMS_SETUP.md` for the Studio walkthrough and separately authorized rollout.

Follow-up: Studio rejected explicitly null optional card-photo fields even though the document validator accepted them. The importer now omits empty optional media, covered by a regression test. `scripts/repair-empty-media.ts` removes only those null fields with revision guards; the current document was repaired with all other edits preserved. Empty fields in the website query still resolve to null as expected by the frontend.
