/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ext.same-assets.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Ensure Next.js preserves transpiled module structure
  transpilePackages: [],
  // Ensure server middleware runs for every file on request
  experimental: {
    scrollRestoration: true,
  },
  // Production domain configuration
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `https://flasti.com/:path*`,
        basePath: false,
      },
    ];
  },
  // Enable CORS for API routes
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://flasti.com" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
}

export default nextConfig;
