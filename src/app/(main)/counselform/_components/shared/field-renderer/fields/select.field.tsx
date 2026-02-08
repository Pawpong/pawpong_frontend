'use client';

import { Input } from '@/components/ui/input';
import type { QuestionConfig } from '../../../../_constants/counsel-questions.constants';

/**
 * SelectField - Select 타입 필드 렌더링
 */
export function SelectEditable({ question }: { question: QuestionConfig }) {
  // TODO: Select 컴포넌트 구현 필요 시 추가
  return <div>Select field (not implemented)</div>;
}

export function SelectReadonly({
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
      className={`rounded-lg ${bgClass}`}
    />
  );
}

export function SelectView({ value }: { value?: any }) {
  return <p className="text-body-s text-grayscale-gray6">{value || ''}</p>;
}
