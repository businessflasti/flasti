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
