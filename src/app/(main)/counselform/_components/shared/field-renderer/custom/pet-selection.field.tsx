'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Arrow from '@/assets/icons/arrow';
import DownArrow from '@/assets/icons/down-arrow.svg';
import { cn } from '@/api/utils';
import PetDropdownField from '../../../sections/pet-dropdown-field';
import PreferredPetDetailField from '../../../sections/preferred-pet-detail-field';
import { parsePetSelectionValue } from '../utils/value-parsers';

/**
 * PetSelectionField - 분양중인 아이 선택 필드
 */
export function PetSelectionEditable({
  availablePets,
}: {
  availablePets?: Array<{ petId: string; name: string; breed: string; gender: 'male' | 'female' }>;
}) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {availablePets && <PetDropdownField availablePets={availablePets} />}
      <PreferredPetDetailField />
    </div>
  );
}

export function PetSelectionReadonly({
  value,
  readonlyVariant = 'default',
}: {
  value?: any;
  readonlyVariant?: 'default' | 'white';
}) {
  const { animalValue, details, showDetails } = parsePetSelectionValue(value);
  const bgClass = readonlyVariant === 'white' ? 'bg-white' : 'bg-[rgba(255,255,255,0.40)]';
  const isCustomInput = animalValue === '특징 직접 입력';

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <Button
        variant="input"
        disabled
        className={cn('w-full py-3 rounded-lg flex items-center justify-between', bgClass, animalValue ? 'text-primary-500' : 'text-grayscale-gray5')}
      >
        <span className="text-body-s font-medium">{animalValue || '분양 중인 아이'}</span>
        {isCustomInput ? <DownArrow className="size-4 shrink-0" /> : <Arrow className="size-5 opacity-50" />}
      </Button>
      {showDetails && (
        <Textarea
          value={details}
          readOnly
          placeholder="원하시는 아이의 특징을 자유롭게 입력해주세요"
          maxLength={800}
          showLength={details.length > 0}
          currentLength={details.length}
          wrapperClassName={`${bgClass} rounded-lg`}
        />
      )}
    </div>
  );
}

export function PetSelectionView({ value }: { value?: any }) {
  const { animalValue, details, showDetails } = parsePetSelectionValue(value);

  return (
    <div className="flex flex-col gap-2.5">
      {animalValue && <p className="text-body-s text-grayscale-gray6">{animalValue}</p>}
      {showDetails && details && <p className="text-body-s text-grayscale-gray6">{details}</p>}
    </div>
  );
}
