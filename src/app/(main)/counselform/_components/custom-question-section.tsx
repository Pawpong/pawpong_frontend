'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CounselFormData } from '../_types/counsel';
import type { BreederApplicationFormDto } from '@/app/api/breeder';

interface CustomQuestionSectionProps {
  customQuestions: BreederApplicationFormDto['customQuestions'];
}

/**
 * 브리더 커스텀 질문 섹션
 */
export function CustomQuestionSection({ customQuestions }: CustomQuestionSectionProps) {
  const form = useFormContext<CounselFormData>();

  if (!customQuestions || customQuestions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-[0.38rem] w-full mb-8">
        <h2 className="text-body-l font-semibold text-grayscale-gray6 w-full">브리더 추가 질문</h2>
        <p className="text-body-s font-medium text-grayscale-gray5 w-full">
          브리더가 개별적으로 확인하고 싶은 사항에 답변해 주세요.
        </p>
      </div>

      <div className="flex flex-col gap-8 w-full">
        {customQuestions.map((question) => {
          const fieldName = `customQuestionResponses.${question.id}` as keyof CounselFormData;
          const value = form.watch(fieldName as any) || '';

          return (
            <div key={question.id} className="flex flex-col gap-3 items-start w-full">
              <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </h2>

              {question.type === 'textarea' ? (
                <Textarea
                  placeholder={question.placeholder || '답변을 입력해주세요'}
                  maxLength={question.options?.[0] ? parseInt(question.options[0]) : undefined}
                  value={value as string}
                  onChange={(e) => {
                    form.setValue(fieldName as any, e.target.value, { shouldDirty: true });
                  }}
                  className="min-h-[100px]"
                />
              ) : (
                <Input
                  placeholder={question.placeholder || '답변을 입력해주세요'}
                  value={value as string}
                  onChange={(e) => {
                    form.setValue(fieldName as any, e.target.value, { shouldDirty: true });
                  }}
                  className="h-12"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
