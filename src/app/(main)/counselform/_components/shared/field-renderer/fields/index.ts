import type { ComponentType } from 'react';
import { InputEditable, InputReadonly, InputView } from './input.field';
import { TextareaEditable, TextareaReadonly, TextareaView } from './textarea.field';
import { CheckboxEditable, CheckboxReadonly, CheckboxView } from './checkbox.field';
import { SelectEditable, SelectReadonly, SelectView } from './select.field';
import type { QuestionType, QuestionConfig } from '../../../../_constants/counsel-questions.constants';

/**
 * 필드 컴포넌트의 props 타입
 */
type EditableFieldProps = { question: QuestionConfig };
type ReadonlyFieldProps = {
  question: QuestionConfig;
  value?: string | boolean | string[] | number | Record<string, unknown>;
  readonlyVariant?: 'default' | 'white';
};
type ViewFieldProps = {
  question: QuestionConfig;
  value?: string | boolean | string[] | number | Record<string, unknown>;
};

/**
 * 타입별 필드 컴포넌트 맵
 */
export const editableFieldMap: Partial<Record<QuestionType, ComponentType<EditableFieldProps>>> = {
  input: InputEditable,
  textarea: TextareaEditable,
  checkbox: CheckboxEditable,
  select: SelectEditable,
} as const;

export const readonlyFieldMap: Partial<Record<QuestionType, ComponentType<ReadonlyFieldProps>>> = {
  input: InputReadonly,
  textarea: TextareaReadonly,
  checkbox: CheckboxReadonly,
  select: SelectReadonly,
} as const;

export const viewFieldMap: Partial<Record<QuestionType, ComponentType<ViewFieldProps>>> = {
  input: InputView,
  textarea: TextareaView,
  checkbox: CheckboxView,
  select: SelectView,
} as const;
