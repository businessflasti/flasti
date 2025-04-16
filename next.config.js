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
  // Configuración para ignorar errores durante la compilación
  onError: (error) => {
    console.error('Error durante la compilación:', error);
    // Continuar a pesar de los errores
    return;
  },
  // Configuración para ignorar errores de tipo
  swcMinify: true,
};

module.exports = nextConfig;
