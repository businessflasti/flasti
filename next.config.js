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
  // Ignorar errores específicos durante la exportación estática
  experimental: {
    // Esto permite que la compilación continúe incluso con errores
    skipTrailingSlashRedirect: true,
    // Esto permite que useSearchParams funcione sin Suspense
    missingSuspenseWithCSRBailout: true
  }
};

module.exports = nextConfig;
