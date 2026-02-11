'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxField } from '../../checkbox-field';
import type { QuestionConfig } from '../../../../_constants/counsel-questions.constants';

/**
 * CheckboxField - Checkbox 타입 필드 렌더링
 */
export function CheckboxEditable({ question }: { question: QuestionConfig }) {
  return <CheckboxField name={question.id as any} label={question.checkboxLabel || '네'} />;
}

export function CheckboxReadonly({
  question,
  value,
  readonlyVariant = 'default',
}: {
  question: QuestionConfig;
  value?: any;
  readonlyVariant?: 'default' | 'white';
}) {
  const bgClass = readonlyVariant === 'white' ? 'bg-white' : 'bg-[rgba(255,255,255,0.40)]';

  // readonlyVariant="white"일 때는 갈색 배경 유지 (#4F3B2E)
  // readonlyVariant="default"일 때는 회색 배경 적용
  const checkboxClassName =
    readonlyVariant === 'white'
      ? value
        ? 'disabled:data-[state=checked]:!bg-[#4F3B2E] disabled:data-[state=checked]:!border-[#4F3B2E] disabled:data-[state=checked]:!text-white'
        : undefined
      : value
        ? 'disabled:data-[state=checked]:!bg-[var(--color-grayscale-gray1)] disabled:data-[state=checked]:!border-[var(--color-status-disabled)]'
        : 'disabled:!bg-[var(--color-grayscale-gray1)] disabled:!border-[var(--color-status-disabled)]';

  // readonlyVariant="white"일 때는 텍스트 색상을 더 어둡게
  const textColorClass = readonlyVariant === 'white' ? 'text-grayscale-gray6' : 'text-grayscale-gray4';

  return (
    <label className={`${bgClass} flex gap-2 h-12 w-full items-center px-4 py-2 rounded-lg cursor-pointer`}>
      <Checkbox checked={!!value} disabled className={checkboxClassName} />
      <span className={`text-body-s font-medium ${textColorClass}`}>{question.checkboxLabel || '네'}</span>
    </label>
  );
}

export function CheckboxView({ question, value }: { question: QuestionConfig; value?: any }) {
  return <p className="text-body-s text-grayscale-gray6">{value ? question.checkboxLabel || '네' : ''}</p>;
}
