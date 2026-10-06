import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { projects } from '../../data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://asri-mela.my.id';

  let projectEntries: MetadataRoute.Sitemap = [];

  try {
    const { data: dbProjects } = await supabase
      .from('proyek')
      .select('id, slug, updated_at, created_at');

    if (dbProjects && dbProjects.length > 0) {
      projectEntries = dbProjects.flatMap((item) => {
        const lastMod = item.updated_at
          ? new Date(item.updated_at)
          : item.created_at
          ? new Date(item.created_at)
          : new Date();

        const entries: MetadataRoute.Sitemap = [
          {
            url: `${BASE_URL}/project/${item.slug || item.id}`,
            lastModified: lastMod,
            changeFrequency: 'weekly',
            priority: 0.8,
          },
        ];

        // Jika ada id terpisah dari slug, tambahkan juga rute /proyek/[id]
        if (item.id) {
          entries.push({
            url: `${BASE_URL}/proyek/${item.id}`,
            lastModified: lastMod,
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }

        return entries;
      });
    }
  } catch (error) {
    console.warn('Sitemap Supabase fetch notice:', error);
  }

  // Jika Supabase kosong atau offline, gunakan data statis lokal
  if (projectEntries.length === 0) {
    projectEntries = projects.flatMap((item) => [
      {
        url: `${BASE_URL}/project/${item.slug || item.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/proyek/${item.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
    ]);
  }

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/project`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/proyek`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...projectEntries,
  ];
}
