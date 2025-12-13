'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export interface AnimalCategoryCard {
  name: string;
  label: string;
  href?: string;
  className?: string;
  src: string;
  onClick?: () => void;
}

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

interface AnimalCategoryCardsProps {
  animals?: AnimalCategoryCard[];
  size?: 'default' | 'compact';
  layout?: 'vertical' | 'horizontal';
  showLabels?: string[];
  className?: string;
}

export default function AnimalCategoryCards({
  animals = animalInfo,
  size = 'default',
  layout = 'vertical',
  showLabels,
  className,
}: AnimalCategoryCardsProps) {
  const sizeClasses = {
    default: {
      button: 'pt-12 pb-0 px-4 md:px-8 h-39',
      image: 'h-[72px]',
    },
    compact: {
      button: 'pt-8 pb-0 px-4 md:px-6 h-32',
      image: 'h-[56px]',
    },
  };

  const currentSize = sizeClasses[size];

  const getLabel = (animal: AnimalCategoryCard) => {
    if (showLabels) {
      const customLabel = showLabels.find((label) => label.includes(animal.name === 'cat' ? '고양이' : '강아지'));
      return customLabel || animal.label;
    }
    return animal.label;
  };

  const content = animals.map((animal) => {
    const buttonContent = (
      <Button
        key={animal.name}
        className={cn('w-full justify-between rounded-2xl flex flex-col', currentSize.button, animal.className)}
        onClick={animal.onClick}
      >
        <div className="text-body-l font-semibold">{getLabel(animal)}</div>
        <div className={cn('relative w-full', currentSize.image)}>
          <Image src={animal.src} alt={getLabel(animal)} fill className="object-contain" />
        </div>
      </Button>
    );

    if (animal.href) {
      return (
        <Link key={animal.name} href={animal.href} className="flex-1">
          {buttonContent}
        </Link>
      );
    }

    return buttonContent;
  });

  return (
    <div className={cn('flex', !className && layout === 'horizontal' ? 'flex-row' : 'flex-col', 'gap-3', className)}>
      {content}
    </div>
  );
}
