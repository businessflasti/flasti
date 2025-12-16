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
  exclude: [
    '/dashboard',
    '/dashboard/**',
    '/api/**',
    '/admin/**',
    '/payment-confirmation-9d4e7b2a8f1c6e3b',
    '/payment-confirmation-9d4e7b2a8f1c6e3b/**',
    '/reset-password',
    '/reset-password/**',
    '/informacion-legal',
    '/terminos',
  ],
  priority: 0.7,
  changefreq: 'weekly',
  transform: async (config, path) => {
    // Excluir páginas que no deben estar en el sitemap
    const excludePaths = [
      '/dashboard',
      '/payment-confirmation-9d4e7b2a8f1c6e3b',
      '/reset-password',
      '/informacion-legal',
      '/terminos',
    ];
    
    if (excludePaths.some(p => path.startsWith(p))) {
      return null;
    }
    
    let priority = 0.7;
    let changefreq = 'weekly';
    
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path === '/register') {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path === '/login') {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path === '/nosotros' || path === '/contacto') {
      priority = 0.8;
      changefreq = 'monthly';
    } else if (path === '/privacidad') {
      priority = 0.5;
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
