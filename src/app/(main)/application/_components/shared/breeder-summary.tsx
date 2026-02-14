'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ProfileImageWithBadge from '@/components/breeder/profile-image-with-badge';
import BreederInfo from '@/components/breeder/breeder-info';
import RightArrow from '@/assets/icons/right-arrow.svg';

interface BreederSummaryProps {
  breederId: string;
  breederName: string;
  applicationDate: string;
  profileImage: string;
  animalType: 'cat' | 'dog';
  onOpenChange: (open: boolean) => void;
}

export default function BreederSummary({
  breederId,
  breederName,
  applicationDate,
  profileImage,
  animalType,
  onOpenChange,
}: BreederSummaryProps) {
  const router = useRouter();

  const handleNavigateToBreeder = () => {
    onOpenChange(false);
    router.push(`/explore/breeder/${breederId}`);
  };

  return (
    <div
      className="flex items-center justify-between w-full cursor-pointer hover:opacity-80 transition-opacity"
      onClick={handleNavigateToBreeder}
    >
      <div className="flex gap-5 items-center grow">
        <ProfileImageWithBadge src={profileImage} alt={breederName} animalType={animalType} size={68} />
        <BreederInfo breederName={breederName} applicationDate={applicationDate} className="gap-3" />
      </div>
      <Button
        className="gap-1 text-grayscale-gray5 text-body-xs h-auto p-0 has-[>svg]:px-0 hover:bg-transparent"
        onClick={(e) => {
          e.stopPropagation();
          handleNavigateToBreeder();
        }}
      >
        <span>보기</span>
        <RightArrow className="size-5" />
      </Button>
    </div>
  );
}
