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
import { Button } from '@/components/ui/button';

import ExploreBreederAd from './explore-breeder-ad';
import LoadMoreButton from '@/components/ui/load-more-button';
import { useBreeders } from '../_hooks/use-breeders';
import { useFilterStore } from '@/stores/filter-store';
import { mapFiltersToParams } from '@/api/filter-mapper';
import { useSegment } from '@/hooks/use-segment';
import type { Breeder as BreederType, SearchBreederParams } from '@/api/breeder';
import { useAuthStore } from '@/stores/auth-store';
import { Lock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { LoadingState } from '@/components/loading-state';

export default function SiteBreederList() {
  const AD_INSERT_INDEX = 20;
  const AD_PLACEHOLDER = { __type: 'ad' as const };

  // 로그인 상태 확인
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  // URL 경로에서 petType 자동 감지 (useSegment 사용)
  const petType = (useSegment(1) as 'cat' | 'dog') || 'dog';

  // URL 쿼리 파라미터에서 정렬 옵션 가져오기
  const searchParams = useSearchParams();
  const sortBy = (searchParams.get('sort') || 'latest') as SearchBreederParams['sortBy'];

  // 필터 스토어에서 활성화된 필터 가져오기
  const activeFilters = useFilterStore((state) => state.activeFilters);

  // 활성화된 필터를 백엔드 API 파라미터로 변환
  const filterParams = mapFiltersToParams(activeFilters, petType);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useBreeders({
    petType, // URL 경로에 따라 자동으로 설정
    sortBy, // 정렬 파라미터 추가
    ...filterParams, // 필터 파라미터 추가
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">브리더 목록을 불러오는 데 실패했습니다.</div>
      </div>
    );
  }

  const breeders = (data?.pages.flatMap((page) => page.items) || []) as BreederType[];
  const shouldInsertAd = false; // breeders.length >= AD_INSERT_INDEX;
  const breedersWithAd = shouldInsertAd
    ? [...breeders.slice(0, AD_INSERT_INDEX), AD_PLACEHOLDER, ...breeders.slice(AD_INSERT_INDEX)]
    : breeders;

  if (breeders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-grayscale-500">브리더가 없습니다.</div>
      </div>
    );
  }

  return (
    <BreederList>
      {breedersWithAd.map((item, index) => {
        const isAd = '__type' in item && item.__type === 'ad';
        const isLastBeforeMore = hasNextPage && index === breedersWithAd.length - 1;

        if (isAd) {
          return (
            <div key="explore-breeder-ad">
              <ExploreBreederAd />
              {index < breedersWithAd.length - 1 && !isLastBeforeMore && <Separator className="my-4" />}
            </div>
          );
        }

        const breeder = item as BreederType;
        return (
          <div key={`${breeder.breederId}-${index}`}>
            <Link href={`/explore/breeder/${breeder.breederId}`} className="block">
              <Breeder>
                <BreederProfile>
                  <BreederHeader>
                    <BreederAvatar src={breeder.profileImage} animal={(breeder.petType as 'cat' | 'dog') || petType} />
                    <div className="flex items-center gap-2">
                      <BreederName>{breeder.breederName}</BreederName>
                    </div>
                  </BreederHeader>
                  <BreederContent>
                    <BreederDescription>
                      <BreederLocation>{breeder.location}</BreederLocation>
          
                      <BreederPrice>
                        {isLoggedIn ? (
                          !breeder.priceRange ? (
                            '가격 미설정'
                          ) : breeder.priceRange.display === 'not_set' ? (
                            '가격 미설정'
                          ) : breeder.priceRange.display === 'consultation' ? (
                            '상담 후 공개'
                          ) : breeder.priceRange.display === 'range' ? (
                            `${breeder.priceRange.min?.toLocaleString()}원 ~ ${breeder.priceRange.max?.toLocaleString()}원`
                          ) : (
                            '가격 미설정'
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            로그인 후 비용 확인 가능
                          </span>
                        )}
                      </BreederPrice>
                    </BreederDescription>
                    <BreederTags>
                      {(breeder.specializationTypes || [breeder.mainBreed])
                        .filter(Boolean)
                        .map((area: string, idx: number) => (
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
                    <BreederLikeButton
                      breederId={breeder.breederId}
                      initialIsFavorited={breeder.isFavorited}
                      hasImage={!!breeder.representativePhotos?.[0]}
                    />
                  </div>
                  {breeder.isAdoptionAvailable && (
                    <div className="absolute bottom-0 right-0 p-3">
                      <AdoptionStatusBadge status="available" />
                    </div>
                  )}
                </div>
              </Breeder>
            </Link>
            {index < breedersWithAd.length - 1 && !isLastBeforeMore && <Separator className="my-4" />}
          </div>
        );
      })}
      {hasNextPage && (
        <div className="col-span-full mt-8">
          <LoadMoreButton onClick={() => fetchNextPage()} isLoading={isFetchingNextPage} />
        </div>
      )}
    </BreederList>
  );
}
