/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? '/depo-test' : '',
  assetPrefix: isProd ? '/depo-test/' : '',
};

export default nextConfig;
