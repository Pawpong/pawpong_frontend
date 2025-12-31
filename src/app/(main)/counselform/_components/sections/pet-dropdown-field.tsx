'use client';

import { Controller, useFormContext } from 'react-hook-form';

import Arrow from '@/assets/icons/arrow';
import { CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { CounselFormData } from '../../_types/counsel';

type Pet = {
  petId: string;
  name: string;
  breed: string;
  gender: 'male' | 'female';
};

export default function PetDropdownField({ availablePets }: { availablePets: Pet[] }) {
  const { control } = useFormContext<CounselFormData>();

  return (
    <Controller
      name="interestedAnimal"
      control={control}
      render={({ field }) => {
        const selectedPets = field.value || [];
        const displayText =
          selectedPets.length > 0
            ? selectedPets.filter((p) => p !== '특징 직접 입력').join('/') || '특징 직접 입력'
            : '분양 중인 아이';

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="input" className="w-full py-3 group">
                <span
                  className={cn(
                    'text-body-s font-medium',
                    selectedPets.length > 0 ? 'text-primary-500' : 'text-grayscale-gray5',
                  )}
                >
                  {displayText}
                </span>
                <Arrow className="size-5 group-hover:[&_path]:fill-[#4F3B2E]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto p-1 rounded-lg">
              {availablePets.map((pet) => {
                const petName = `${pet.name} (${pet.breed}, ${pet.gender === 'male' ? '수컷' : '암컷'})`;
                const isSelected = selectedPets.includes(petName);

                return (
                  <DropdownMenuItem
                    key={pet.petId}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-md cursor-pointer text-body-s font-medium',
                      isSelected ? 'px-4 py-2 pr-2.5 text-primary-500' : 'px-4 py-2 text-grayscale-gray6',
                    )}
                    onSelect={() => {
                      const next = isSelected
                        ? selectedPets.filter((p) => p !== petName)
                        : [...selectedPets.filter((p) => p !== '특징 직접 입력'), petName];
                      field.onChange(next);
                    }}
                  >
                    <span className="flex-1">{petName}</span>
                    {isSelected && <CheckIcon className="size-4 shrink-0 text-primary-500" />}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuItem
                className={cn(
                  'flex items-center justify-between gap-3 pt-2 rounded cursor-pointer text-body-s font-medium',
                  selectedPets.includes('특징 직접 입력')
                    ? 'px-4 py-2 pr-2.5 text-primary-500'
                    : 'px-4 py-2 text-grayscale-gray6',
                )}
                onSelect={() => field.onChange(selectedPets.includes('특징 직접 입력') ? [] : ['특징 직접 입력'])}
              >
                <span className="flex-1">특징 직접 입력</span>
                {selectedPets.includes('특징 직접 입력') && <CheckIcon className="size-4 shrink-0 text-primary-500" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }}
    />
  );
}
