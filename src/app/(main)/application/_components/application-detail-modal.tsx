'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getReceivedApplicationDetail } from '@/api/breeder';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { LoadingText } from '@/components/loading-state';
import { CounselSection } from '@/app/(main)/counselform/_components/shared/counsel-section';
import { COUNSEL_SECTIONS } from '@/app/(main)/counselform/_constants/counsel-questions.constants';
import { CustomQuestionReadonlySection } from './custom-question-readonly-section';
import type { CounselFormData } from '@/app/(main)/counselform/_types/counsel';
import { formatPhoneNumber } from '@/utils/phone';
import { useUpdateApplicationStatus } from '../_hooks/use-update-application-status';

interface ApplicationDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
}

const ApplicationDetailModal = ({ open, onOpenChange, applicationId }: ApplicationDetailModalProps) => {
  const { data: application, isLoading } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => getReceivedApplicationDetail(applicationId),
    enabled: open && !!applicationId,
  });

  const updateStatusMutation = useUpdateApplicationStatus();

  const dialogContentClass =
    'w-full h-full md:w-[37.5rem] md:h-[37.5rem] md:translate-x-[-50%] md:translate-y-[-50%] md:top-[50%] md:left-[50%] top-0 left-0 translate-x-0 translate-y-0 rounded-none md:rounded-2xl md:overflow-hidden border-none';

  const handleCompleteConsultation = () => {
    updateStatusMutation.mutate(
      {
        applicationId,
        status: 'consultation_completed',
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const handleCancelConsultation = () => {
    updateStatusMutation.mutate({
      applicationId,
      status: 'consultation_pending',
    });
  };

  // 다이얼로그는 항상 하나로 유지하고, 내부 콘텐츠만 조건부 렌더링
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${dialogContentClass} p-0 gap-0 bg-white flex flex-col`}>
        {isLoading ? (
          <>
            <VisuallyHidden>
              <DialogTitle>로딩 중</DialogTitle>
            </VisuallyHidden>
            {/* 헤더 */}
            <div className="flex gap-1 h-15 items-center justify-end px-6 pt-6 pb-2.5 bg-white rounded-t-none md:rounded-t-2xl"></div>
            {/* 상단 구분선 */}
            <div className="h-px bg-[#E1E1E1]" />
            {/* 로딩 영역 */}
            <div className="overflow-y-auto bg-[#F6F6EA] px-6 py-5 flex-1 flex items-center justify-center">
              <LoadingText className="text-body-m text-grayscale-gray5" />
            </div>
            {/* 하단 구분선 */}
            <div className="h-px bg-[#E1E1E1]" />
            {/* 하단 버튼 영역 (빈 공간) */}
            <div className="bg-white px-6 py-4 rounded-b-none md:rounded-b-2xl h-[57px]"></div>
          </>
        ) : !application ? (
          <>
            <VisuallyHidden>
              <DialogTitle>오류</DialogTitle>
            </VisuallyHidden>
            {/* 헤더 */}
            <div className="flex gap-1 h-15 items-center justify-end px-6 pt-6 pb-2.5 bg-white rounded-t-none md:rounded-t-2xl"></div>
            {/* 상단 구분선 */}
            <div className="h-px bg-[#E1E1E1]" />
            {/* 오류 영역 */}
            <div className="overflow-y-auto bg-[#F6F6EA] px-6 py-5 flex-1 flex flex-col items-center justify-center">
              <p className="text-body-m text-grayscale-gray5">신청 정보를 찾을 수 없습니다.</p>
              <Button onClick={() => onOpenChange(false)} className="mt-4">
                닫기
              </Button>
            </div>
            {/* 하단 구분선 */}
            <div className="h-px bg-[#E1E1E1]" />
            {/* 하단 버튼 영역 (빈 공간) */}
            <div className="bg-white px-6 py-4 rounded-b-none md:rounded-b-2xl h-[57px]"></div>
          </>
        ) : (
          <>
            <VisuallyHidden>
              <DialogTitle>입양 신청 상세</DialogTitle>
            </VisuallyHidden>
            {/* 헤더 - 닫기 버튼만 */}
            <div className="flex gap-1 h-15 items-center justify-end px-6 pt-6 pb-2.5 bg-white rounded-t-none md:rounded-t-2xl"></div>

            {/* 상단 구분선 */}
            <div className="h-px bg-[#E1E1E1]" />

            {/* 스크롤 영역 */}
            <div className="overflow-y-auto bg-[#F6F6EA] px-6 py-5 flex-1">
          {/* 헤더: 입양자 닉네임 + 배지 */}
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-xl font-semibold text-[#4F3B2E]">{application.adopterName}</h2>
            <div className="flex items-center gap-2.5">
              {application.status === 'consultation_completed' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#A0A0A0] rounded-full">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-xs font-medium text-white">상담 완료</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#A0C8F4] rounded-full">
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
                  <span className="text-xs font-medium text-[#4F3B2E]">상담 전</span>
                </span>
              )}
              <span className="text-base text-[#888]">
                {new Date(application.appliedAt).toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-[#E1E1E1] mb-8" />

          {/* 질문 섹션들 */}
          {(() => {
            // application 데이터를 CounselFormData 형식으로 변환
            const formData: CounselFormData = {
              privacyAgreement: application.standardResponses.privacyConsent,
              name: application.adopterName,
              phone: application.adopterPhone || '',
              email: application.adopterEmail,
              introduction: application.standardResponses.selfIntroduction,
              familyMembers: application.standardResponses.familyMembers,
              familyAgreement: application.standardResponses.allFamilyConsent,
              allergyCheck: application.standardResponses.allergyTestInfo,
              awayTime: application.standardResponses.timeAwayFromHome,
              livingSpace: application.standardResponses.livingSpaceDescription,
              previousPets: application.standardResponses.previousPetExperience,
              basicCare: application.standardResponses.canProvideBasicCare ?? false,
              medicalExpense: application.standardResponses.canAffordMedicalExpenses ?? false,
              interestedAnimal: application.standardResponses.preferredPetDescription
                ? application.standardResponses.preferredPetDescription.split('/')
                : [],
              interestedAnimalDetails: '',
              adoptionTiming: application.standardResponses.desiredAdoptionTiming || '',
              additionalMessage: application.standardResponses.additionalNotes || '',
            };

            return (
              <div className="flex flex-col w-full">
                {COUNSEL_SECTIONS.map((section, index) => {
                  const isLast = index === COUNSEL_SECTIONS.length - 1;
                  return (
                    <div key={section.sectionId}>
                      <CounselSection
                        section={section}
                        mode="readonly"
                        formData={formData}
                        onFormatPhone={formatPhoneNumber}
                        readonlyVariant="white"
                      />
                      {!isLast && <div className="h-px bg-[#E1E1E1] w-full my-[60px]" />}
                    </div>
                  );
                })}
                {/* 브리더 커스텀 질문 섹션 */}
                {application.customResponses && application.customResponses.length > 0 && (
                  <CustomQuestionReadonlySection customResponses={application.customResponses} />
                )}
              </div>
            );
          })()}

  
        </div>

        {/* 하단 구분선 */}
        <div className="h-px bg-[#E1E1E1]" />

        {/* 하단 버튼 영역 */}
        <div className="bg-white px-6 py-4 rounded-b-none md:rounded-2xl flex items-center justify-between">
          {application.status !== 'consultation_completed' && (
            <div className="flex items-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <circle cx="6" cy="6" r="5" fill="#A0A0A0" />
                <path
                  d="M6 3.5V6.5M6 8.5H6.005"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-xs text-[#A0A0A0]">
                상담이 끝나면 [상담 완료]를 눌러 상대방이 후기를 남길 수 있게 해주세요.
              </p>
            </div>
          )}
          {application.status === 'consultation_completed' ? (
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="tertiary"
                className="h-9 px-4 bg-[#A0C8F4] hover:bg-[#77B2F3] text-[#4F3B2E] text-sm font-medium rounded"
                onClick={handleCancelConsultation}
                disabled={updateStatusMutation.isPending}
              >
                완료 취소
              </Button>
              <Button
                disabled
                className="h-9 px-4 bg-[#E1E1E1] text-[#A0A0A0] text-sm font-medium rounded min-w-[72px] cursor-not-allowed"
              >
                상담 완료
              </Button>
            </div>
          ) : (
            <Button
              className="h-9 px-4 bg-[#4F3B2E] hover:bg-[#3E2F23] text-white text-sm font-medium rounded min-w-[72px] ml-auto"
              onClick={handleCompleteConsultation}
              disabled={updateStatusMutation.isPending}
            >
              상담 완료
            </Button>
          )}
        </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

// 체크박스 컴포넌트
const CheckboxField = ({ checked, label }: { checked: boolean; label: string }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
        checked ? 'bg-[#4F3B2E] border-[#4F3B2E]' : 'border-[#CCC] bg-white'
      }`}
    >
      {checked && (
        <svg width="6" height="4" viewBox="0 0 6 4" fill="none">
          <path d="M0.5 2L2 3.5L5.5 0" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
    <span className="text-base text-[#545454]">{label}</span>
  </div>
);

// 입력 필드
const InputField = ({ value }: { value: string }) => (
  <div className="bg-white h-12 rounded-lg px-4 py-3 flex items-center">
    <p className="text-base text-[#4F3B2E]">{value}</p>
  </div>
);

// 텍스트 영역 필드
const TextAreaField = ({ value, charCount, maxCount }: { value: string; charCount: number; maxCount: number }) => (
  <div className="bg-white rounded-lg overflow-hidden">
    <div className="px-4 pt-3 pb-0 min-h-[140px]">
      <p className="text-base text-[#4F3B2E]">{value}</p>
    </div>
    <div className="px-4 pt-4 pb-3 flex justify-end">
      <p className="text-sm text-[#888]">
        <span className="text-[#4E9CF1]">{charCount}</span>/{maxCount}
      </p>
    </div>
  </div>
);


// 정보 텍스트
const InfoText = ({ text }: { text: string }) => (
  <div className="flex items-start gap-1">
    <span className="text-xs text-[#888]">·</span>
    <p className="text-xs text-[#888]">{text}</p>
  </div>
);

// 질문 필드
const QuestionField = ({ question, answer }: { question: string; answer: React.ReactNode }) => (
  <div className="flex flex-col gap-3">
    <p className="text-base font-semibold text-[#545454]">{question}</p>
    {answer}
  </div>
);

export default ApplicationDetailModal;
