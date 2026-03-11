'use client';

import Cat from '@/assets/icons/cat';
import Dog from '@/assets/icons/dog';
import { Button } from '@/components/ui/button';
import { cn } from '@/api/utils';
import Link from 'next/link';
import type { ComponentType, SVGProps } from 'react';

export type AnimalType = 'dog' | 'cat';

interface AnimalTabItem {
  type: AnimalType;
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const ANIMAL_TAB_ITEMS: AnimalTabItem[] = [
  { type: 'dog', name: '강아지', icon: Dog },
  { type: 'cat', name: '고양이', icon: Cat },
];

interface AnimalTabBarProps {
  activeAnimal: AnimalType;
  getHref: (animal: AnimalType) => string;
  className?: string;
}

export default function AnimalTabBar({ activeAnimal, getHref, className }: AnimalTabBarProps) {
  return (
    <div className={cn('flex gap-5', className)}>
      {ANIMAL_TAB_ITEMS.map((item) => {
        const active = activeAnimal === item.type;

        return (
          <Link key={item.type} href={getHref(item.type)}>
            <Button
              variant="ghost"
              className={cn(
                'h-auto text-heading-3! text-grayscale-gray5 font-semibold -mx-2.5 -my-1.5 hover:bg-transparent flex-col gap-2 hover:text-primary-500',
                { 'text-primary-500': active },
              )}
            >
              <div className="flex gap-2 items-center">
                <item.icon className="size-7" />
                {item.name}
              </div>
              <div
                className={cn('h-[2px] bg-transparent w-full', {
                  'bg-primary-500!': active,
                })}
              />
            </Button>
          </Link>
        );
      })}
    </div>
  );
}

export { ANIMAL_TAB_ITEMS };
