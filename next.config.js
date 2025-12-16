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
  // Redirecciones para URLs antiguas (WordPress) que dan 404
  async redirects() {
    return [
      // URLs antiguas de WordPress que dan 404
      {
        source: '/tag/:slug',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.php/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/usuario/:path*',
        destination: '/contacto',
        permanent: true,
      },
      // URL duplicada de WordPress
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'page_id',
          },
        ],
        destination: '/',
        permanent: true,
      },
      // Páginas antiguas que ya no existen
      {
        source: '/en',
        destination: '/',
        permanent: true,
      },
      {
        source: '/es',
        destination: '/',
        permanent: true,
      },
      {
        source: '/chat',
        destination: '/',
        permanent: true,
      },
      {
        source: '/tienda',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/',
        permanent: true,
      },
      // Páginas antiguas con noindex que ya no existen
      {
        source: '/register-simple',
        destination: '/register',
        permanent: true,
      },
      {
        source: '/dashboard-new',
        destination: '/',
        permanent: true,
      },
      {
        source: '/aplicaciones',
        destination: '/',
        permanent: true,
      },
      // Archivos y páginas antiguas rastreadas sin indexar
      {
        source: '/ai-training-data.json',
        destination: '/',
        permanent: true,
      },
      {
        source: '/about-flasti.txt',
        destination: '/nosotros',
        permanent: true,
      },
      {
        source: '/register-alt',
        destination: '/register',
        permanent: true,
      },
      {
        source: '/legal',
        destination: '/informacion-legal',
        permanent: true,
      },
      // URLs antiguas bloqueadas por robots.txt que no existen
      {
        source: '/secure-registration-portal-7f9a2b3c5d8e',
        destination: '/register',
        permanent: true,
      },
      {
        source: '/checkout',
        destination: '/',
        permanent: true,
      },
      {
        source: '/admin-access',
        destination: '/',
        permanent: true,
      },
      // Páginas indexadas que ya no existen
      {
        source: '/ayuda',
        destination: '/contacto',
        permanent: true,
      },
      {
        source: '/apps',
        destination: '/',
        permanent: true,
      },
    ];
  },
  // Headers para páginas específicas
  async headers() {
    return [];
  },
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
