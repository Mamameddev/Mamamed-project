// Resolve image asset metadata into the same shape used by local fallback content.
const photo = '{"src": asset->url, alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height}';
export const websiteQuery = `*[_type == "websiteContent" && _id == "websiteContent"][0]{
  ...,
  "videos": coalesce(videos, []), "outreachMoments": coalesce(outreachMoments, []),
  "testimonial": coalesce(testimonial, null), "womenReachedSuffix": coalesce(womenReachedSuffix, ""),
  "heroPhoto": heroPhoto${photo}, "founderPhoto": founderPhoto${photo},
  "logoPhoto": logoPhoto${photo}, "socialPhoto": socialPhoto${photo},
  "communityPhotos": coalesce(communityPhotos[]${photo}, [])
}`;
