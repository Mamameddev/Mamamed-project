import { defineType, defineField, defineArrayMember } from 'sanity';
import { copyFields } from '../src/lib/cms/copy';
import { cloudinaryVideo, httpsUrl, imageUrl } from '../src/lib/cms/model';

const titleFor = (name: string) => name.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
const urlCheck = (value: unknown) => value === undefined || httpsUrl.safeParse(value).success || 'Use an HTTPS URL without credentials';
const photo = defineType({ name: 'websitePhoto', title: 'Photo', type: 'image', options: { hotspot: false }, fields: [
  defineField({ name: 'alt', title: 'Describe this image for screen readers', type: 'string', validation: rule => rule.required().max(250) }),
], validation: rule => rule.custom(value => !value || value.asset?._ref ? true : 'Upload an image') });
const video = defineType({ name: 'outreachVideo', title: 'Outreach video', type: 'object', fields: [
  defineField({ name: 'id', type: 'string', title: 'Video identifier', description: 'Unique across all videos. Use a short lowercase name.', validation: rule => rule.required().custom(value => typeof value === 'string' && value.trim().length > 0 || 'Enter some text') }),
  defineField({ name: 'title', type: 'string', validation: rule => rule.required().max(150) }),
  defineField({ name: 'description', type: 'text', rows: 3, validation: rule => rule.required().custom(value => typeof value === 'string' && value.trim().length > 0 || 'Enter some text') }),
  defineField({ name: 'src', title: 'Cloudinary MP4 URL', type: 'url', validation: rule => rule.required().custom(value => cloudinaryVideo.safeParse(value).success || 'Use a direct Cloudinary video/upload MP4 URL') }),
  defineField({ name: 'originalSrc', title: 'Original MP4 URL (optional)', type: 'url', validation: rule => rule.custom(value => !value || cloudinaryVideo.safeParse(value).success || 'Use a direct Cloudinary MP4 URL') }),
  defineField({ name: 'poster', title: 'Poster image URL', type: 'url', description: 'Cloudinary still image; no video downloads before Play.', validation: rule => rule.required().custom(value => imageUrl.safeParse(value).success || 'Use a Cloudinary or Sanity image URL') }),
  defineField({ name: 'duration', title: 'Duration (m:ss)', type: 'string', validation: rule => rule.required().regex(/^\d{1,3}:[0-5]\d$/) }),
  defineField({ name: 'transcript', type: 'text', validation: rule => rule.max(30000) }),
  defineField({ name: 'captions', title: 'Optional WebVTT captions', type: 'object', fields: [
    defineField({ name: 'src', title: 'HTTPS caption URL', type: 'url', validation: rule => rule.required().custom(urlCheck) }),
    defineField({ name: 'language', type: 'string', initialValue: 'en', validation: rule => rule.required().custom(value => typeof value === 'string' && value.trim().length > 0 || 'Enter some text') }),
    defineField({ name: 'label', type: 'string', initialValue: 'English', validation: rule => rule.required().custom(value => typeof value === 'string' && value.trim().length > 0 || 'Enter some text') }),
  ] }),
], preview: { select: { title: 'title', subtitle: 'duration' } } });

