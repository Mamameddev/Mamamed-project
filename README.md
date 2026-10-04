# MamaMeds Website

Phase 1 Coming Soon website for MamaMeds Maternal Health Foundation, supporting maternal health in Nigeria. Built from the approved Stitch direction. This delivery is deploy-ready; publishing and DNS changes are separate steps.

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
src/components/layout/     Header and footer
src/components/sections/   Coming Soon hero and impact strip
src/lib/                   Site information and URL validation
public/images/             Optimized logo, outreach hero image, social card
tests/                    URL normalization regression tests
```

## Design and assets

White canvas, ocean blue `#0C3C60`, orange `#F15A24`, and ice blue `#F0F7FB`. Headings use Plus Jakarta Sans; body text uses Inter. Small orange text uses darker `#AD3300` for contrast. The Donate button is intentionally disabled, with a visible explanation. Icons use named imports from `lucide-react`: Heart for donations and Clock3 for the Coming Soon status, and Camera for the Instagram footer link. Keep icons decorative when adjacent text provides the label (`aria-hidden="true"`), and use consistent 2px strokes.

The hero uses the supplied community gathering image. Its caption and alt text do not assert a verified event or location. The approved figures are 250+ women reached and 2 community outreaches. The footer links to the supplied Instagram account, @mamamedsng. No founder image, fabricated contact links, payment integration, or video is included. The favicon is derived from the supplied logo emblem; the static social-sharing image uses a 1200 × 630 crop of the current outreach hero, with a distinct asset URL to refresh image caches. All production images are local.

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

Next.js Metadata API provides title, description, canonical URL, index/follow directives, Open Graph, and Twitter cards. Organization JSON-LD contains only the known name, description, URL, and logo. The sitemap contains only the homepage. No social accounts, addresses, or registration details are inferred.

## Project phases

- **Phase 1:** Coming Soon page, technical and SEO foundation, tested deployment preparation, and domain setup documentation.
- **Phase 2:** Full approved Stitch landing page. Before starting, confirm final section copy, authentic outreach/founder media, video source, and real contact/social links.
- **Phase 3:** Donation integration, analytics, media refinement, and final launch QA, separately authorized.

The production domain and account access are still needed for launch, but not for the completed deploy-ready implementation.

## Dependency audit note

At implementation, `npm audit --omit=dev` reported no production vulnerabilities. The full audit reports five high-severity entries arising from one unpatched `braces` advisory in the current Next.js ESLint dependency chain. This is build/lint tooling, not shipped page code. No patched compatible upstream release was available; do not apply the suggested forced downgrade to an older Next.js ESLint configuration. Recheck when updating dependencies.
