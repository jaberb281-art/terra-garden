import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  experimental: { globalNotFound: true, serverActions: { bodySizeLimit: '256kb' } },
  images: { formats: ['image/webp'] },
  async redirects() {
    return [{ source: '/', destination: '/en', permanent: true }];
  },
};
export default config;
