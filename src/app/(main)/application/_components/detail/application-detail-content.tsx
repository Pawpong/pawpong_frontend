'use client';

import { Separator } from '@/components/ui/separator';
import { CounselSection } from '@/app/(main)/counselform/_components/shared/counsel-section';
import { COUNSEL_SECTIONS } from '@/app/(main)/counselform/_constants/counsel-questions.constants';
import { CustomQuestionReadonlySection } from './custom-question-readonly-section';
import type { CounselFormData } from '@/app/(main)/counselform/_types/counsel';
import type { CustomQuestionResponse } from '../../_types/application.types';
import { formatPhoneNumber } from '@/utils/phone';

interface ApplicationDetailContentProps {
  formData: CounselFormData;
  customResponses?: CustomQuestionResponse[];
  separatorClassName?: string;
}

/**
 * 신청 내역 모달의 공통 콘텐츠 컴포넌트
 * 상담 내용 UI는 완전히 동일하므로 공통화
 */
export function ApplicationDetailContent({
  formData,
  customResponses,
  separatorClassName = 'bg-[#E1E1E1] my-[60px]',
}: ApplicationDetailContentProps) {
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
            {!isLast && <Separator className={separatorClassName} />}
          </div>
        );
      })}
      {/* 브리더 커스텀 질문 섹션 */}
      {customResponses && customResponses.length > 0 && (
        <>
          <CustomQuestionReadonlySection customResponses={customResponses} />
        </>
      )}
    </div>
  );
}
