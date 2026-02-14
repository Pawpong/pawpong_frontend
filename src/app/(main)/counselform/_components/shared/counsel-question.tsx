'use client';

import { FieldRenderer } from './field-renderer';
import type { QuestionConfig, QuestionMode } from '../../_constants/counsel-questions.constants';
import type { CounselFormData } from '../../_types/counsel';
import { InfoRow } from '../sections/info-row';

interface CounselQuestionProps {
  question: QuestionConfig;
  mode: QuestionMode;
  value?: string | boolean | string[] | number | Record<string, unknown>;
  availablePets?: Array<{ petId: string; name: string; breed: string; gender: 'male' | 'female' }>;
  onFormatPhone?: (value: string) => string;
  formData?: CounselFormData | Record<string, unknown>;
  readonlyVariant?: 'default' | 'white';
}

/**
 * CounselQuestion - 질문 UI 껍데기만 담당
 * - 질문 제목 렌더링
 * - 필수 여부 표시
 * - 레이아웃 / 간격 관리
 * - 입력 컴포넌트는 FieldRenderer에 위임
 */
export function CounselQuestion({
  question,
  mode,
  value,
  availablePets,
  onFormatPhone,
  formData,
  readonlyVariant = 'default',
}: CounselQuestionProps) {
  // dependsOn 조건 확인
  if (question.dependsOn && formData) {
    const dependentValue = formData[question.dependsOn.field];
    if (dependentValue !== question.dependsOn.value) {
      return null;
    }
  }

  // 제목이 없는 질문 (예: basic-info)은 제목 없이 렌더링
  if (!question.label) {
    return (
      <div className="flex flex-col gap-3 items-start w-full">
        <FieldRenderer
          question={question}
          mode={mode}
          value={value}
          availablePets={availablePets}
          onFormatPhone={onFormatPhone}
          readonlyVariant={readonlyVariant}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 items-start w-full">
      {/* 질문 제목 + 필수 여부 */}
      <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </h2>

      {/* InfoRows (개인정보 동의 등) */}
      {question.infoRows && question.infoRows.length > 0 && (
        <div className="flex flex-col gap-2 pl-1.5">
          {question.infoRows.map((text, index) => (
            <InfoRow key={index} text={text} />
          ))}
        </div>
      )}

      {/* FieldRenderer - 입력 컴포넌트 분기 */}
      <FieldRenderer
        question={question}
        mode={mode}
        value={value}
        availablePets={availablePets}
        onFormatPhone={onFormatPhone}
        readonlyVariant={readonlyVariant}
      />

      {/* SubDescription */}
      {question.subDescription && (
        <p className="text-caption font-medium text-grayscale-gray5 mt-2.5">{question.subDescription}</p>
      )}
    </div>
  );
}
