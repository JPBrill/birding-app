/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // iNaturalist
      { protocol: 'https', hostname: 'inaturalist-open-data.s3.amazonaws.com' },
      { protocol: 'https', hostname: 'static.inaturalist.org' },
      { protocol: 'https', hostname: '*.inaturalist.org' },
      // Wikipedia / Wikimedia
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: '*.wikipedia.org' },
      // Unsplash (order tile backgrounds)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // GBIF (species illustrations fallback)
      { protocol: 'https', hostname: '*.gbif.org' },
      { protocol: 'https', hostname: 'api.gbif.org' },
      // Xeno-canto sonograms
      { protocol: 'https', hostname: '*.xeno-canto.org' },
      { protocol: 'https', hostname: 'xeno-canto.org' },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
};
module.exports = nextConfig;
