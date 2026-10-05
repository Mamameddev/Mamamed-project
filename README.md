# MamaMeds Website

Phase 2 full-page draft for MamaMeds Maternal Health Foundation, supporting maternal health in Nigeria. Built from the approved Stitch direction. This delivery is deploy-ready; publishing and DNS changes are separate steps.

## Tech stack

Next.js App Router, React, TypeScript, Tailwind CSS, Lucide React icons, and npm. Server Components by default, optimized local images, and fonts self-hosted by Next.js. Use Node.js 22.13+ (22.x LTS recommended).

## Getting started

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. No credentials are needed for local development.

## Environment variables

`NEXT_PUBLIC_SITE_URL` is the single origin used for canonical links, Open Graph, Organization JSON-LD, robots, and sitemap URLs. The local example uses `http://localhost:3000`.

For a production build, set it to the real public HTTPS origin, without a path, query, or fragment. Missing schemes are normalized to HTTPS and trailing slashes are removed. Public HTTP origins are upgraded to HTTPS. Production builds reject missing or localhost origins. Do not commit `.env.local` or any credentials.

## Development and production checks

```sh
npm run lint
npm run typecheck
npm test
```

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` to your public origin before running:

```sh
npm run build
npm start
```

The first build needs network access to download the Google font files. Visitors receive these fonts from the website itself. Production builds include static homepage, robots, and sitemap output; changing the origin requires a rebuild/redeployment.

## Project structure

```text
src/app/                   Page, layout, styles, icons, robots, sitemap
src/components/layout/     Header, responsive navigation, and footer
src/components/sections/   Full landing-page sections
src/lib/                   Site information, editable content, and URL validation
public/images/             Optimized logo, outreach hero image, social card
tests/                    URL normalization regression tests
```

## Design and assets

White canvas, ocean blue `#0C3C60`, orange `#F15A24`, and ice blue `#F0F7FB`. Headings use Plus Jakarta Sans; body text uses Inter. Small orange text uses darker `#AD3300` for contrast. Navigation points to real page sections; donation processing remains disabled with a visible explanation. Lucide supplies interface icons, while Simple Icons supplies the actual Instagram brand icon. Decorative icons are hidden from screen readers.

The Phase 2 draft uses branded text panels until real hero/founder photography is supplied. The approved impact figures are 250+ women reached and 2 community outreaches. The footer and Contact section link to @mamamedsng. No contact details or volunteer URL are fabricated. The favicon uses the supplied logo emblem; the current social-sharing card contains branding and the mission headline only. Old generated media are retained as historical assets but are not referenced by the current page or metadata.

## Deployment to Vercel

1. Review and commit the project, including `package-lock.json`, and push it to the configured GitHub repository when ready. This implementation does not push automatically.
2. Log into the intended Vercel account/team and import `Mamameddev/Mamamed-project` from GitHub. Authorize repository access if requested.
3. Select the standard Next.js preset and repository root. Keep the default installation/build behavior; no custom `vercel.json` is required. Select Node.js 22.x.
4. Before building, set `NEXT_PUBLIC_SITE_URL` for Production to the confirmed official domain if known. Otherwise use the actual assigned Vercel project domain shown in project settings, including `https://`. Never use an invented domain. If necessary, create the project first, configure the variable, then redeploy.
5. Set the variable for Preview too if using preview builds; use the chosen production canonical origin. Vercel controls deployment access and preview indexing separately from application metadata.
6. Deploy and verify the homepage, images, `/icon.png`, `/robots.txt`, and `/sitemap.xml`.

The public application is indexable. No application-level `noindex` is added. Confirm production deployment protection allows public visitors before launch.

## GoDaddy domain configuration

GoDaddy retains domain registration and DNS management. Vercel hosts the application. The chosen canonical strategy is `https://<official-domain>`, with `www` redirecting to the apex through Vercel.

1. Log into Vercel and open the project's **Settings → Domains**.
2. Add the actual apex domain and its `www` version. Configure `www` to redirect permanently to the apex using Vercel's domain settings.
3. Read the exact DNS records Vercel provides for this project, including any ownership verification record.
4. Log into the client's GoDaddy account and open that domain's DNS management page. Record the current website records before changing them.
5. Add or update only the website routing/verification records requested by Vercel. These may be A, CNAME, or TXT records. Copy the exact host and value shown by Vercel; do not reuse example IP addresses or guessed targets.
6. Preserve nameservers and all unrelated records, especially MX, SPF, DKIM, DMARC, other TXT verification records, and service subdomains. Do not replace the DNS zone or transfer the domain.
7. Return to Vercel and wait for DNS validation and HTTPS certificate provisioning. Resolve any reported record conflict before proceeding.
8. Set `NEXT_PUBLIC_SITE_URL=https://<official-domain>` in Vercel using the real domain, update Preview configuration if applicable, and redeploy. Confirm the custom domain is assigned to the production deployment.

Vercel login is required for repository import, environment configuration, deployment, and domain settings. GoDaddy login is required only for DNS edits. Keep ownership with the client; never put account credentials in the repository.

