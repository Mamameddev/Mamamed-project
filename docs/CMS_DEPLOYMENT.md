# MamaMeds CMS deployment

Sanity Studio is deployed at https://mamamedsng.sanity.studio/.

- Project: `tpfdrq4k`
- Dataset: `mamameds_data`
- Studio app ID: `ony671tfhlz0v27v0yp5za7h`
- Hosted origin is authorized with credentials.
- Hosted preview destination: `https://mamamedsng.com`
- Automatic Studio dependency updates are disabled; release tested versions from this repository.
- Publishing hook: `3gh4yZva6vi5xCxs`, for the production revalidation endpoint.

Redeploy Studio with:

```sh
SANITY_STUDIO_PREVIEW_URL=https://mamamedsng.com npm run cms:deploy -- --url mamamedsng --yes
```

Website target: existing Vercel project `mamamed-project-yiib`, team `mamameds`, production domain `https://mamamedsng.com`. Do not create a replacement project. Confirm `vercel teams ls` includes `mamameds` before linking/deploying.

Production and preview use the CMS variables described in `CMS_SETUP.md`. Read/preview and webhook credentials are stored as sensitive variables in Vercel. The Editor import token stays local. The deployed Studio preview URL must remain the production website origin.

After a code deployment, check the homepage, CMS images, draft entry/exit, signed webhook, robots/sitemap, and domain redirects. Keep the hook enabled once the production endpoint is available. Publishing normal content changes requires no GitHub push.
