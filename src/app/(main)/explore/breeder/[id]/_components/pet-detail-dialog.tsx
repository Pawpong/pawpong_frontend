'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Female from '@/assets/icons/female';
import Male from '@/assets/icons/male';
import AdoptionStatusBadge from '@/components/adoption-status-badge';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useCounselFormStore } from '@/stores/counsel-form-store';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@/components/ui/visually-hidden';

import RightArrow from '@/assets/icons/right-arrow.svg';
import Close from '@/assets/icons/close';

const sexInfo = {
  male: { icon: Male, className: 'text-gender-male-500' },
  female: { icon: Female, className: 'text-gender-female-500' },
};

export interface PetDetailData {
  id: string;
  avatarUrl: string;
  name: string;
  sex: 'male' | 'female';
  birth: string;
  price?: string | null;
  breed: string;
  status?: 'available' | 'reserved' | 'completed';
  description?: string;
  parents?: {
    id: string;
    avatarUrl: string;
    name: string;
    sex: 'male' | 'female';
    birth: string;
    breed: string;
  }[];
}

interface PetDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pet: PetDetailData | null;
  type: 'pet' | 'parent';
  breederId: string;
  breederDescription?: string;
  isOwnProfile?: boolean;
}

export default function PetDetailDialog({
  open,
  onOpenChange,
  pet,
  type,
  breederId,
  breederDescription,
  isOwnProfile = false,
}: PetDetailDialogProps) {
  const router = useRouter();
  const { clearCounselFormData } = useCounselFormStore();
  const { isAuthenticated, user } = useAuthStore();
  const isBreeder = user?.role === 'breeder';
  const [selectedParent, setSelectedParent] = useState<PetDetailData | null>(null);
  const [isParentDialogOpen, setIsParentDialogOpen] = useState(false);

  if (!pet) return null;

  const Icon = sexInfo[pet.sex].icon;

  const getValidImageUrl = (url: string) => {
    if (!url) return '/animal-sample.png';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return '/animal-sample.png';
  };

  const handleCounselClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    clearCounselFormData();
    // type이 'pet'이고 pet이 있을 때만 petId 전달
    const petIdParam = type === 'pet' && pet ? `&petId=${pet.id}` : '';
    router.push(`/counselform?breederId=${breederId}${petIdParam}`);
    onOpenChange(false);
  };

  const handleParentClick = (parent: {
    id: string;
    avatarUrl: string;
    name: string;
    sex: 'male' | 'female';
    birth: string;
    breed: string;
  }) => {
    // 현재 다이얼로그 닫기
    onOpenChange(false);

    // 부모 정보를 PetDetailData로 변환
    const parentDetail: PetDetailData = {
      id: parent.id,
      avatarUrl: parent.avatarUrl,
      name: parent.name,
      sex: parent.sex,
      birth: parent.birth,
      breed: parent.breed,
    };

    setSelectedParent(parentDetail);
    setIsParentDialogOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[37.5rem] w-full max-h-[37.5rem] overflow-hidden flex flex-col p-0 gap-0 rounded-2xl"
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>{pet.name} 정보</DialogTitle>
        </VisuallyHidden>
        {/* 헤더 */}
        <div className="flex flex-col gap-[10px] items-start pt-6 px-6 pb-[10px]">
          <div className="flex gap-1 items-center justify-end w-full">
            <DialogClose asChild>
              <Button variant="secondary" size="icon">
                <Close className="size-7" />
                <span className="sr-only">닫기</span>
              </Button>
            </DialogClose>
          </div>
        </div>

        {/* 구분선 */}
        <Separator />

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div className="bg-white flex flex-col gap-7 min-h-0 overflow-y-auto px-6 pt-5 pb-10">
          {/* 프로필 이미지 */}
          <div className="flex justify-center">
            <div className="relative w-[17.5rem] h-[17.5rem] rounded-2xl overflow-hidden">
              <Image
                src={getValidImageUrl(pet.avatarUrl)}
                alt={`${pet.name}의 사진`}
                fill
                className="object-cover"
                unoptimized={getValidImageUrl(pet.avatarUrl).startsWith('http')}
              />
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              {/* 이름, 성별, 생년월일, 입양 금액대 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-0.5">
                  <h3 className="text-heading-3 font-semibold text-primary-500">{pet.name}</h3>
                  <Icon className={cn('w-5 h-5', sexInfo[pet.sex].className)} />
                </div>
                <div className="text-body-s text-grayscale-gray5">{pet.birth}</div>
                {type === 'pet' && pet.price !== null && (
                  <div className="text-body-s text-grayscale-gray5">{pet.price}</div>
                )}
              </div>

              {/* 입양 가능 배지 + 품종 */}
              <div className="flex items-center gap-2 flex-wrap">
                {type === 'pet' && pet.status && <AdoptionStatusBadge status={pet.status} />}
                <div className="rounded bg-tertiary-500 py-1.5 px-2.5 text-body-xs font-medium text-primary-500">
                  {pet.breed}
                </div>
              </div>
            </div>

            {/* 소개 내용 */}
            {pet.description && (
              <div className="text-body-s text-grayscale-gray6 whitespace-pre-wrap">{pet.description}</div>
            )}
          </div>

          {/* 엄마아빠 섹션 (분양 중인 아이만) */}
          {type === 'pet' && pet.parents && pet.parents.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-col gap-3.5">
                <h4 className="text-body-m font-semibold text-grayscale-gray6">엄마 · 아빠</h4>
                <div className="flex flex-col gap-3.5">
                  {pet.parents.map((parent) => (
                    <div key={parent.id} className="flex items-center gap-6">
                      <div className="relative w-[6.25rem] h-[6.25rem] rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={getValidImageUrl(parent.avatarUrl)}
                          alt={`${parent.name}의 사진`}
                          fill
                          className="object-cover"
                          unoptimized={getValidImageUrl(parent.avatarUrl).startsWith('http')}
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5">
                        <div className="flex items-center gap-0.5">
                          <span className="text-body-m font-semibold text-primary-500">{parent.name}</span>
                          {(() => {
                            const ParentIcon = sexInfo[parent.sex].icon;
                            return <ParentIcon className={cn('w-5 h-5', sexInfo[parent.sex].className)} />;
                          })()}
                        </div>
                        <div className="text-body-s text-grayscale-gray5">{parent.birth}</div>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-body-xs text-grayscale-gray5 gap-1 h-auto p-0"
                        onClick={() => handleParentClick(parent)}
                      >
                        보기
                        <RightArrow className="size-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 구분선 */}
        <Separator />

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-2.5 px-6 py-4">
          {type === 'pet' ? (
            <Button
              variant="tertiary"
              className="h-9 px-4 text-body-medium text-primary-500 rounded-sm"
              onClick={handleCounselClick}
              disabled={isOwnProfile || isBreeder}
            >
              상담 신청하기
            </Button>
          ) : (
            <Button
              variant="tertiary"
              className="h-9 px-4 text-body-medium text-primary-500 rounded-sm min-w-[4.5rem]"
              onClick={() => onOpenChange(false)}
            >
              닫기
            </Button>
          )}
        </div>
      </DialogContent>

      {/* 부모 다이얼로그 */}
      {selectedParent && (
        <PetDetailDialog
          open={isParentDialogOpen}
          onOpenChange={setIsParentDialogOpen}
          pet={selectedParent}
          type="parent"
          breederId={breederId}
          breederDescription={breederDescription}
        />
      )}
    </Dialog>
  );
}