const website = defineType({ name: 'websiteContent', title: 'Website Content', type: 'document', groups: [
  { name: 'hero', title: 'Hero', default: true }, { name: 'direction', title: 'Where we’re headed' }, { name: 'impact', title: 'Impact & roadmap' },
  { name: 'stories', title: 'Stories' }, { name: 'founder', title: 'Founder' }, { name: 'involved', title: 'Get involved' }, { name: 'settings', title: 'Site settings' },
], fields: [
  ...Object.entries(copyFields).map(([name, field]) => defineField({ name, title: titleFor(name), group: field.group, type: field.multiline ? 'text' : 'string', validation: rule => rule.required().max(5000).custom(value => typeof value === 'string' && value.trim().length > 0 || 'Enter some text') })),
  defineField({ name: 'heroPhoto', title: 'Hero photo (optional)', type: 'websitePhoto', group: 'hero' }),
  defineField({ name: 'founderPhoto', title: 'Founder portrait', type: 'websitePhoto', group: 'founder' }),
  defineField({ name: 'founderBiography', title: 'Biography paragraphs', type: 'array', group: 'founder', of: [defineArrayMember({ type: 'text', validation: rule => rule.required().custom(value => typeof value === 'string' && value.trim().length > 0 || 'Enter some text') })], validation: rule => rule.required().min(1).max(20) }),
  defineField({ name: 'womenReached', title: 'Women reached', type: 'number', group: 'impact', validation: rule => rule.required().integer().min(0) }),
  defineField({ name: 'womenReachedSuffix', title: 'Show plus sign', type: 'string', group: 'impact', options: { list: [{ title: 'Exact number', value: '' }, { title: 'At least (+)', value: '+' }] } }),
  defineField({ name: 'outreachCount', title: 'Community outreaches', type: 'number', group: 'impact', validation: rule => rule.required().integer().min(0) }),
  defineField({ name: 'milestones', title: 'Roadmap milestones', group: 'impact', type: 'array', of: [defineArrayMember({ name: 'milestone', type: 'object', fields: [
    defineField({ name: 'label', title: 'Period / target label', type: 'string', validation: rule => rule.required().max(80) }),
    defineField({ name: 'title', title: 'Number or headline', type: 'string', validation: rule => rule.required().max(80) }),
    defineField({ name: 'text', title: 'Description', type: 'string', validation: rule => rule.required().max(120) }),
    defineField({ name: 'current', title: 'Already achieved', type: 'boolean', initialValue: false, validation: rule => rule.required() }),
  ] })], validation: rule => rule.required().min(1).max(6) }),
  ...['videos', 'outreachMoments'].map(name => defineField({ name, title: name === 'videos' ? 'Featured outreach videos' : 'More outreach moments', type: 'array', group: 'stories', of: [defineArrayMember({ type: 'outreachVideo' })], validation: rule => rule.max(20) })),
  defineField({ name: 'testimonial', title: 'Personal story video (optional)', type: 'outreachVideo', group: 'stories' }),
  defineField({ name: 'communityPhotos', title: 'Additional outreach photos', type: 'array', group: 'stories', of: [defineArrayMember({ type: 'websitePhoto' })], validation: rule => rule.max(12) }),
  defineField({ name: 'volunteerFormUrl', title: 'Volunteer form URL', type: 'url', group: 'involved', validation: rule => rule.required().custom(urlCheck) }),
  defineField({ name: 'email', title: 'Contact and giving email', type: 'string', group: 'settings', validation: rule => rule.required().email() }),
  ...['instagramUrl', 'linkedinUrl'].map(name => defineField({ name, title: titleFor(name), type: 'url', group: 'settings', validation: rule => rule.required().custom(urlCheck) })),
  defineField({ name: 'instagramHandle', title: 'Instagram handle', type: 'string', group: 'settings', validation: rule => rule.required().max(100) }),
  defineField({ name: 'name', title: 'Short organization name', type: 'string', group: 'settings', validation: rule => rule.required().max(100) }),
  defineField({ name: 'organizationName', title: 'Full organization name', type: 'string', group: 'settings', validation: rule => rule.required().max(200) }),
  defineField({ name: 'seoTitle', title: 'Search / share title', type: 'string', group: 'settings', validation: rule => rule.required().max(100) }),
  defineField({ name: 'seoDescription', title: 'Search / share description', type: 'text', group: 'settings', validation: rule => rule.required().max(300) }),
  defineField({ name: 'logoPhoto', title: 'Logo', type: 'websitePhoto', group: 'settings', validation: rule => rule.required() }),
  defineField({ name: 'socialPhoto', title: 'Social sharing image', description: 'Recommended 1200 × 630 pixels.', type: 'websitePhoto', group: 'settings', validation: rule => rule.required() }),
], validation: rule => rule.custom(value => {
  const document = value as { videos?: {id?: string}[]; outreachMoments?: {id?: string}[]; testimonial?: {id?: string} } | undefined;
  const ids = [...(document?.videos ?? []), ...(document?.outreachMoments ?? []), ...(document?.testimonial ? [document.testimonial] : [])].map(v => v.id);
  return new Set(ids).size === ids.length || 'Use unique video identifiers across all story groups';
}), preview: { prepare: () => ({ title: 'Website Content', subtitle: 'MamaMeds homepage' }) } });
export const schemaTypes = [photo, video, website];
