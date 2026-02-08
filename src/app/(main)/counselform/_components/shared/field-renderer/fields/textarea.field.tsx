'use client';

import { Textarea } from '@/components/ui/textarea';
import TextareaWithCount from '../../textarea-with-count';
import type { QuestionConfig } from '../../../../_constants/counsel-questions.constants';

/**
 * TextareaField - Textarea 타입 필드 렌더링
 */
export function TextareaEditable({ question }: { question: QuestionConfig }) {
  return (
    <TextareaWithCount
      name={question.id as any}
      placeholder={question.placeholder}
      maxLength={question.maxLength}
    />
  );
}

export function TextareaReadonly({
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
    <Textarea
      value={value || ''}
      readOnly
      placeholder={question.placeholder}
      maxLength={question.maxLength}
      showLength={(value || '').length > 0}
      currentLength={(value || '').length}
      wrapperClassName={`${bgClass} rounded-lg`}
    />
  );
}

export function TextareaView({ value }: { value?: any }) {
  return <p className="text-body-s text-grayscale-gray6">{value || ''}</p>;
}
