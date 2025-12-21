import { MetadataRoute } from 'next';
import apiClient from '@/lib/api';

// 사이트맵 생성 시 사용할 환경 변수
const baseUrl = 'https://pawpong.kr';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지들 (인증 불필요)
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
    // 강아지와 고양이 브리더를 모두 가져오기
    const petTypes: ('dog' | 'cat')[] = ['dog', 'cat'];

    for (const petType of petTypes) {
      let currentPage = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        try {
          // 사이트맵 생성 시에는 apiClient로 API 호출 (서버 환경)
          const apiResponse = await apiClient.post(
            '/api/breeder/explore',
            {
              petType, // 강아지/고양이 구분
              page: currentPage,
              limit: 100, // 한 번에 많이 가져오기
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 30000, // 30초 타임아웃
            },
          );

          if (!apiResponse.data.success || !apiResponse.data.data) {
            console.warn(`Breeder API returned unsuccessful response for ${petType}`);
            break;
          }

          const { items, pagination } = apiResponse.data.data;

          if (!items || items.length === 0) {
            console.log(`No breeders found for ${petType} on page ${currentPage}`);
            break;
          }

          // 각 브리더의 상세 페이지 URL 추가
          items.forEach((breeder: any) => {
            if (breeder.breederId) {
              breederRoutes.push({
                url: `${baseUrl}/explore/breeder/${breeder.breederId}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
              });
            }
          });

          hasNextPage = pagination?.hasNextPage || false;
          currentPage = pagination?.currentPage ? pagination.currentPage + 1 : currentPage + 1;

          // 무한 루프 방지
          if (currentPage > 100) {
            console.warn(`Reached page limit (100) for ${petType}`);
            break;
          }
        } catch (pageError) {
          console.error(`Error fetching ${petType} breeders page ${currentPage}:`, pageError);
          break; // 해당 petType의 페이지네이션 중단
        }
      }

      console.log(`Added ${breederRoutes.length} total breeder routes (${petType} completed)`);
    }

    console.log(`✅ Successfully added ${breederRoutes.length} breeder routes to sitemap`);
  } catch (error) {
    console.error('❌ Failed to fetch breeders for sitemap:', error);
    // 에러가 발생해도 정적 페이지는 포함되도록 계속 진행
  }

  return [...staticRoutes, ...breederRoutes];
}
