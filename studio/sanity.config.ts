import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool, defineLocations } from 'sanity/presentation';
import { schemaTypes } from './schema';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL;
if (!projectId || !dataset || !previewUrl) throw new Error('Set SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET and SANITY_STUDIO_PREVIEW_URL in studio/.env.local');

export default defineConfig({
  name: 'mamameds', title: 'MamaMeds', projectId, dataset,
  plugins: [
    structureTool({ structure: S => S.list().title('MamaMeds').items([
      S.listItem().title('Website Content').id('websiteContent').child(S.document().schemaType('websiteContent').documentId('websiteContent')),
    ]) }),
    presentationTool({
      previewUrl: { initial: previewUrl, previewMode: { enable: '/api/draft-mode/enable' } },
      resolve: { locations: { websiteContent: defineLocations({ locations: [{ title: 'MamaMeds homepage', href: '/' }] }) } },
    }),
  ],
  schema: { types: schemaTypes, templates: previous => previous.filter(template => template.schemaType !== 'websiteContent') },
  document: {
    actions: (previous, context) => context.schemaType === 'websiteContent'
      ? previous.filter(action => !['delete', 'duplicate', 'unpublish'].includes(action.action ?? '')) : previous,
    newDocumentOptions: previous => previous.filter(option => option.templateId !== 'websiteContent'),
  },
});
