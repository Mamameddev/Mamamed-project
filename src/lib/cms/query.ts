// Keep a stable app shape, resolving uploaded image dimensions server-side.
const photo = '{"src": asset->url, alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height}';
export const websiteQuery = `*[_type == "websiteContent" && _id == "websiteContent"][0]{
  ...,
  "videos": coalesce(videos, []),
  "testimonial": coalesce(testimonial, null), "womenReachedSuffix": coalesce(womenReachedSuffix, ""),
  "heroPhoto": heroPhoto${photo}, "founderPhoto": founderPhoto${photo},
  "logoPhoto": logoPhoto${photo}, "socialPhoto": socialPhoto${photo},
  "workPhotos": { "medications": workPhotos.medications${photo}, "education": workPhotos.education${photo}, "outreach": workPhotos.outreach${photo} },
  "gallery": coalesce(gallery[]{
    _type == "outreachVideo" => {"kind": "video", "video": {...}},
    _type == "galleryPhoto" => {"kind": "photo", "id": _key, "photo": photo${photo}, "caption":coalesce(caption, "")}
  }, [])
}`;
