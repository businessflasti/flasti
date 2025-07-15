/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://flasti.com',
  generateRobotsTxt: true,
  exclude: [
    '/api/*',
    '/dashboard/*',
    '/admin/*',
    '/checkout/*',
    '/legal-info',
    '/_not-found'
  ],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api', '/dashboard', '/admin', '/checkout']
      }
    ]
  },
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7
};
