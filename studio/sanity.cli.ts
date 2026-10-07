import { defineCliConfig } from 'sanity/cli';
export default defineCliConfig({
  deployment: { appId: 'ony671tfhlz0v27v0yp5za7h', autoUpdates: false },
  api: { projectId: process.env.SANITY_STUDIO_PROJECT_ID, dataset: process.env.SANITY_STUDIO_DATASET },
});
