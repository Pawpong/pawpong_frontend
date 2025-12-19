'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BreederProfileSection from '@/components/breeder-profile/breeder-profile-section';
import BreederProfileSectionHeader from '@/components/breeder-profile/breeder-profile-section-header';
import BreederProfileSectionMore from '@/components/breeder-profile/breeder-profile-section-more';
import BreederProfileSectionTitle from '@/components/breeder-profile/breeder-profile-section-title';
import AnimalProfile from './animal-profile';
import PetDetailDialog, { type PetDetailData } from './pet-detail-dialog';
import { useParentPets } from '../_hooks/use-breeder-detail';

export default function BreedingAnimals({
  data,
  breederId,
  breederDescription,
}: {
  data: {
    id: string;
    avatarUrl: string;
    name: string;
    sex: 'male' | 'female';
    birth: string;
    price: string | null;
    breed: string;
    status?: 'available' | 'reserved' | 'completed';
    description?: string;
  }[];
  breederId: string;
  breederDescription?: string;
}) {
  const router = useRouter();
  const [selectedPet, setSelectedPet] = useState<PetDetailData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: parentPetsData } = useParentPets(breederId, 1, 100);

  const handleMoreClick = () => {
    router.push(`/explore/breeder/${breederId}/pets`);
  };

  const handlePetClick = (pet: (typeof data)[0]) => {
    // 부모 정보 찾기 (pet.id와 매칭되는 부모 찾기)
    // 실제로는 API에서 pet의 parentInfo를 가져와야 하지만, 여기서는 간단히 처리
    const parents =
      parentPetsData?.items?.map(
        (parent: {
          petId: string;
          photoUrl?: string;
          name: string;
          gender: 'male' | 'female';
          birthDate?: string;
          breed: string;
        }) => ({
          id: parent.petId,
          avatarUrl: parent.photoUrl || '/animal-sample.png',
          name: parent.name,
          sex: parent.gender,
          birth: formatBirthDate(parent.birthDate),
          breed: parent.breed,
        }),
      ) || [];

    const petDetail: PetDetailData = {
      id: pet.id,
      avatarUrl: pet.avatarUrl,
      name: pet.name,
      sex: pet.sex,
      birth: pet.birth,
      price: pet.price,
      breed: pet.breed,
      status: pet.status || 'available',
      description: pet.description,
      parents: parents,
    };

    setSelectedPet(petDetail);
    setIsDialogOpen(true);
  };

  const formatBirthDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}년 ${month}월 ${day}일 생`;
    } catch {
      return '';
    }
  };

  return (
    <BreederProfileSection>
      <BreederProfileSectionHeader>
        <BreederProfileSectionTitle>분양 중인 아이들</BreederProfileSectionTitle>
        {data.length > 3 ? (
          <div onClick={handleMoreClick}>
            <BreederProfileSectionMore />
          </div>
        ) : null}
      </BreederProfileSectionHeader>
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
              price: string | null;
              breed: string;
              status?: 'available' | 'reserved' | 'completed';
              description?: string;
            }) => (
              <AnimalProfile key={e.id} data={e} onClick={() => handlePetClick(e)} />
            ),
          )}
      </div>
      <PetDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        pet={selectedPet}
        type="pet"
        breederId={breederId}
        breederDescription={breederDescription}
      />
    </BreederProfileSection>
  );
}
