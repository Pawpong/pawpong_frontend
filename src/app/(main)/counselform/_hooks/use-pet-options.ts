'use client';

import { useEffect, useMemo } from 'react';

import { useBreederPets } from '../_hooks/use-breeder-pets';
import type { CounselFormData } from '../_types/counsel';
import type { UseFormReturn } from 'react-hook-form';

export function usePetOptions({
  breederId,
  petId,
  form,
}: {
  breederId: string;
  petId?: string;
  form: UseFormReturn<CounselFormData>;
}) {
  const { data: breederPetsData } = useBreederPets(breederId);
  const availablePets = useMemo(
    () => breederPetsData?.items?.filter((pet) => pet.status === 'available') || [],
    [breederPetsData?.items],
  );

  useEffect(() => {
    if (petId && availablePets.length > 0 && form.getValues('interestedAnimal').length === 0) {
      const selectedPet = availablePets.find((pet) => pet.petId === petId);
      if (selectedPet) {
        form.setValue('interestedAnimal', [selectedPet.name]);
      }
    }
  }, [petId, availablePets, form]);

  return { availablePets };
}

