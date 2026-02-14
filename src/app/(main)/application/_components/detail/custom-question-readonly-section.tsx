'use client';

import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import type { CustomQuestionResponse } from '../../_types/application.types';

interface CustomQuestionReadonlySectionProps {
  customResponses: CustomQuestionResponse[];
}

/**
 * 브리더 커스텀 질문 읽기 전용 섹션 (받은 신청서 모달용)
 */
export function CustomQuestionReadonlySection({ customResponses }: CustomQuestionReadonlySectionProps) {
  if (!customResponses || customResponses.length === 0) {
    return null;
  }

  return (
    <>
      <Separator className="bg-[#E1E1E1] my-[60px]" />
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-[0.38rem] w-full mb-8">
          <h2 className="text-body-l font-semibold text-grayscale-gray6 w-full">브리더 추가 질문</h2>
          <p className="text-body-s font-medium text-grayscale-gray5 w-full">
            브리더가 개별적으로 확인하고 싶은 사항에 답변해 주세요.
          </p>
        </div>

        <div className="flex flex-col gap-8 w-full">
          {customResponses.map((response, index) => (
            <div key={response.questionId || index} className="flex flex-col gap-3 items-start w-full">
              <h2 className="text-body-s font-semibold text-[#545454] w-full">{response.questionLabel}</h2>

              {response.questionType === 'textarea' ? (
                <Textarea
                  value={response.answer || ''}
                  readOnly
                  className="min-h-[100px] bg-white rounded-lg"
                  wrapperClassName="bg-white rounded-lg"
                />
              ) : (
                <Input value={response.answer || ''} readOnly className="h-12 bg-white rounded-lg" />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