Reference: [Vercel custom domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

## Post-launch verification

- Apex loads publicly; www redirects to apex; HTTP redirects to HTTPS.
- HTTPS has a valid certificate, with no mixed-content warnings.
- Logo, hero image, favicon, and social image load.
- `/robots.txt` allows crawling and references the correct sitemap.
- `/sitemap.xml` contains the canonical homepage.
- Page source has the correct canonical, `og:url`, social image URLs, and JSON-LD URLs.
- No localhost or obsolete temporary Vercel origin remains in those URLs.
- Mobile layout and keyboard navigation work on the deployed site.
- Existing domain email still sends and receives, if applicable.

Use `dig <official-domain>`, `dig www.<official-domain>`, and `curl -I https://<official-domain>` with the actual domain to inspect DNS and response headers. Verify redirects with `curl -I https://www.<official-domain>` and inspect the certificate in the browser. Compare DNS results with the current Vercel-provided records; propagation can take time. If routing fails, restore only the website records recorded before the change while diagnosing the configuration.

## SEO

Next.js Metadata API provides title, description, canonical URL, index/follow directives, Open Graph, and Twitter cards. Organization JSON-LD contains only the known name, description, URL, and logo. The sitemap contains only the homepage. No addresses or registration details are inferred; Instagram is the account explicitly supplied by the user.

## Project phases

- **Phase 1:** Coming Soon page, technical and SEO foundation, tested deployment preparation, and domain setup documentation.
- **Phase 2:** Full approved Stitch landing page. Before starting, confirm final section copy, authentic outreach/founder media, video source, and real contact/social links.
- **Phase 3:** Donation integration, analytics, media refinement, and final launch QA, separately authorized.

The production domain and account access are still needed for launch, but not for the completed deploy-ready implementation.

## Dependency audit note

At implementation, `npm audit --omit=dev` reported no production vulnerabilities. The full audit reports five high-severity entries arising from one unpatched `braces` advisory in the current Next.js ESLint dependency chain. This is build/lint tooling, not shipped page code. No patched compatible upstream release was available; do not apply the suggested forced downgrade to an older Next.js ESLint configuration. Recheck when updating dependencies.


## Phase 2 content handoff

The full-page draft is implemented locally. The seven supplied Cloudinary clips are connected. The temporary Google Form is connected. Real hero/founder photos and final founder-copy approval are still needed before launch. No CMS or payment integration is included. The current social card uses branding only; replace it with a branded card featuring approved real photography when supplied. Previous generated images are not referenced by the draft.

Edit `src/lib/content.ts`:

- `hero` and `founder`: approved real photos with `src`, descriptive `alt`, and intrinsic `width`/`height`. Use local `/images/...` paths or direct `https://res.cloudinary.com/...` image URLs. Null displays a branded text panel instead.
- `community`: optional real photos with the same shape. An empty array hides the photo gallery.
- `videos`: the two featured outreach montages; `outreachMoments`: four short clips behind an expandable control; `testimonial`: Tobi’s interview beside the Volunteer section. Each entry contains a unique `id`, accurate `title` and `description`, a direct HTTPS video `src`, and preferably a `poster` URL. Use Cloudinary delivery URLs rather than management-console or sharing-page URLs. Use broadly supported MP4/H.264/AAC files prepared at an appropriate mobile bitrate; Cloudinary hosting alone does not make a large original lightweight.
- For spoken videos, supply accurate WebVTT `captions` (`src`, `language`, `label`) and a `transcript`. Ensure the video/caption host permits cross-origin access. Do not publish speech-based videos without reviewing captions.
- `volunteerFormUrl`: the real Google Form URL, or null to show an honest availability message and the existing Instagram contact link.

Videos reserve a 9:16 area and preserve the complete frame with `object-fit: contain`. Initially only lazy WebP posters and accessible play buttons render: there is no video element, media source, or MP4 request until a visitor presses Play. The selected video then mounts with native controls/inline playback; only one clip plays at a time across all sections. Failures display a retry button and a link to the original. The four extra clips do not mount until expanded; collapsing them removes their players. No autoplay on page load and no third-party player/embed scripts.

Delivery URLs were measured against the originals. Six clips use Cloudinary `c_limit,w_480,h_854,q_auto:good,vc_h264` (never upscale these small originals); IMG_4593 uses the original because that transformation increased its size. The selected files total about 10.2 MB versus 14.5 MB for the originals, downloaded individually on demand. Featured poster images total about 81 KB; the four extra posters add about 105 KB only when expanded. These are measured file sizes, not a promise of load time on every network.

The first montage documents the first Lagos outreach; IMG_4593 is the second-outreach montage; IMG_4599 is Tobi’s interview, with captions already burned into the supplied video. Other clips are brief attendee/bag scenes. Source framing, embedded text, audio, and watermarks remain intact. Separate accurate WebVTT captions/transcripts can be added; do not claim an audio transcription has been independently verified.

The mission, programme descriptions, About section, founder narrative and quotation, and donation copy follow the founder-provided reference shared on October 5. Final founder-copy approval is still pending. Registration and 501(c)(3) claims from that reference are omitted until confirmed. The draft does not claim registration status, invent contact information, or quote unverified statements as her words. Header Donate links to the donation section; payment remains disabled. The mobile menu supports Escape and closes on section selection.
