'use client';

import type { QuestionConfig, QuestionMode } from '../../../../_constants/counsel-questions.constants';
import { editableFieldMap, readonlyFieldMap, viewFieldMap } from '../fields';
import { customEditableMap, customReadonlyMap, customViewMap } from '../custom';

interface ModeRendererProps {
  question: QuestionConfig;
  mode: QuestionMode;
  value?: any;
  availablePets?: Array<{ petId: string; name: string; breed: string; gender: 'male' | 'female' }>;
  onFormatPhone?: (value: string) => string;
  readonlyVariant?: 'default' | 'white';
}

/**
 * ModeRenderer - mode에 따라 적절한 map과 컴포넌트를 선택하여 렌더링
 */
export function ModeRenderer({
  question,
  mode,
  value,
  availablePets,
  onFormatPhone,
  readonlyVariant = 'default',
}: ModeRendererProps) {
  // Custom 컴포넌트 처리
  if (question.type === 'custom' && question.customComponent) {
    const componentType = question.customComponent as keyof typeof customEditableMap;

    switch (mode) {
      case 'editable': {
        const CustomComponent = customEditableMap[componentType];
        if (CustomComponent) {
          return <CustomComponent availablePets={availablePets} onFormatPhone={onFormatPhone} />;
        }
        break;
      }
      case 'readonly': {
        const CustomComponent = customReadonlyMap[componentType];
        if (CustomComponent) {
          return <CustomComponent value={value} onFormatPhone={onFormatPhone} readonlyVariant={readonlyVariant} />;
        }
        break;
      }
      case 'view': {
        const CustomComponent = customViewMap[componentType];
        if (CustomComponent) {
          return <CustomComponent value={value} onFormatPhone={onFormatPhone} />;
        }
        break;
      }
    }
  }

  // 일반 타입 필드 처리
  switch (mode) {
    case 'editable': {
      const FieldComponent = editableFieldMap[question.type];
      if (FieldComponent) {
        return <FieldComponent question={question} />;
      }
      break;
    }
    case 'readonly': {
      const FieldComponent = readonlyFieldMap[question.type];
      if (FieldComponent) {
        return <FieldComponent question={question} value={value} readonlyVariant={readonlyVariant} />;
      }
      break;
    }
    case 'view': {
      const FieldComponent = viewFieldMap[question.type];
      if (FieldComponent) {
        return <FieldComponent question={question} value={value} />;
      }
      break;
    }
  }

  return null;
}
