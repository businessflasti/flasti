/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://flasti.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/admin/', '/payment-confirmation-9d4e7b2a8f1c6e3b/'],
      },
    ],
  },
  exclude: ['/dashboard/*', '/api/*', '/admin/*', '/payment-confirmation-9d4e7b2a8f1c6e3b/*'],
  priority: 0.7,
  changefreq: 'weekly',
  transform: async (config, path) => {
    // Prioridades personalizadas por página
    let priority = 0.7;
    let changefreq = 'weekly';
    
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path === '/register' || path === '/login') {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path === '/nosotros' || path === '/contacto') {
      priority = 0.8;
      changefreq = 'monthly';
    } else if (path.includes('/terminos') || path.includes('/privacidad') || path.includes('/informacion-legal')) {
      priority = 0.4;
      changefreq = 'yearly';
    } else if (path.includes('/reset-password')) {
      priority = 0.3;
      changefreq = 'yearly';
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
}
