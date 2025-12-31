'use client';

import { useFormContext } from 'react-hook-form';

import TextareaWithCount from '../shared/textarea-with-count';
import type { CounselFormData } from '../../_types/counsel';

export default function PreferredPetDetailField() {
  const { watch } = useFormContext<CounselFormData>();
  const selected = watch('interestedAnimal');

  if (!selected?.includes('특징 직접 입력')) return null;

  return (
    <TextareaWithCount name="interestedAnimalDetails" placeholder="원하시는 아이의 특징을 자유롭게 입력해주세요" />
  );
}
