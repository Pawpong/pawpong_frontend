'use client';

import AnimalProfile from '@/app/(main)/explore/breeder/[id]/_components/animal-profile';
import Link from 'next/link';
import LoadMoreButton from '@/components/ui/load-more-button';

import BreederProfileSectionHeader from '@/components/breeder-profile/breeder-profile-section-header';
import BreederProfileSectionTitle from '@/components/breeder-profile/breeder-profile-section-title';
import { useHomeAnimals } from '../_hooks/use-home-animals';

export default function HomeBreederGrid() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useHomeAnimals();

  const animals = data?.pages.flatMap((page) => page.data) ?? [];

  if (animals.length === 0) {
    return null;
  }

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
        <LoadMoreButton
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
          wrapperClassName="pb-20 lg:pb-24"
        />
      )}
    </div>
  );
}
