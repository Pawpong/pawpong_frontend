import type { Metadata } from 'next';
import BreederDetailClient from './_components/breeder-detail-client';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// 서버에서 브리더 데이터 가져오기 (SEO용)
async function getBreederData(breederId: string) {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.pawpong.kr';
    const response = await fetch(`${apiBaseUrl}/api/breeder/${breederId}`, {
      next: { revalidate: 60 }, // 60초마다 재검증
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('[SEO] Failed to fetch breeder data:', error);
    return null;
  }
}

// 동적 SEO 메타데이터 생성
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: breederId } = await params;
  const breederData = await getBreederData(breederId);

  // 기본 메타데이터 (브리더 데이터가 없을 경우)
  if (!breederData) {
    return {
      title: '브리더 프로필 | 포퐁',
      description: '포퐁에서 검증된 브리더의 프로필을 확인하세요.',
    };
  }

  // 브리더 정보 추출
  const breederName = breederData.breederName || '브리더';
  const profileInfo = breederData.profileInfo;
  const location = breederData.location ||
    (profileInfo?.locationInfo
      ? `${profileInfo.locationInfo.cityName} ${profileInfo.locationInfo.districtName}`
      : '');
  const description = breederData.description || profileInfo?.profileDescription || '';
  const specialization = breederData.specialization || breederData.specializationTypes || profileInfo?.specializationAreas || [];
  const breeds = breederData.breeds || specialization;
  const profileImage = breederData.profileImage || breederData.profileImageFileName;
  const representativePhotos = breederData.representativePhotos || profileInfo?.profilePhotos || [];

  // SEO 설명 생성
  const breedsText = breeds.length > 0 ? breeds.slice(0, 3).join(', ') : '';
  const seoDescription = description
    ? `${breederName} 브리더 - ${description.slice(0, 100)}${description.length > 100 ? '...' : ''}`
    : `${breederName} 브리더${location ? ` | ${location}` : ''}${breedsText ? ` | ${breedsText} 전문` : ''} - 포퐁에서 검증된 브리더의 분양 정보를 확인하세요.`;

  // OG 이미지 선택 (대표 사진 > 프로필 이미지 > 기본 이미지)
  const ogImage = representativePhotos[0] || profileImage || 'https://pawpong.kr/og-image.png';

  return {
    title: `${breederName} | 포퐁`,
    description: seoDescription,
    openGraph: {
      title: `${breederName} 브리더 프로필 | 포퐁`,
      description: seoDescription,
      url: `https://pawpong.kr/explore/breeder/${breederId}`,
      siteName: '포퐁 - 반려동물 입양 플랫폼',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${breederName} 브리더 프로필`,
        },
      ],
      locale: 'ko_KR',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${breederName} 브리더 프로필 | 포퐁`,
      description: seoDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://pawpong.kr/explore/breeder/${breederId}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id: breederId } = await params;

  return <BreederDetailClient breederId={breederId} />;
}
