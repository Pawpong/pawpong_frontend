'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AdoptionStatusBadge from '@/components/adoption-status-badge';
import BreederDescription from '@/components/breeder-list/breader-description';
import BreederLikeButton from '@/components/breeder-list/breader-like-button';
import Breeder from '@/components/breeder-list/breeder';
import BreederAvatar from '@/components/breeder-list/breeder-avatar';
import BreederContent from '@/components/breeder-list/breeder-content';
import BreederHeader from '@/components/breeder-list/breeder-header';
import BreederImage from '@/components/breeder-list/breeder-image';
import BreederList from '@/components/breeder-list/breeder-list';
import BreederLocation from '@/components/breeder-list/breeder-location';
import BreederName from '@/components/breeder-list/breeder-name';
import BreederPrice from '@/components/breeder-list/breeder-price';
import BreederProfile from '@/components/breeder-list/breeder-profile';
import BreederTags from '@/components/breeder-list/breeder-tags';
import LevelBadge from '@/components/level-badge';
import { Button } from '@/components/ui/button';
import GrayDot from '@/assets/icons/gray-dot.svg';
import { useBreeders } from '../_hooks/use-breeders';
import { useFilterStore } from '@/stores/filter-store';
import { mapFiltersToParams } from '@/lib/filter-mapper';
import { useSegment } from '@/hooks/use-segment';
import type { SearchBreederParams } from '@/lib/breeder';
import { useAuthStore } from '@/stores/auth-store';
import { Lock } from 'lucide-react';

export default function SiteBreederList() {
  // 로그인 상태 확인
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  // URL 경로에서 petType 자동 감지 (useSegment 사용)
  const petType = (useSegment(1) as 'cat' | 'dog') || 'cat';

  // URL 쿼리 파라미터에서 정렬 옵션 가져오기
  const searchParams = useSearchParams();
  const sortBy = (searchParams.get('sort') || 'latest') as SearchBreederParams['sortBy'];

  // 필터 스토어에서 활성화된 필터 가져오기
  const activeFilters = useFilterStore((state) => state.activeFilters);

  // 활성화된 필터를 백엔드 API 파라미터로 변환
  const filterParams = mapFiltersToParams(activeFilters, petType);

  const { data, isLoading, error } = useBreeders({
    petType, // URL 경로에 따라 자동으로 설정
    page: 1,
    take: 20,
    sortBy, // 정렬 파라미터 추가
    ...filterParams, // 필터 파라미터 추가
  });

  console.log(data?.items);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-grayscale-500">브리더 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">브리더 목록을 불러오는 데 실패했습니다.</div>
      </div>
    );
  }

  const breeders = data?.items || [];

  if (breeders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-grayscale-500">브리더가 없습니다.</div>
      </div>
    );
  }

  return (
    <BreederList>
      {breeders.map((breeder) => (
        <Link key={breeder.breederId} href={`/explore/breeder/${breeder.breederId}`} className="block">
          <Breeder>
            <BreederProfile>
              <BreederHeader>
                <BreederAvatar src={breeder.profileImage} />
                <div className="flex items-center gap-2">
                  <BreederName>{breeder.breederName}</BreederName>
                  <LevelBadge level={breeder.breederLevel as 'elite' | 'new'} />
                </div>
              </BreederHeader>
              <BreederContent>
                <BreederDescription>
                  <BreederLocation>{breeder.location}</BreederLocation>
                  <GrayDot className="block sm:hidden lg:block align-middle" />
                  <BreederPrice>
                    {isLoggedIn ? (
                      breeder.priceRange?.min || breeder.priceRange?.max
                        ? `${breeder.priceRange.min?.toLocaleString()} - ${breeder.priceRange.max?.toLocaleString()}원`
                        : '상담 후 비용 확인 가능'
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        로그인 후 비용 확인 가능
                      </span>
                    )}
                  </BreederPrice>
                </BreederDescription>
                <BreederTags>
                  {(breeder.specializationTypes || [breeder.mainBreed]).filter(Boolean).map((area: string, idx: number) => (
                    <Button variant="secondary" key={idx}>
                      {area}
                    </Button>
                  ))}
                </BreederTags>
              </BreederContent>
            </BreederProfile>
            <div className="relative">
              <BreederImage src={breeder.representativePhotos[0]} />
              <div className="absolute top-0 right-0 p-3">
                <BreederLikeButton breederId={breeder.breederId} initialIsFavorited={breeder.isFavorited} />
              </div>
              {breeder.isAdoptionAvailable && (
                <div className="absolute bottom-0 right-0 p-3">
                  <AdoptionStatusBadge status="available" />
                </div>
              )}
            </div>
          </Breeder>
        </Link>
      ))}
    </BreederList>
  );
}
