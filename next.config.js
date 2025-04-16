/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  distDir: '.next',
  staticPageGenerationTimeout: 1000,
  skipTrailingSlashRedirect: true
};

module.exports = nextConfig;
