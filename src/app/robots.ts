import { MetadataRoute } from 'next';

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
