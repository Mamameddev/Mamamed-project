import { z } from 'zod';
import { copyFields } from './copy';

export const WEBSITE_ID = 'websiteContent';
export const WEBSITE_TAG = 'mamameds-website';
export const text = z.string().min(1).max(5000).refine(value => value.trim().length > 0, 'Enter some text');
export const httpsUrl = z.string().url().refine(value => {
  const url = new URL(value);
  return url.protocol === 'https:' && !url.username && !url.password;
}, 'Use a public HTTPS URL');
export const cloudinaryVideo = httpsUrl.refine(value => {
  const url = new URL(value);
  return url.hostname === 'res.cloudinary.com' && /^\/[^/]+\/video\/upload\//.test(url.pathname) && /\.mp4$/i.test(url.pathname);
}, 'Use a direct Cloudinary video/upload MP4 URL');
export const imageUrl = z.string().refine(value => {
  if (/^\/images\/[a-zA-Z0-9_.-]+$/.test(value)) return true;
  const parsed = httpsUrl.safeParse(value);
  return parsed.success && ['cdn.sanity.io', 'res.cloudinary.com'].includes(new URL(value).hostname);
}, 'Use an uploaded Sanity image or a Cloudinary image');
export const photoSchema = z.object({ src: imageUrl, alt: text.max(250), width: z.number().int().positive(), height: z.number().int().positive() });
export const videoSchema = z.object({
  id: text.max(100), title: text.max(150), description: text,
  src: cloudinaryVideo, originalSrc: cloudinaryVideo.optional(),
  poster: imageUrl, duration: z.string().regex(/^\d{1,3}:[0-5]\d$/),
  transcript: z.string().max(30000).optional(),
  captions: z.object({ src: httpsUrl, language: text.max(20), label: text.max(100) }).optional(),
});
const uniqueVideos = z.array(videoSchema).max(20).refine(videos => new Set(videos.map(v => v.id)).size === videos.length, 'Video IDs must be unique');
const copyShape = Object.fromEntries(Object.keys(copyFields).map(key => [key, text])) as Record<keyof typeof copyFields, typeof text>;
export const websiteSchema = z.object({
  ...copyShape,
  heroPhoto: photoSchema.nullable(), founderPhoto: photoSchema.nullable(), communityPhotos: z.array(photoSchema).max(12),
  founderBiography: z.array(text).min(1).max(20),
  womenReached: z.number().int().nonnegative(), womenReachedSuffix: z.enum(['', '+']), outreachCount: z.number().int().nonnegative(),
  milestones: z.array(z.object({ label: text.max(80), title: text.max(80), text: text.max(120), current: z.boolean() })).min(1).max(6),
  videos: uniqueVideos, outreachMoments: uniqueVideos, testimonial: videoSchema.nullable(),
  volunteerFormUrl: httpsUrl, email: z.string().email(), instagramUrl: httpsUrl, instagramHandle: text.max(100), linkedinUrl: httpsUrl,
  name: text.max(100), organizationName: text.max(200), seoTitle: text.max(100), seoDescription: text.max(300),
  logoPhoto: photoSchema, socialPhoto: photoSchema,
}).superRefine((value, ctx) => {
  const videos = [...value.videos, ...value.outreachMoments, ...(value.testimonial ? [value.testimonial] : [])];
  if (new Set(videos.map(v => v.id)).size !== videos.length) ctx.addIssue({ code: 'custom', path: ['videos'], message: 'Video IDs must be unique across all story groups' });
});
export type Website = z.infer<typeof websiteSchema>;
