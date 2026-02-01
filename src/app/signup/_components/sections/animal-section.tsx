'use client';

import AnimalCategoryCards, { type AnimalCategoryCard } from '@/components/animal-category-cards';
import SignupFormItems from '@/components/signup-form-section/signup-form-items';
import SignupFormSection from '@/components/signup-form-section/signup-form-section';
import SignupFormTitle from '@/components/signup-form-section/signup-form-title';
import UndoButton from '@/components/signup-form-section/undo-button';
import useSignupFormStore, { Animal } from '@/stores/signup-form-store';

const animalInfo: AnimalCategoryCard[] = [
  {
    name: 'cat',
    label: '고양이',
    className: 'bg-primary-500 hover:bg-primary-600 text-tertiary-500',
    src: '/images/cat.png',
  },
  {
    name: 'dog',
    label: '강아지',
    className: 'bg-secondary-500-basic hover:bg-secondary-600 text-primary-500',
    src: '/images/dog.png',
  },
];

export default function AnimalSection() {
  const setAnimal = useSignupFormStore((e) => e.setAnimal);
  const setPlan = useSignupFormStore((e) => e.setPlan);
  const nextFlowIndex = useSignupFormStore((e) => e.nextFlowIndex);

  const animalsWithOnClick = animalInfo.map((animal) => ({
    ...animal,
    onClick: () => {
      setAnimal(animal.name as Animal);
      setPlan('basic'); // 요금제 선택 화면 삭제로 인해 기본값으로 'basic' 설정
      nextFlowIndex();
    },
  }));

  return (
    <SignupFormSection>
      <SignupFormTitle>어떤 동물을 브리딩하시나요?</SignupFormTitle>
      <SignupFormItems>
        <AnimalCategoryCards animals={animalsWithOnClick} size="default" />
      </SignupFormItems>
      <UndoButton />
    </SignupFormSection>
  );
}
