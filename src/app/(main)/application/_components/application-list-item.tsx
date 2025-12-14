'use client';

import ProfileImageWithBadge from '@/components/breeder/profile-image-with-badge';
import BreederInfo from '@/components/breeder/breeder-info';
import { Button } from '@/components/ui/button';
import Pencil from '@/assets/icons/pencil.svg';
import ReviewDialog from './review-dialog';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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
}

// 상태별 뱃지 스타일
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'consultation_pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">상담 대기</Badge>;
    case 'consultation_completed':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">상담 완료</Badge>;
    case 'adoption_approved':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">입양 승인</Badge>;
    case 'adoption_rejected':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">입양 거절</Badge>;
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

  // 브리더 화면 (입양자 정보 표시)
  if (isBreeder && adopterName) {
    return (
      <div className="flex gap-5 items-start w-full md:flex-row">
        {/* 프로필 이미지 */}
        <ProfileImageWithBadge src={profileImage} alt={adopterName} animalType="profile" size={68} />

        {/* 입양자 정보 */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-body-m font-semibold text-grayscale-gray7">{adopterName}</h3>
            {getStatusBadge(status)}
          </div>

          {petName && (
            <p className="text-body-s text-grayscale-gray6">
              <span className="font-medium">반려동물:</span> {petName}
            </p>
          )}

          <div className="flex flex-col gap-1 text-body-xs text-grayscale-gray5">
            {adopterEmail && <p>이메일: {adopterEmail}</p>}
            {adopterPhone && <p>연락처: {adopterPhone}</p>}
            <p>{applicationDate}</p>
          </div>
        </div>

        {/* 상세보기 버튼 */}
        <Link href={`/application/${applicationId}`}>
          <Button
            variant="ghost"
            className="bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] h-8 px-4 py-2 rounded-lg shrink-0"
          >
            <span className="text-body-xs font-normal text-white">상세보기</span>
          </Button>
        </Link>
      </div>
    );
  }

  return null;
}
