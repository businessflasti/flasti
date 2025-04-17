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
  // Ignorar errores específicos durante la exportación estática
  experimental: {
    // Esto permite que la compilación continúe incluso con errores
  }
};

module.exports = nextConfig;
