'use client';

import type { QuestionConfig, QuestionMode } from '../../../_constants/counsel-questions.constants';
import { ModeRenderer } from './renderers/mode.renderer';

export interface FieldRendererProps {
  question: QuestionConfig;
  mode: QuestionMode;
  value?: any;
  availablePets?: Array<{ petId: string; name: string; breed: string; gender: 'male' | 'female' }>;
  onFormatPhone?: (value: string) => string;
  readonlyVariant?: 'default' | 'white';
}

/**
 * FieldRenderer - mode 라우터
 * mode에 따라 적절한 렌더러로 분기
 */
export function FieldRenderer({
  question,
  mode,
  value,
  availablePets,
  onFormatPhone,
  readonlyVariant = 'default',
}: FieldRendererProps) {
  return (
    <ModeRenderer
      question={question}
      mode={mode}
      value={value}
      availablePets={availablePets}
      onFormatPhone={onFormatPhone}
      readonlyVariant={readonlyVariant}
    />
  );
}
