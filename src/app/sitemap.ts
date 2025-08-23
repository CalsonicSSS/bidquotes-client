import { MetadataRoute } from 'next';

// Next.js automatically converts this sitemap.ts file into sitemap.xml that Google can read.
// You just gave Google a complete roadmap of your site. Instead of randomly discovering your whole pages strucuture on its own effort.
// we will later submit this sitemap.xml to Google Search Console
// Google will now crawl all 5 pages in your sitemap within the next 24-48 hours on their side
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bidquotes.ca';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
