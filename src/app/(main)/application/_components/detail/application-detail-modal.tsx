'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getReceivedApplicationDetail } from '@/api/breeder';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Separator } from '@/components/ui/separator';
import { ApplicationDetailContent } from './application-detail-content';
import { ApplicationStatusBadge } from '../shared/application-status-badge';
import { ApplicationDetailStates } from './application-detail-states';
import { mapToCounselFormData } from '../../_utils/form-data-mapper';
import type { CounselFormData } from '@/app/(main)/counselform/_types/counsel';
import { useUpdateApplicationStatus } from '../../_hooks/use-update-application-status';

interface ApplicationDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
}

const ApplicationDetailModal = ({ open, onOpenChange, applicationId }: ApplicationDetailModalProps) => {
  const { data: application, isLoading, isError } = useQuery({
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

  // application 데이터를 CounselFormData 형식으로 변환
  const formData: CounselFormData | null = application && !isLoading ? mapToCounselFormData(application) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${dialogContentClass} p-0 gap-0 bg-white flex flex-col`}>
        <VisuallyHidden>
          <DialogTitle>입양 신청 상세</DialogTitle>
        </VisuallyHidden>

        {/* 상단 구분선 */}
        <Separator className="bg-[#E1E1E1]" />

        {/* 스크롤 영역 */}
        <div className="overflow-y-auto bg-[#F6F6EA] px-6 py-5 flex-1">
          <ApplicationDetailStates isLoading={isLoading} isError={isError} />

          {/* 정상 상태 */}
          {!isLoading && !isError && application && (
            <>
              {/* 헤더: 입양자 닉네임 + 배지 (브리더용) */}
              <div className="flex flex-col gap-2 mb-8">
                <h2 className="text-xl font-semibold text-[#4F3B2E]">{application.adopterName}</h2>
                <div className="flex items-center gap-2.5">
                  <ApplicationStatusBadge status={application.status} />
                  <span className="text-base text-[#888]">
                    {new Date(application.appliedAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>

              {/* 구분선 */}
              <Separator className="bg-[#E1E1E1] mb-8" />

              {/* 공통 상담 내용 */}
              {formData && (
                <ApplicationDetailContent
                  formData={formData}
                  customResponses={application?.customResponses}
                  separatorClassName="bg-[#E1E1E1] my-[60px]"
                />
              )}
            </>
          )}
        </div>

        {/* 하단 구분선 */}
        <Separator className="bg-[#E1E1E1]" />

        {/* 하단 버튼 영역 (브리더용) */}
        {application && (
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailModal;
