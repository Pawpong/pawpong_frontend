import type { ComponentType } from 'react';
import { InputEditable, InputReadonly, InputView } from './input.field';
import { TextareaEditable, TextareaReadonly, TextareaView } from './textarea.field';
import { CheckboxEditable, CheckboxReadonly, CheckboxView } from './checkbox.field';
import { SelectEditable, SelectReadonly, SelectView } from './select.field';
import type { QuestionType } from '../../../../_constants/counsel-questions.constants';

/**
 * 타입별 필드 컴포넌트 맵
 */
export const editableFieldMap: Partial<Record<QuestionType, ComponentType<any>>> = {
  input: InputEditable,
  textarea: TextareaEditable,
  checkbox: CheckboxEditable,
  select: SelectEditable,
} as const;

export const readonlyFieldMap: Partial<Record<QuestionType, ComponentType<any>>> = {
  input: InputReadonly,
  textarea: TextareaReadonly,
  checkbox: CheckboxReadonly,
  select: SelectReadonly,
} as const;

export const viewFieldMap: Partial<Record<QuestionType, ComponentType<any>>> = {
  input: InputView,
  textarea: TextareaView,
  checkbox: CheckboxView,
  select: SelectView,
} as const;
