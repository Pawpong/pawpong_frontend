'use client';

import Link from 'next/link';
import Breeder from '@/components/breeder-list/breeder';
import BreederContent from '@/components/breeder-list/breeder-content';
import BreederDescription from '@/components/breeder-list/breader-description';
import BreederHeader from '@/components/breeder-list/breeder-header';
import BreederImage from '@/components/breeder-list/breeder-image';
import BreederLocation from '@/components/breeder-list/breeder-location';
import BreederName from '@/components/breeder-list/breeder-name';
import BreederPrice from '@/components/breeder-list/breeder-price';
import BreederProfile from '@/components/breeder-list/breeder-profile';
import BreederTags from '@/components/breeder-list/breeder-tags';
import BreederAvatar from '@/components/breeder-list/breeder-avatar';
import BreederLikeButton from '@/components/breeder-list/breader-like-button';
import AdoptionStatusBadge from '@/components/adoption-status-badge';
import GrayDot from '@/assets/icons/gray-dot.svg';
import BreederList from '@/components/breeder-list/breeder-list';
import Container from '@/components/ui/container';
import EmptySavedList from './empty-saved-list';
import { useFavorites } from '../_hooks/use-favorites';

export default function SavedList() {
  const { data, isLoading, error } = useFavorites(1, 20);

  if (isLoading) {
    return (
      <Container>
        <div className="flex-1 @container">
          <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">찜한 브리더</div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-grayscale-500">즐겨찾기 목록을 불러오는 중...</div>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex-1 @container">
          <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">찜한 브리더</div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-500">즐겨찾기 목록을 불러오는 데 실패했습니다.</div>
          </div>
        </div>
      </Container>
    );
  }

  const savedBreeders = data?.items || [];

  return (
    <Container>
      <div className="flex-1 @container">
        <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">찜한 브리더</div>
        {savedBreeders.length === 0 ? (
          <EmptySavedList />
        ) : (
          <BreederList>
            {savedBreeders.map((breeder: any, index: number) => {
              const breeds = (breeder.specializationTypes || breeder.specialization || []).filter(Boolean);

              return (
                <Link key={breeder.breederId || index} href={`/explore/breeder/${breeder.breederId}`} className="block">
                  <Breeder>
                    <BreederProfile>
                      <BreederHeader>
                        <BreederAvatar src={breeder.profileImage} />
                        <div className="flex items-center gap-2">
                          <BreederName>{breeder.breederName}</BreederName>
                        </div>
                      </BreederHeader>
                      <BreederContent>
                        <BreederDescription>
                          <BreederLocation>{breeder.location}</BreederLocation>
                          <GrayDot className="block sm:hidden lg:block align-middle" />
                          <BreederPrice>
                            {!breeder.priceRange || (!breeder.priceRange.min && !breeder.priceRange.max)
                              ? '가격 미설정'
                              : breeder.priceRange.display === 'consultation'
                                ? '상담 후 결정'
                                : `${breeder.priceRange.min.toLocaleString()}원 ~ ${breeder.priceRange.max.toLocaleString()}원`}
                          </BreederPrice>
                        </BreederDescription>
                        <BreederTags>
                          <div className="flex flex-wrap gap-2">
                            {breeds.map((breed: string) => (
                              <div
                                key={breed}
                                className="bg-tertiary-500 py-1.5 px-2.5 rounded-[--spacing(1)] text-medium text-body-xs text-primary-500"
                              >
                                {breed}
                              </div>
                            ))}
                          </div>
                        </BreederTags>
                      </BreederContent>
                    </BreederProfile>
                    <div className="relative">
                      <BreederImage src={breeder.representativePhotos?.[0]} />
                      <div className="absolute top-0 right-0 p-3">
                        <BreederLikeButton
                          breederId={breeder.breederId}
                          initialIsFavorited={true}
                          hasImage={!!breeder.representativePhotos?.[0]}
                        />
                      </div>
                      {breeder.availablePets > 0 && (
                        <div className="absolute bottom-0 right-0 p-3">
                          <AdoptionStatusBadge status="available" />
                        </div>
                      )}
                    </div>
                  </Breeder>
                </Link>
              );
            })}
          </BreederList>
        )}
      </div>
    </Container>
  );
}
