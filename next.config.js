/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configurar para usar Server-Side Rendering con salida standalone
  output: 'standalone',
  distDir: '.next',
  // Desactivar la generación estática de páginas dinámicas
  staticPageGenerationTimeout: 1000,
  // Mover skipTrailingSlashRedirect a la raíz de la configuración
  skipTrailingSlashRedirect: true,
  // Configuración de imágenes remotas
  images: {
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
      {
        protocol: 'https',
        hostname: 'cdndn.s3.us-west-1.amazonaws.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.trending.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.trending.com',
        pathname: '/**',
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
  },
  webpack: (config, { isServer }) => {
    // Solo configurar fallbacks si es necesario
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false
      };
    }
    return config;
  }
};

module.exports = nextConfig;
