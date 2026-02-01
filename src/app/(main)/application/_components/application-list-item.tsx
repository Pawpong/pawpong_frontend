'use client';

import { useState } from 'react';
import { dynamicClient } from '@/utils/dynamic-client';
import ProfileImageWithBadge from '@/components/breeder/profile-image-with-badge';
import BreederInfo from '@/components/breeder/breeder-info';
import { Button } from '@/components/ui/button';
import Pencil from '@/assets/icons/pencil.svg';
const ReviewDialog = dynamicClient(() => import('./review-dialog'));
import ReviewWriteDialog from './review-write-dialog';
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <rect x="3" y="7" width="2" height="2" fill="#4F3B2E" />
            <rect x="7" y="7" width="2" height="2" fill="#4F3B2E" />
            <rect x="11" y="7" width="2" height="2" fill="#4F3B2E" />
          </svg>
          <span className="text-caption font-medium">상담 전</span>
        </Badge>
      );
    case 'consultation_completed':
      return (
        <Badge className="bg-[#A0A0A0] text-white hover:bg-[#A0A0A0] h-7 px-3 py-1.5 gap-1.5 rounded-full flex items-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M4 8L6.5 10.5L12 5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-caption font-medium">상담 완료</span>
        </Badge>
      );
    case 'adoption_approved':
      return (
        <Badge className="bg-[#A0A0A0] text-white hover:bg-[#A0A0A0] h-7 px-3 py-1.5 gap-1.5 rounded-full flex items-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M4 8L6.5 10.5L12 5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-caption font-medium">입양 승인</span>
        </Badge>
      );
    case 'adoption_rejected':
      return (
        <Badge className="bg-[#A0A0A0] text-white hover:bg-[#A0A0A0] h-7 px-3 py-1.5 gap-1.5 rounded-full flex items-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M5 5L11 11M11 5L5 11"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
  animalType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  adopterId,
  adopterName,
  petName,
  preferredPetInfo,
}: ApplicationListItemProps) {
  // 🔧 모든 hooks는 컴포넌트 최상단에서 호출 (React Hooks 규칙 준수)
  // 입양자 화면용 상태
  const canWriteReview = status === 'consultation_completed' || status === 'adoption_approved';
  const [showReviewWriteDialog, setShowReviewWriteDialog] = useState(false);

  // 브리더 화면용 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 입양자 화면 (브리더 정보 표시)
  if (!isBreeder && breederName) {
    const buttonText = '후기 작성';

    const handleReviewButtonClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowReviewWriteDialog(true);
    };

    return (
      <>
        <ReviewDialog
          applicationId={applicationId}
          breederId={breederId!}
          breederName={breederName}
          applicationDate={applicationDate}
          profileImage={profileImage}
          animalType={(animalType || 'cat') as 'cat' | 'dog'}
          canWriteReview={canWriteReview}
        >
          <div className="flex gap-5 items-center w-full md:flex-row cursor-pointer hover:opacity-80 transition-opacity">
            {/* 프로필 이미지 */}
            <ProfileImageWithBadge
              src={profileImage}
              alt={breederName}
              animalType={(animalType || 'cat') as 'cat' | 'dog'}
              size={68}
            />

            {/* 브리더 정보 + 날짜/버튼 영역 */}
            <div className="flex-1 flex flex-col gap-2 md:gap-3">
              <BreederInfo breederName={breederName} />
              <div className="flex justify-between items-center gap-2">
                <p className="text-body-s font-normal text-grayscale-gray5 whitespace-nowrap">{applicationDate}</p>
                {/* 후기 버튼 - 상담 완료/입양 승인 상태에서만 표시 */}
                {canWriteReview && (
                  <Button
                    variant="ghost"
                    className="bg-[var(--color-tertiary-500)] hover:bg-[var(--color-tertiary-600)] h-8 px-3 py-2 gap-1 rounded-lg shrink-0 md:hidden"
                    onClick={handleReviewButtonClick}
                  >
                    <span className="text-body-xs font-normal text-grayscale-gray6">{buttonText}</span>
                    <Pencil className="size-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* 후기 버튼 (데스크톱) - 상담 완료/입양 승인 상태에서만 표시 */}
            {canWriteReview && (
              <Button
                variant="ghost"
                className="bg-[var(--color-tertiary-500)] hover:bg-[var(--color-tertiary-600)] h-8 px-3 py-2 gap-1 rounded-lg shrink-0 hidden md:flex"
                onClick={handleReviewButtonClick}
              >
                <span className="text-body-xs font-normal text-grayscale-gray6">{buttonText}</span>
                <Pencil className="size-4" />
              </Button>
            )}
          </div>
        </ReviewDialog>

        {/* 후기 작성/보기 다이얼로그 - 버튼 클릭 시 바로 열림 */}
        <ReviewWriteDialog
          applicationId={applicationId}
          breederId={breederId!}
          open={showReviewWriteDialog}
          onOpenChange={setShowReviewWriteDialog}
          breederName={breederName}
          applicationDate={applicationDate}
          profileImage={profileImage}
          animalType={(animalType || 'cat') as 'cat' | 'dog'}
        />
      </>
    );
  }

  // 브리더 화면 (입양자 정보 표시) - Figma 디자인 완벽 반영
  if (isBreeder && adopterName) {
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
