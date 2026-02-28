'use client';

import Image from 'next/image';
import { ANIMAL_TAB_ITEMS } from '@/components/animal-tab-bar';
import type { Inquiry } from '../../_types/inquiry';

interface InquiryDetailHeaderProps {
  inquiry: Inquiry;
}

export default function InquiryDetailHeader({ inquiry }: InquiryDetailHeaderProps) {
  const animalItem = ANIMAL_TAB_ITEMS.find((item) => item.type === inquiry.animalType);
  const Icon = animalItem?.icon ?? ANIMAL_TAB_ITEMS[0].icon;
  const animalName = animalItem?.name ?? '강아지';

  const imageUrls = inquiry.imageUrls ?? [];
  const gridCount = Math.min(4, Math.max(0, imageUrls.length) || 4);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-2 items-center">
        <Icon className="size-5 text-grayscale-gray6" aria-hidden />
        <span className="text-body-s font-medium text-grayscale-gray6">{animalName}</span>
      </div>

      <h1 className="text-heading-2 font-bold text-primary-500">{inquiry.title}</h1>

      <p className="text-body-m font-normal text-grayscale-gray6 whitespace-pre-wrap">{inquiry.content}</p>

      {gridCount > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          {Array.from({ length: gridCount }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-square w-full rounded-lg overflow-hidden bg-grayscale-gray2 bg-[length:16px_16px] bg-[image:repeating-conic-gradient(#e5e5e5_0_25%,transparent_0_50%)]"
              role="img"
              aria-label={imageUrls[i] ? `첨부 이미지 ${i + 1}` : '이미지 없음'}
            >
              {imageUrls[i] ? (
                <Image
                  src={imageUrls[i]}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover rounded-lg"
                />
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
