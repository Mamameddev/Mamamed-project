import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' }, { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/**' }],
  },
};
export default config;
