/** Add approved real media here. Use direct HTTPS Cloudinary delivery URLs. */
export type Photo = { src: string; alt: string; width: number; height: number };
export type OutreachVideo = {
  id: string;
  title: string;
  description: string;
  src: string;
  poster?: string;
  originalSrc?: string;
  duration?: string;
  captions?: { src: string; language: string; label: string };
  transcript?: string;
};
export type GalleryItem = { kind: 'video'; video: OutreachVideo } | { kind: 'photo'; id: string; photo: Photo; caption?: string };
export const content: {
  hero: Photo | null;
  founder: Photo | null;
  community: Photo[];
  workPhotos: Partial<Record<'medications' | 'education' | 'outreach', Photo>>;
  videos: OutreachVideo[];
  outreachMoments: OutreachVideo[];
  testimonial: OutreachVideo | null;
  volunteerFormUrl: string | null;
} = {
  hero: { src: 'https://res.cloudinary.com/bmcmy4kk/image/upload/c_limit,w_1280,q_auto,f_auto/v1791315047/photo_2026-10-06_19-30-35.jpg', alt: 'Women at a MamaMeds outreach holding MamaMeds bags', width: 1280, height: 1277 },
  founder: { src: '/images/kasite-ugo-beke.webp', alt: 'Kasite Ugo-Beke, founder of MamaMeds', width: 591, height: 887 },
  community: [],
  workPhotos: {},
  videos: [
    {
        "id": "first-outreach",
        "title": "Our first outreach in Lagos",
        "description": "A look inside the outreach: conversations, preparation, and MamaMeds bags being shared.",
        "duration": "0:27",
        "src": "https://res.cloudinary.com/bmcmy4kk/video/upload/c_limit,w_480,h_854,q_auto:good,vc_h264/v1791170491/video_2026-10-03_09-49-59.mp4",
        "originalSrc": "https://res.cloudinary.com/bmcmy4kk/video/upload/v1791170491/video_2026-10-03_09-49-59.mp4",
        "poster": "https://res.cloudinary.com/bmcmy4kk/video/upload/c_limit,w_480,q_auto,f_webp,so_2.7/v1791170491/video_2026-10-03_09-49-59.webp"
    },
    {
        "id": "second-outreach",
        "title": "Our second outreach",
        "description": "From preparing MamaMeds bags to meeting women in the community.",
        "duration": "0:21",
        "src": "https://res.cloudinary.com/bmcmy4kk/video/upload/v1791170843/IMG_4593.mp4",
        "originalSrc": "https://res.cloudinary.com/bmcmy4kk/video/upload/v1791170843/IMG_4593.mp4",
        "poster": "https://res.cloudinary.com/bmcmy4kk/video/upload/c_limit,w_480,q_auto,f_webp,so_0.2/v1791170843/IMG_4593.webp"
    }
],
  outreachMoments: [
    {
        "id": "leaving-outreach",
        "title": "After the gathering",
        "description": "An attendee leaves the outreach carrying a MamaMeds bag.",
        "duration": "0:04",
        "src": "https://res.cloudinary.com/bmcmy4kk/video/upload/c_limit,w_480,h_854,q_auto:good,vc_h264/v1791170845/IMG_4597.mp4",
        "originalSrc": "https://res.cloudinary.com/bmcmy4kk/video/upload/v1791170845/IMG_4597.mp4",
        "poster": "https://res.cloudinary.com/bmcmy4kk/video/upload/c_limit,w_480,q_auto,f_webp,so_0.4/v1791170845/IMG_4597.webp"
    },
    {
        "id": "community-moment",
        "title": "A moment from the day",
        "description": "A short scene of an attendee carrying her MamaMeds bag.",
        "duration": "0:03",
        "src": "https://res.cloudinary.com/bmcmy4kk/video/upload/c_limit,w_480,h_854,q_auto:good,vc_h264/v1791170845/IMG_4595.mp4",
        "originalSrc": "https://res.cloudinary.com/bmcmy4kk/video/upload/v1791170845/IMG_4595.mp4",
        "poster": "https://res.cloudinary.com/bmcmy4kk/video/upload/c_limit,w_480,q_auto,f_webp,so_0.5/v1791170845/IMG_4595.webp"
    },
    {
        "id": "care-to-take-home",
        "title": "Care to take home",
        "description": "A close-up moment with a MamaMeds bag outside the venue.",
        "duration": "0:04",
        "src": "https://res.cloudinary.com/bmcmy4kk/video/upload/c_limit,w_480,h_854,q_auto:good,vc_h264/v1791170844/IMG_4594.mp4",
        "originalSrc": "https://res.cloudinary.com/bmcmy4kk/video/upload/v1791170844/IMG_4594.mp4",
        "poster": "https://res.cloudinary.com/bmcmy4kk/video/upload/c_limit,w_480,q_auto,f_webp,so_0.8/v1791170844/IMG_4594.webp"
    },
    {
        "id": "mamameds-in-hand",
        "title": "MamaMeds in hand",
        "description": "A brief glimpse of attendees and a MamaMeds bag.",
        "duration": "0:04",
        "src": "https://res.cloudinary.com/bmcmy4kk/video/upload/c_limit,w_480,h_854,q_auto:good,vc_h264/v1791170822/IMG_4592.mp4",
        "originalSrc": "https://res.cloudinary.com/bmcmy4kk/video/upload/v1791170822/IMG_4592.mp4",
        "poster": "https://res.cloudinary.com/bmcmy4kk/video/upload/c_limit,w_480,q_auto,f_webp,so_0.5/v1791170822/IMG_4592.webp"
    }
],
  testimonial: {
    "id": "tobi-story",
    "title": "Tobi’s story",
    "description": "Tobi shares her experience in her own words.",
    "duration": "0:42",
    "src": "https://res.cloudinary.com/bmcmy4kk/video/upload/c_limit,w_480,h_854,q_auto:good,vc_h264/v1791170846/IMG_4599.mp4",
    "originalSrc": "https://res.cloudinary.com/bmcmy4kk/video/upload/v1791170846/IMG_4599.mp4",
    "poster": "https://res.cloudinary.com/bmcmy4kk/video/upload/c_limit,w_480,q_auto,f_webp,so_1/v1791170846/IMG_4599.webp"
},
  volunteerFormUrl: 'https://forms.gle/mC6JL1Rn1bkPRVxu7',
};
