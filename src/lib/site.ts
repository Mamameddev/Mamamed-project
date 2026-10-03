import { normalizeSiteUrl } from './site-url';

export const site = {
  name: 'MamaMeds',
  organizationName: 'MamaMeds Maternal Health Foundation',
  title: 'MamaMeds | Improving Maternal Health in Nigeria',
  description: 'MamaMeds works to improve maternal health outcomes in Nigeria through essential antenatal medications, maternal health education, and community-based support.',
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, process.env.NODE_ENV === 'production'),
  logo: '/images/mamameds-logo.webp',
  socialImage: '/images/mamameds-social.jpg',
} as const;
