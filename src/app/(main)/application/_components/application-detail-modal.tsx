'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReceivedApplicationDetail, updateApplicationStatus } from '@/lib/breeder';
import { toast } from '@/hooks/use-toast';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ApplicationDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
}

const ApplicationDetailModal = ({ open, onOpenChange, applicationId }: ApplicationDetailModalProps) => {
  const queryClient = useQueryClient();

  const { data: application, isLoading } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => getReceivedApplicationDetail(applicationId),
    enabled: open && !!applicationId,
  });

  const completeConsultationMutation = useMutation({
    mutationFn: () =>
      updateApplicationStatus(applicationId, {
        applicationId,
        status: 'consultation_completed',
      }),
    onSuccess: () => {
      toast({
        title: '상담 완료',
        description: '상담이 완료되었습니다. 입양자에게 알림이 전송되었습니다.',
      });
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: '오류',
        description: error.message || '상담 완료 처리 중 오류가 발생했습니다.',
      });
    },
  });

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[600px] p-0">
          <VisuallyHidden>
            <DialogTitle>로딩 중</DialogTitle>
          </VisuallyHidden>
          <div className="flex justify-center items-center py-20">
            <p className="text-body-m text-grayscale-gray5">로딩 중...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!application) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[600px] p-6">
          <VisuallyHidden>
            <DialogTitle>오류</DialogTitle>
          </VisuallyHidden>
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-body-m text-grayscale-gray5">신청 정보를 찾을 수 없습니다.</p>
            <Button onClick={() => onOpenChange(false)} className="mt-4">
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleCompleteConsultation = () => {
    completeConsultationMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[90vh] p-0 gap-0 bg-white">
        <VisuallyHidden>
          <DialogTitle>입양 신청 상세</DialogTitle>
        </VisuallyHidden>
        {/* 헤더 - 닫기 버튼만 */}
        <div className="flex gap-1 h-15 items-center justify-end px-6 pt-6 pb-2.5 bg-white rounded-t-2xl"></div>

        {/* 상단 구분선 */}
        <div className="h-px bg-[#E1E1E1]" />

        {/* 스크롤 영역 */}
        <div className="overflow-y-auto bg-[#F6F6EA] px-6 py-5 max-h-[calc(90vh-200px)]">
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
          <div className="flex flex-col gap-[60px]">
            {/* 섹션 1: 개인정보 동의 + 연락처 */}
            <div className="flex flex-col gap-8">
              {/* 개인정보 동의 */}
              <div className="flex flex-col gap-3">
                <p className="text-base font-semibold text-[#545454]">
                  반려동물 입양 상담을 위한 개인정보 수집과 이용에 동의하시나요?
                </p>
                <div className="flex flex-col gap-2.5">
                  <div className="bg-white h-12 rounded-lg px-4 py-2 flex items-center gap-2">
                    <CheckboxField checked={application.standardResponses.privacyConsent} label="동의합니다" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <InfoText text="수집하는 개인정보 항목: 이름, 연락처, 이메일주소 등" />
                    <InfoText text="수집 및 이용 목적: 입양자 상담 및 검토" />
                    <InfoText text="보유 및 이용기간: 상담 또는 입양 직후 폐기" />
                  </div>
                </div>
              </div>

              {/* 간단연락처 */}
              <div className="flex flex-col gap-3">
                <InputField value={application.adopterName || '김입양자'} />
                <InputField value={application.adopterPhone} />
                <InputField value={application.adopterEmail} />
              </div>
            </div>

            {/* 구분선 */}
            <div className="h-px bg-[#E1E1E1]" />

            {/* 섹션 2: 자기소개 + 가족 구성원 + 동의 + 알러지 */}
            <div className="flex flex-col gap-8">
              <QuestionField
                question="간단하게 자기소개 부탁드려요."
                answer={
                  <TextAreaField
                    value={application.standardResponses.selfIntroduction}
                    charCount={application.standardResponses.selfIntroduction.length}
                    maxCount={1500}
                  />
                }
              />

              <QuestionField
                question="함께 거주하는 가족 구성원을 알려주세요."
                answer={<InputField value={application.standardResponses.familyMembers} />}
              />

              <QuestionField
                question="모든 가족 구성원들이 입양에 동의하셨나요?"
                answer={
                  <div className="bg-white h-12 rounded-lg px-4 py-2 flex items-center gap-2">
                    <CheckboxField checked={application.standardResponses.allFamilyConsent} label="네" />
                  </div>
                }
              />

              <QuestionField
                question="본인을 포함한 모든 가족 구성원분들께서 알러지 검사를 마치셨나요?"
                answer={<InputField value={application.standardResponses.allergyTestInfo} />}
              />
            </div>

            {/* 구분선 */}
            <div className="h-px bg-[#E1E1E1]" />

            {/* 섹션 3: 집 비우는 시간 + 공간 소개 + 이전 반려동물 */}
            <div className="flex flex-col gap-8">
              <QuestionField
                question="평균적으로 집을 비우는 시간은 얼마나 되나요?"
                answer={<InputField value={application.standardResponses.timeAwayFromHome} />}
              />

              <QuestionField
                question="아이와 함께 지내게 될 공간을 소개해 주세요."
                answer={
                  <div className="flex flex-col gap-2.5">
                    <TextAreaField
                      value={application.standardResponses.livingSpaceDescription}
                      charCount={application.standardResponses.livingSpaceDescription.length}
                      maxCount={800}
                    />
                    <p className="text-xs text-[#888]">
                      아이들은 철장, 베란다, 야외 등 열악한 공간에서는 지낼 수 없어요
                    </p>
                  </div>
                }
              />

              <QuestionField
                question="현재 함께하는, 또는 이전에 함께했던 반려동물에 대해 알려주세요."
                answer={
                  <TextAreaField
                    value={application.standardResponses.previousPetExperience}
                    charCount={application.standardResponses.previousPetExperience.length}
                    maxCount={800}
                  />
                }
              />
            </div>

            {/* 구분선 */}
            <div className="h-px bg-[#E1E1E1]" />

            {/* 섹션 4: 케어 책임 + 치료비 */}
            <div className="flex flex-col gap-8">
              <QuestionField
                question="정기 예방접종·건강검진·훈련 등 기본 케어를 책임지고 해주실 수 있나요?"
                answer={
                  <div className="bg-white h-12 rounded-lg px-4 py-2 flex items-center gap-2">
                    <CheckboxField checked={application.standardResponses.canProvideBasicCare || false} label="네" />
                  </div>
                }
              />

              <QuestionField
                question="예상치 못한 질병이나 사고 등으로 치료비가 발생할 경우 감당 가능하신가요?"
                answer={
                  <div className="bg-white h-12 rounded-lg px-4 py-2 flex items-center gap-2">
                    <CheckboxField
                      checked={application.standardResponses.canAffordMedicalExpenses || false}
                      label="네"
                    />
                  </div>
                }
              />
            </div>

            {/* 구분선 */}
            <div className="h-px bg-[#E1E1E1]" />

            {/* 섹션 5: 마음에 두신 아이 + 입양 시기 */}
            <div className="flex flex-col gap-8">
              <QuestionField
                question="마음에 두신 아이가 있으신가요?"
                answer={
                  <div className="flex flex-col gap-2.5">
                    <DropdownField value="특징 직접 입력" />
                    <TextAreaField
                      value={application.standardResponses.preferredPetDescription || '답변답변답변'}
                      charCount={6}
                      maxCount={800}
                    />
                  </div>
                }
              />

              <QuestionField
                question="원하시는 입양 시기가 있나요?"
                answer={<InputField value={application.standardResponses.desiredAdoptionTiming || 'Input Text'} />}
              />
            </div>

            {/* 구분선 */}
            <div className="h-px bg-[#E1E1E1]" />

            {/* 섹션 6: 마지막 질문 */}
            <QuestionField
              question="마지막으로 궁금하신 점이나 남기시고 싶으신 말씀이 있나요?"
              answer={
                <TextAreaField
                  value={application.standardResponses.additionalNotes || '답변답변답변'}
                  charCount={6}
                  maxCount={800}
                />
              }
            />
          </div>
        </div>

        {/* 하단 구분선 */}
        <div className="h-px bg-[#E1E1E1]" />

        {/* 하단 버튼 영역 */}
        <div className="bg-white px-6 py-4 rounded-b-2xl flex items-center justify-between">
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
            <Button
              disabled
              className="h-9 px-4 bg-[#E1E1E1] text-[#A0A0A0] text-sm font-medium rounded min-w-[72px] cursor-not-allowed ml-auto"
            >
              상담 완료
            </Button>
          ) : (
            <Button
              className="h-9 px-4 bg-[#4F3B2E] hover:bg-[#3E2F23] text-white text-sm font-medium rounded min-w-[72px]"
              onClick={handleCompleteConsultation}
              disabled={completeConsultationMutation.isPending}
            >
              상담 완료
            </Button>
          )}
        </div>
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

// 드롭다운 필드
const DropdownField = ({ value }: { value: string }) => (
  <div className="bg-white h-12 rounded-lg px-4 py-3 flex items-center justify-between">
    <p className="text-base text-[#4F3B2E]">{value}</p>
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className="rotate-90">
      <path d="M1 1L4 4L7 1" stroke="#4F3B2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
