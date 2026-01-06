'use client';

import AnimalProfile from '@/app/(main)/explore/breeder/[id]/_components/animal-profile';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DownArrow from '@/assets/icons/long-down-arrow.svg';

import BreederProfileSectionHeader from '@/components/breeder-profile/breeder-profile-section-header';
import BreederProfileSectionTitle from '@/components/breeder-profile/breeder-profile-section-title';
import BreederProfileSectionMore from '@/components/breeder-profile/breeder-profile-section-more';
import { useHomeAnimals } from '../_hooks/use-home-animals';

export default function HomeBreederGrid() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useHomeAnimals();

  const animals = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="flex flex-col gap-20 mb-20">
      <div className="flex flex-col gap-7">
        <BreederProfileSectionHeader>
          <BreederProfileSectionTitle>분양 중인 아이들</BreederProfileSectionTitle>
        </BreederProfileSectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {animals.map((animal) => (
            <Link key={animal.id} href={`/explore/breeder/${animal.breederId}`} className="block">
              <AnimalProfile data={animal} isAd={animal.isAd} />
            </Link>
          ))}
        </div>
      </div>
      {hasNextPage && (
        <div className="flex justify-center pb-20 lg:pb-24">
          <Button
            variant="ghost"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-[var(--color-grayscale-gray1)] hover:bg-[var(--color-grayscale-gray2)] h-12 py-2.5 gap-1 rounded-full has-[>svg]:px-0 has-[>svg]:pl-5 has-[>svg]:pr-3 disabled:opacity-50"
          >
            <span className="text-body-s font-medium text-grayscale-gray6">
              {isFetchingNextPage ? '로딩 중...' : '더보기'}
            </span>
            <DownArrow />
          </Button>
        </div>
      )}
    </div>
  );
}
