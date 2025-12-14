'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getReceivedApplicationDetail } from '@/lib/breeder';
import { useAuthStore } from '@/stores/auth-store';
import { getUserRoleFromCookie } from '@/lib/cookie-utils';
import { useEffect, useState } from 'react';

const ApplicationDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [isBreeder, setIsBreeder] = useState(false);
  const applicationId = params.id as string;

  // 클라이언트 마운트 후에만 role 결정
  useEffect(() => {
    const cookieRole = getUserRoleFromCookie();
    const userRole = cookieRole || user?.role;
    setIsBreeder(userRole === 'breeder');
  }, [user?.role]);

  const { data: application, isLoading } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => getReceivedApplicationDetail(applicationId),
    enabled: isBreeder && !!applicationId,
  });

  if (!isBreeder) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-body-m text-grayscale-gray5">브리더만 접근 가능합니다.</p>
          <Button onClick={() => router.push('/application')} className="mt-4">
            목록으로 돌아가기
          </Button>
        </div>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-body-m text-grayscale-gray5">로딩 중...</p>
        </div>
      </Container>
    );
  }

  if (!application) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-body-m text-grayscale-gray5">신청 정보를 찾을 수 없습니다.</p>
          <Button onClick={() => router.push('/application')} className="mt-4">
            목록으로 돌아가기
          </Button>
        </div>
      </Container>
    );
  }

  const statusMap = {
    consultation_pending: { label: '상담 대기', color: 'bg-yellow-100 text-yellow-800' },
    consultation_completed: { label: '상담 완료', color: 'bg-blue-100 text-blue-800' },
    adoption_approved: { label: '입양 승인', color: 'bg-green-100 text-green-800' },
    adoption_rejected: { label: '입양 거절', color: 'bg-red-100 text-red-800' },
  };

  const currentStatus = statusMap[application.status as keyof typeof statusMap];

  return (
    <Container>
      <div className="flex-1 @container flex flex-col gap-6 lg:gap-8 mt-6 lg:mt-10 pb-10">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h1 className="text-heading-3 font-semibold text-[#4F3B2E]">입양 신청 상세</h1>
          <Button variant="outline" onClick={() => router.push('/application')}>
            목록으로
          </Button>
        </div>

        {/* 상태 배지 */}
        <div>
          <Badge className={currentStatus.color}>{currentStatus.label}</Badge>
        </div>

        {/* 입양자 정보 */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-heading-4 font-semibold text-[#4F3B2E] mb-4">입양자 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-body-xs text-grayscale-gray5 mb-1">이름</p>
              <p className="text-body-m text-[#4F3B2E]">{application.adopterName}</p>
            </div>
            <div>
              <p className="text-body-xs text-grayscale-gray5 mb-1">이메일</p>
              <p className="text-body-m text-[#4F3B2E]">{application.adopterEmail}</p>
            </div>
            <div>
              <p className="text-body-xs text-grayscale-gray5 mb-1">연락처</p>
              <p className="text-body-m text-[#4F3B2E]">{application.adopterPhone}</p>
            </div>
            <div>
              <p className="text-body-xs text-grayscale-gray5 mb-1">신청일</p>
              <p className="text-body-m text-[#4F3B2E]">
                {new Date(application.appliedAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        </section>

        {/* 반려동물 정보 */}
        {application.petName && (
          <section className="bg-white rounded-lg border p-6">
            <h2 className="text-heading-4 font-semibold text-[#4F3B2E] mb-4">신청한 반려동물</h2>
            <p className="text-body-m text-[#4F3B2E]">{application.petName}</p>
          </section>
        )}

        {/* 신청서 내용 */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-heading-4 font-semibold text-[#4F3B2E] mb-4">입양 신청서</h2>
          <div className="space-y-6">
            <div>
              <p className="text-body-s font-medium text-[#4F3B2E] mb-2">개인정보 수집 및 이용 동의</p>
              <p className="text-body-m text-grayscale-gray6">
                {application.applicationData.privacyConsent ? '동의함' : '동의하지 않음'}
              </p>
            </div>

            <div>
              <p className="text-body-s font-medium text-[#4F3B2E] mb-2">자기소개</p>
              <p className="text-body-m text-grayscale-gray6 whitespace-pre-wrap">
                {application.applicationData.selfIntroduction}
              </p>
            </div>

            <div>
              <p className="text-body-s font-medium text-[#4F3B2E] mb-2">가족 구성원</p>
              <p className="text-body-m text-grayscale-gray6 whitespace-pre-wrap">
                {application.applicationData.familyMembers}
              </p>
            </div>

            <div>
              <p className="text-body-s font-medium text-[#4F3B2E] mb-2">가족 구성원 동의 여부</p>
              <p className="text-body-m text-grayscale-gray6">
                {application.applicationData.allFamilyConsent ? '모두 동의함' : '일부 미동의'}
              </p>
            </div>

            <div>
              <p className="text-body-s font-medium text-[#4F3B2E] mb-2">알러지 검사 정보</p>
              <p className="text-body-m text-grayscale-gray6 whitespace-pre-wrap">
                {application.applicationData.allergyTestInfo}
              </p>
            </div>

            <div>
              <p className="text-body-s font-medium text-[#4F3B2E] mb-2">집을 비우는 시간</p>
              <p className="text-body-m text-grayscale-gray6 whitespace-pre-wrap">
                {application.applicationData.timeAwayFromHome}
              </p>
            </div>

            <div>
              <p className="text-body-s font-medium text-[#4F3B2E] mb-2">거주 공간 소개</p>
              <p className="text-body-m text-grayscale-gray6 whitespace-pre-wrap">
                {application.applicationData.livingSpaceDescription}
              </p>
            </div>

            <div>
              <p className="text-body-s font-medium text-[#4F3B2E] mb-2">반려동물 경험</p>
              <p className="text-body-m text-grayscale-gray6 whitespace-pre-wrap">
                {application.applicationData.previousPetExperience}
              </p>
            </div>
          </div>
        </section>

        {/* 브리더 메모 */}
        {application.breederNotes && (
          <section className="bg-white rounded-lg border p-6">
            <h2 className="text-heading-4 font-semibold text-[#4F3B2E] mb-4">메모</h2>
            <p className="text-body-m text-grayscale-gray6 whitespace-pre-wrap">{application.breederNotes}</p>
          </section>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => router.push('/application')}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ApplicationDetailPage;
