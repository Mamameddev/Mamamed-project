/** Add approved real media here. Use direct HTTPS Cloudinary delivery URLs. */
export type Photo = { src: string; alt: string; width: number; height: number };
export type OutreachVideo = {
  id: string;
  /** Accessible label; shown only for Tobi’s story. */
  title: string;
  description?: string;
  /** Small preview that plays muted in the page. */
  src: string;
  /** Compressed full-size file opened with sound in the viewer. */
  fullSrc?: string;
  poster?: string;
  originalSrc?: string;
  duration?: string;
  captions?: { src: string; language: string; label: string };
  transcript?: string;
};
export type GalleryItem = { kind: 'video'; video: OutreachVideo } | { kind: 'photo'; id: string; photo: Photo };

const cloudinary = 'https://res.cloudinary.com/bmcmy4kk/video/upload';
/** Preview (6s silent loop, small) and viewer (720p, with sound) MP4s for an uploaded Cloudinary video such as `v123/IMG_1.mov`. */
export function cloudinaryVideoSources(file: string) {
  const path = file.replace(/\.[a-z0-9]+$/i, '');
  return {
    src: `${cloudinary}/c_limit,w_360,h_640,q_auto:eco,vc_h264,ac_none,du_6/${path}.mp4`,
    fullSrc: `${cloudinary}/c_limit,w_1280,h_1280,q_auto,vc_h264/${path}.mp4`,
  };
}
/** The `v123/name` part of any Cloudinary video delivery URL, ignoring its transformations. */
export const cloudinaryVideoFile = (url: string) => url.match(/\/video\/upload\/(?:.*\/)?(v\d+\/[^?#]+)$/)?.[1] ?? null;

function cloudinaryVideo(id: string, title: string, file: string, posterOffset: number): OutreachVideo {
  return {
    id, title, ...cloudinaryVideoSources(file),
    poster: `${cloudinary}/c_limit,w_480,q_auto,f_webp,so_${posterOffset}/${file}.webp`,
  };
}

export const content: {
  hero: Photo | null;
  founder: Photo | null;
  community: Photo[];
  workPhotos: Partial<Record<'medications' | 'education' | 'outreach', Photo>>;
  gallery: GalleryItem[];
  testimonial: OutreachVideo | null;
  volunteerFormUrl: string | null;
} = {
  hero: { src: 'https://res.cloudinary.com/bmcmy4kk/image/upload/c_limit,w_1280,q_auto,f_auto/v1791315047/photo_2026-10-06_19-30-35.jpg', alt: 'Women at a MamaMeds outreach holding MamaMeds bags', width: 1280, height: 1277 },
  founder: { src: '/images/kasite-ugo-beke.webp', alt: 'Kasite Ugo-Beke, founder of MamaMeds', width: 591, height: 887 },
  community: [],
  workPhotos: {},
  gallery: [
    { kind: 'video', video: cloudinaryVideo('first-outreach', 'Our first outreach in Lagos', 'v1791170491/video_2026-10-03_09-49-59', 2.7) },
    { kind: 'video', video: cloudinaryVideo('second-outreach', 'Our second outreach', 'v1791170843/IMG_4593', 0.2) },
    { kind: 'photo', id: 'volunteers-with-bags', photo: { src: 'https://res.cloudinary.com/bmcmy4kk/image/upload/v1792215031/photo_2026-10-17_05-23-27.jpg', alt: 'MamaMeds volunteers with bags ready to share at our outreach', width: 768, height: 1024 } },
    { kind: 'video', video: cloudinaryVideo('bags-ready', 'MamaMeds bags lined up for our outreach', 'v1792215033/video_2026-10-17_05-23-36', 1) },
    { kind: 'photo', id: 'volunteers-supporting-women', photo: { src: 'https://res.cloudinary.com/bmcmy4kk/image/upload/v1792215032/photo_2026-10-17_05-23-30.jpg', alt: 'MamaMeds volunteers supporting women at our outreach', width: 768, height: 1024 } },
    { kind: 'video', video: cloudinaryVideo('outreach-gathering', 'Volunteers and guests gathered at our outreach', 'v1792215032/video_2026-10-17_05-23-33', 0) },
    { kind: 'video', video: cloudinaryVideo('heading-home', 'A woman heading home with her MamaMeds bag', 'v1792215033/video_2026-10-17_05-23-19', 1) },
    { kind: 'video', video: cloudinaryVideo('bag-in-hand', 'A woman carrying her MamaMeds bag', 'v1792215033/video_2026-10-17_05-23-24', 1) },
  ],
  testimonial: cloudinaryVideo('tobi-story', 'Tobi’s story', 'v1791170846/IMG_4599', 1),
  volunteerFormUrl: 'https://forms.gle/mC6JL1Rn1bkPRVxu7',
};
