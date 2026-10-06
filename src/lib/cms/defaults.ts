import { content } from '../content';
import { site } from '../site';
import { copyFields } from './copy';
import { websiteSchema, type Website } from './model';
import biography from './biography.json';

export const defaultWebsite: Website = websiteSchema.parse({
  ...Object.fromEntries(Object.entries(copyFields).map(([key, field]) => [key, field.value])),
  heroPhoto: content.hero, founderPhoto: content.founder, communityPhotos: content.community,
  founderBiography: biography,
  womenReached: 250, womenReachedSuffix: '+', outreachCount: 2,
  milestones: [
    { label: 'So far', title: '250+', text: 'women reached', current: true },
    { label: 'End of 2026 target', title: '500', text: 'women reached', current: false },
    { label: '2027 plan', title: 'Tech infrastructure', text: 'pilot', current: false },
    { label: '2031 target', title: '100,000', text: 'women impacted', current: false },
  ],
  videos: content.videos, outreachMoments: content.outreachMoments, testimonial: content.testimonial,
  volunteerFormUrl: content.volunteerFormUrl, email: site.email,
  instagramUrl: site.instagram.url, instagramHandle: site.instagram.handle, linkedinUrl: site.linkedin.url,
  name: site.name, organizationName: site.organizationName, seoTitle: site.title, seoDescription: site.description,
  logoPhoto: { src: site.logo, alt: 'MamaMeds', width: 744, height: 458 },
  socialPhoto: { src: site.socialImage, alt: 'MamaMeds — Every mother deserves a safe pregnancy.', width: 1200, height: 630 },
});
