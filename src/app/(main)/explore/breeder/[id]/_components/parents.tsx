'use client';

import { useState } from 'react';
import { dynamicClient } from '@/utils/dynamic-client';
import { useRouter } from 'next/navigation';
import BreederProfileSection from '@/components/breeder-profile/breeder-profile-section';
import BreederProfileSectionHeader from '@/components/breeder-profile/breeder-profile-section-header';
import BreederProfileSectionMore from '@/components/breeder-profile/breeder-profile-section-more';
import BreederProfileSectionTitle from '@/components/breeder-profile/breeder-profile-section-title';
import AnimalProfile from './animal-profile';
import type { PetDetailData } from './pet-detail-dialog';
import EmptyPetState from './empty-pet-state';

const PetDetailDialog = dynamicClient(() => import('./pet-detail-dialog'));

export default function Parents({
  data,
  breederId,
  breederDescription,
  isOwnProfile = false,
}: {
  data: {
    id: string;
    avatarUrl: string;
    name: string;
    sex: 'male' | 'female';
    birth: string;
    price: string;
    breed: string;
    description?: string;
    photos?: string[];
  }[];
  breederId: string;
  breederDescription?: string;
  isOwnProfile?: boolean;
}) {
  const router = useRouter();
  const [selectedPet, setSelectedPet] = useState<PetDetailData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleMoreClick = () => {
    router.push(`/explore/breeder/${breederId}/parents`);
  };

  const handlePetClick = (pet: (typeof data)[0]) => {
    const petDetail: PetDetailData = {
      id: pet.id,
      avatarUrl: pet.avatarUrl,
      name: pet.name,
      sex: pet.sex,
      birth: pet.birth,
      breed: pet.breed,
      description: pet.description,
      photos: pet.photos || [],
    };

    setSelectedPet(petDetail);
    setIsDialogOpen(true);
  };

  return (
    <BreederProfileSection>
      <BreederProfileSectionHeader>
        <BreederProfileSectionTitle>엄마 · 아빠</BreederProfileSectionTitle>
        {data.length > 3 && (
          <div onClick={handleMoreClick}>
            <BreederProfileSectionMore />
          </div>
        )}
      </BreederProfileSectionHeader>
      {data.length === 0 ? (
        <EmptyPetState />
      ) : (
        <div className="space-y-7 md:grid md:grid-cols-3 md:gap-gutter">
          {data
            .slice(0, 3)
            .map(
              (e: {
                id: string;
                avatarUrl: string;
                name: string;
                sex: 'male' | 'female';
                birth: string;
                price: string;
                breed: string;
                description?: string;
              }) => (
                <AnimalProfile key={e.id} data={e} onClick={() => handlePetClick(e)} />
              ),
            )}
        </div>
      )}
      <PetDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        pet={selectedPet}
        type="parent"
        breederId={breederId}
        breederDescription={breederDescription}
        isOwnProfile={isOwnProfile}
      />
    </BreederProfileSection>
  );
}
