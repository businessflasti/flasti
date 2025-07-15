/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  distDir: '.next',
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  images: {
    domains: ['flagcdn.com'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ewfvfvkhqftbvldvjnrk.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Ignorar errores específicos durante la exportación estática
  experimental: {
    // Esto permite que la compilación continúe incluso con errores
    // Mejorar la hidratación para evitar errores
    optimizeServerReact: true,
    // Mejorar la estabilidad de la hidratación
    ppr: false
  }
};

module.exports = nextConfig;
