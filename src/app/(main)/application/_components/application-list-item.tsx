'use client';

import { useState } from 'react';
import ProfileImageWithBadge from '@/components/breeder/profile-image-with-badge';
import BreederInfo from '@/components/breeder/breeder-info';
import { Button } from '@/components/ui/button';
import Pencil from '@/assets/icons/pencil.svg';
import ReviewDialog from './review-dialog';
import { Badge } from '@/components/ui/badge';
import ApplicationDetailModal from './application-detail-modal';

interface ApplicationListItemProps {
  applicationId: string;
  applicationDate: string;
  profileImage: string;
  status: 'consultation_pending' | 'consultation_completed' | 'adoption_approved' | 'adoption_rejected';
  isBreeder: boolean;
  // 입양자용 (브리더 정보)
  breederId?: string;
  breederName?: string;
  breederLevel?: 'elite' | 'new';
  animalType?: 'cat' | 'dog';
  petBreed?: string;
  // 브리더용 (입양자 정보)
  adopterId?: string;
  adopterName?: string;
  adopterEmail?: string;
  adopterPhone?: string;
  petName?: string;
  /** 입양 원하는 아이 정보 (드롭다운 선택 또는 직접 입력 텍스트) */
  preferredPetInfo?: string;
}

// 상태별 뱃지 스타일 (Figma 디자인 반영)
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'consultation_pending':
      return (
        <Badge className="bg-[#A0C8F4] text-[#4F3B2E] hover:bg-[#A0C8F4] h-7 px-3 py-1.5 gap-1.5 rounded-full flex items-center">
          <span className="text-caption font-medium">상담 전</span>
        </Badge>
      );
    case 'consultation_completed':
      return (
        <Badge className="bg-[#A0A0A0] text-white hover:bg-[#A0A0A0] h-7 px-3 py-1.5 gap-1.5 rounded-full flex items-center">
          <span className="text-caption font-medium">상담 완료</span>
        </Badge>
      );
    case 'adoption_approved':
      return (
        <Badge className="bg-[#A0A0A0] text-white hover:bg-[#A0A0A0] h-7 px-3 py-1.5 gap-1.5 rounded-full flex items-center">
          <span className="text-caption font-medium">입양 승인</span>
        </Badge>
      );
    case 'adoption_rejected':
      return (
        <Badge className="bg-[#A0A0A0] text-white hover:bg-[#A0A0A0] h-7 px-3 py-1.5 gap-1.5 rounded-full flex items-center">
          <span className="text-caption font-medium">입양 거절</span>
        </Badge>
      );
    default:
      return null;
  }
};

export default function ApplicationListItem({
  applicationId,
  applicationDate,
  profileImage,
  status,
  isBreeder,
  breederId,
  breederName,
  breederLevel,
  animalType,
  petBreed,
  adopterId,
  adopterName,
  adopterEmail,
  adopterPhone,
  petName,
  preferredPetInfo,
}: ApplicationListItemProps) {
  // 입양자 화면 (브리더 정보 표시)
  if (!isBreeder && breederName && breederLevel) {
    // 상담 완료 또는 입양 승인 상태에서만 후기 작성 가능
    const canWriteReview = status === 'consultation_completed' || status === 'adoption_approved';

    return (
      <div className="flex gap-5 items-center w-full md:flex-row">
        {/* 프로필 이미지 */}
        <ProfileImageWithBadge
          src={profileImage}
          alt={breederName}
          animalType={(animalType || 'cat') as 'cat' | 'dog'}
          size={68}
        />

        {/* 브리더 정보 + 날짜/버튼 영역 */}
        <div className="flex-1 flex flex-col gap-2 md:gap-3">
          <BreederInfo breederName={breederName} breederLevel={breederLevel} />
          <div className="flex justify-between items-center gap-2">
            <p className="text-body-s font-normal text-grayscale-gray5 whitespace-nowrap">{applicationDate}</p>
            {/* 후기 작성 버튼 - 상담 완료/입양 승인 상태에서만 표시 */}
            {canWriteReview && (
              <ReviewDialog
                applicationId={applicationId}
                breederId={breederId!}
                breederName={breederName}
                breederLevel={breederLevel}
                applicationDate={applicationDate}
                profileImage={profileImage}
                animalType={(animalType || 'cat') as 'cat' | 'dog'}
              >
                <Button
                  variant="ghost"
                  className="bg-[var(--color-tertiary-500)] hover:bg-[var(--color-tertiary-600)] h-8 px-3 py-2 gap-1 rounded-lg shrink-0 md:hidden"
                >
                  <span className="text-body-xs font-normal text-grayscale-gray6">후기 작성</span>
                  <Pencil className="size-4" />
                </Button>
              </ReviewDialog>
            )}
          </div>
        </div>

        {/* 후기 작성 버튼 (데스크톱) - 상담 완료/입양 승인 상태에서만 표시 */}
        {canWriteReview && (
          <ReviewDialog
            applicationId={applicationId}
            breederId={breederId!}
            breederName={breederName}
            breederLevel={breederLevel}
            applicationDate={applicationDate}
            profileImage={profileImage}
            animalType={(animalType || 'cat') as 'cat' | 'dog'}
          >
            <Button
              variant="ghost"
              className="bg-[var(--color-tertiary-500)] hover:bg-[var(--color-tertiary-600)] h-8 px-3 py-2 gap-1 rounded-lg shrink-0 hidden md:flex"
            >
              <span className="text-body-xs font-normal text-grayscale-gray6">후기 작성</span>
              <Pencil className="size-4" />
            </Button>
          </ReviewDialog>
        )}
      </div>
    );
  }

  // 브리더 화면 (입양자 정보 표시) - Figma 디자인 완벽 반영
  if (isBreeder && adopterName) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 입양 원하는 아이 정보 표시 (preferredPetInfo 우선, 없으면 petName)
    const displayPetInfo = preferredPetInfo || petName || '분양 중인 아이 정보';

    return (
      <>
        <div
          className="bg-[#F8F8EE] flex flex-col gap-3 p-5 rounded-lg w-full cursor-pointer hover:bg-[#F0F0E5] transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          {/* 신청자 정보 */}
          <div className="flex flex-col gap-1 w-full">
            {/* 신청자 닉네임 */}
            <h3 className="text-body-m font-medium text-[#4F3B2E]">{adopterName}</h3>

            {/* 분양 중인 아이 정보 (드롭다운 선택 또는 직접 입력 텍스트) */}
            <p className="text-body-s font-normal text-[#888888] overflow-ellipsis overflow-hidden whitespace-nowrap">
              {displayPetInfo}
            </p>
          </div>

          {/* 뱃지 + 날짜 */}
          <div className="flex items-center gap-3">
            {getStatusBadge(status)}
            <p className="text-body-s font-normal text-[#888888]">{applicationDate}</p>
          </div>
        </div>

        {/* 상세보기 모달 */}
        <ApplicationDetailModal open={isModalOpen} onOpenChange={setIsModalOpen} applicationId={applicationId} />
      </>
    );
  }

  return null;
}
