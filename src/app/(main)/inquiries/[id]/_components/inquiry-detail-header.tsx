import { ANIMAL_TAB_ITEMS } from '@/components/animal-tab-bar';
import type { Inquiry } from '../../_types/inquiry';
import InquiryDetailImages from './inquiry-detail-images';

interface InquiryDetailHeaderProps {
  inquiry: Inquiry;
}

export default function InquiryDetailHeader({ inquiry }: InquiryDetailHeaderProps) {
  const animalItem = ANIMAL_TAB_ITEMS.find((item) => item.type === inquiry.animalType);
  const Icon = animalItem?.icon ?? ANIMAL_TAB_ITEMS[0].icon;
  const animalName = animalItem?.name ?? '강아지';

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex gap-2 items-center">
        <Icon className="size-5 text-grayscale-gray6" aria-hidden />
        <span className="text-body-s font-semibold text-grayscale-gray6">{animalName}</span>
      </div>

      <h1 className="text-heading-3 font-semibold text-primary-500">{inquiry.title}</h1>

      <p className="text-body-m font-medium text-grayscale-gray6 whitespace-pre-wrap">{inquiry.content}</p>

      <InquiryDetailImages imageUrls={inquiry.imageUrls} className="mx-auto" />
    </div>
  );
}
