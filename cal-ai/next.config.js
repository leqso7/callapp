/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/callapp',
  assetPrefix: '/callapp/',
};

module.exports = nextConfig; 