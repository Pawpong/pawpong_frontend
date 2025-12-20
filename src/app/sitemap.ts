import { MetadataRoute } from 'next';
import { exploreBreeders } from '@/lib/breeder';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pawpong.kr';

  // 정적 페이지들
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/explore/dog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore/cat`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/introduction`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // 동적 브리더 페이지들
  const breederRoutes: MetadataRoute.Sitemap = [];

  try {
    // 모든 브리더를 가져오기 위해 페이지네이션 처리
    let currentPage = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await exploreBreeders({
        page: currentPage,
        take: 100, // 한 번에 많이 가져오기
      });

      // 각 브리더의 상세 페이지 URL 추가
      response.items.forEach((breeder) => {
        breederRoutes.push({
          url: `${baseUrl}/explore/breeder/${breeder.breederId}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });

      hasNextPage = response.pagination.hasNextPage;
      currentPage = response.pagination.currentPage + 1;

      // 무한 루프 방지
      if (currentPage > 100) {
        break;
      }
    }
  } catch (error) {
    console.error('Failed to fetch breeders for sitemap:', error);
  }

  return [...staticRoutes, ...breederRoutes];
}
