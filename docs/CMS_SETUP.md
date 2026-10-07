# MamaMeds CMS setup and recovery

The website keeps its existing layout and media player. The initial import and authenticated local tests are now complete; see `CMS_VERIFICATION.md` for results. Sanity manages one `websiteContent` document. Work is on `feat/sanity-cms`; deployment and push are separate steps. The older CMS stash and backup branch are preserved.

## Accounts and configuration

MamaMeds owns project `tpfdrq4k`, dataset `mamameds_data`. Invite Kasite and the developer with separate accounts through Sanity Manage → Members. Kasite's agreed Administrator role can also change project settings: the Studio safeguards below prevent ordinary accidental deletion, not administrator/API access. No paid plan is enabled by this code.

Run `npm ci` at the repository root (Studio is an npm workspace). Copy `.env.example` to `.env.local` and `studio/.env.example` to `studio/.env.local` only if those local files do not exist. Both are ignored by Git.

Website environment:

| Variable | Value / purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3011` locally; `https://mamamedsng.com` for production builds |
| `SANITY_PROJECT_ID` | `tpfdrq4k` |
| `SANITY_DATASET` | `mamameds_data` |
| `SANITY_ENABLED` | `false` until import and validation finish; then `true` |
| `SANITY_API_READ_TOKEN` | Viewer token, server-only; required for drafts and private datasets |
| `SANITY_REVALIDATE_SECRET` | A randomly generated secret shared with the publishing webhook |
| `SANITY_IMPORT_TOKEN` | Editor token, local-only for initial import; remove/revoke after import |

Create tokens in Sanity Manage → API → Tokens. Never use a `NEXT_PUBLIC_` or `SANITY_STUDIO_` prefix for tokens. Never commit tokens. Studio uses individual Sanity login, not the website token.

Studio environment contains only public values: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, and `SANITY_STUDIO_PREVIEW_URL` (localhost initially, website HTTPS origin after rollout).

Add `http://localhost:3333` and `http://127.0.0.1:3333` to the project's CORS origins with credentials allowed for local Studio. Later add the exact hosted Studio origin. Do not use wildcard credentialed origins.

## Initial import and local review

1. `npm run cms:import -- --dry-run` validates the current content without writes.
2. With the local Editor token set, run `npm run cms:import`. It uploads the current hero, Kasite portrait, logo, and social image and creates the singleton only if neither its draft nor published document exists. It never overwrites subsequent edits. Rerunning is safe; concurrent imports are not intended.
3. `npm run cms:verify` validates the actual published query and reports editorial differences from the migration snapshot. Investigate any unexpected differences before enabling.
4. Set `SANITY_ENABLED=true` locally. Run `npm run dev -- --port 3011` and, in another terminal, `npm run cms:dev`. Open http://localhost:3333 and sign into the MamaMeds project.
5. Check all current copy/photos/videos. Test a temporary draft heading and gallery photo: public page must remain unchanged, Presentation must show the draft. Use Refresh preview after editing if needed. Exit preview and verify published content returns.
6. Publish the test change and verify the page updates within the periodic refresh window (60 seconds plus the next request; webhook later shortens this). Restore the intended content through Studio and publish it. Check metadata as well as page text. Do not leave test content published.
7. Check gallery photo reorder, caption/alt validation, missing required fields, replacing hero/founder images, Cloudinary URL validation, and mixed gallery performance.

Uploads are served through responsive Next Image sizes and lazy loading; the hero is prioritized. Gallery photos fit inside uniform portrait frames without cropping. Videos remain on Cloudinary with existing visibility-based, muted previews and one-player coordination. Studio has no direct video upload field.

## Deployment, only when requested

Run `npm run lint`, `npm run typecheck`, `npm test`, `NEXT_PUBLIC_SITE_URL=https://mamamedsng.com npm run build`, and `npm run cms:build`.

After local review, authenticate the Sanity CLI (`npx sanity login`) and run `npm run cms:deploy`; choose a MamaMeds Studio hostname under the included Sanity hosting. Before deploying set the Studio preview URL to `https://mamamedsng.com`. Add that Studio origin to credentialed CORS. Do not place tokens in Studio environment variables.

Add website variables in Vercel, excluding `SANITY_IMPORT_TOKEN`. Set `SANITY_ENABLED=true` only after the imported content validates. Deploy the CMS branch when approved. Environment changes require a deployment; ordinary content publishing does not.

In Sanity Manage → API → Webhooks create:

- URL: `https://mamamedsng.com/api/sanity/revalidate`
- Method: POST; trigger on create/update/delete; drafts disabled
- Filter: `_type == "websiteContent" && _id == "websiteContent"`
- Projection: `{_id, _type}`
- Secret: exactly `SANITY_REVALIDATE_SECRET` from Vercel

The route rejects missing/invalid signatures. A valid event marks the content stale using `revalidateTag(..., 'max')`; the next request refreshes it in the background. A 60-second revalidation interval is the backup. The first visitor after publishing may briefly receive cached content. No rebuild is required.

Draft entry uses the supported Sanity preview-secret validator and a server-only Viewer token. Draft queries bypass public caches, carry noindex metadata, and display a preview banner. The Presentation connection is enabled only in draft mode. Exit preview is a same-origin POST and clears partitioned iframe cookies too.

## Safeguards and recovery

The singleton cannot normally be deleted, duplicated, or unpublished through the Studio actions; layouts and anchors stay in code. Text is rendered as text, not arbitrary HTML. Only public website material belongs here; Google Forms responses and bank details do not.

Validated published data is cached by Next. If a background CMS refresh fails, Next retains the prior good value. A fresh deployment with an empty cache and an unavailable CMS can fail: this is deliberately not silently replaced by stale migration content. For an outage requiring rollback, set `SANITY_ENABLED=false` and redeploy to serve the bundled migration snapshot. That snapshot will not include edits made in Sanity since import. Restore CMS delivery after service/content recovery.

Export regularly: from `studio`, run `npx sanity dataset export mamameds_data /safe/path/mamameds-backup.tar.gz` using an authorized account. Keep exports outside Git with restricted access. Restoring an export is a deliberate recovery operation: review it and test in a separate dataset before replacing production content. Sanity's document history also helps recover individual edits.

Content changes do not require GitHub access. Code changes still do. Check current free-plan usage/quotas in Sanity Manage before large media imports; this setup does not purchase upgrades.
