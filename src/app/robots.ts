import { MetadataRoute } from 'next';

// As long as your robots.txt is accessible at the standard path (https://yourdomain.com/robots.txt)
// Googlebot and other crawlers will automatically find it whenever they crawl your site.
// The only things you might manually submit to GSC are sitemaps (e.g., sitemap.xml), not robots.txt.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/sign-in', '/sign-up', '/dashboard/', '/buyer-dashboard/', '/contractor-dashboard/', '/api/', '/complete-user-type/'],
    },
    sitemap: 'https://bidquotes.ca/sitemap.xml',
  };
}
