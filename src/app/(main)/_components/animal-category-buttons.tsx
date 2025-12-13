'use client';

import AnimalCategoryCards, { type AnimalCategoryCard } from '@/components/animal-category-cards';

const animalInfo: AnimalCategoryCard[] = [
  {
    name: 'dog',
    label: '강아지',
    href: '/explore/dog',
    className: 'bg-secondary-500 hover:bg-secondary-600 text-primary-500',
    src: '/images/dog.png',
  },
  {
    name: 'cat',
    label: '고양이',
    href: '/explore/cat',
    className: 'bg-primary-500 hover:bg-primary-600 text-tertiary-500',
    src: '/images/cat.png',
  },
];

export default function AnimalCategoryButtons() {
  return (
    <AnimalCategoryCards
      animals={animalInfo.map((animal) => ({
        ...animal,
        label: `${animal.label} 보러 가기`,
      }))}
      size="default"
      layout="horizontal"
      className="flex-col gap-3 md:flex-col md:gap-4 lg:flex-row lg:gap-6"
    />
  );
}
