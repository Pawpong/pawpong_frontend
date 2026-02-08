'use client';

import { Input } from '@/components/ui/input';
import InputField from '../../input-field';
import type { QuestionConfig } from '../../../../_constants/counsel-questions.constants';

/**
 * InputField - Input 타입 필드 렌더링
 */
export function InputEditable({ question }: { question: QuestionConfig }) {
  return (
    <InputField
      name={question.id as any}
      placeholder={question.placeholder || ''}
      className={question.id === 'adoptionTiming' ? 'h-12' : undefined}
    />
  );
}

export function InputReadonly({
  question,
  value,
  readonlyVariant = 'default',
}: {
  question: QuestionConfig;
  value?: any;
  readonlyVariant?: 'default' | 'white';
}) {
  const bgClass = readonlyVariant === 'white' ? 'bg-white' : 'bg-[rgba(255,255,255,0.40)]';
  return (
    <Input
      value={value || ''}
      readOnly
      placeholder={question.placeholder}
      className={`rounded-lg ${bgClass} ${question.id === 'adoptionTiming' ? 'h-12' : ''}`}
    />
  );
}

export function InputView({ value }: { value?: any }) {
  return <p className="text-body-s text-grayscale-gray6">{value || ''}</p>;
}
