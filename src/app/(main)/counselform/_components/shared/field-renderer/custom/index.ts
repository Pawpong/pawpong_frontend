import { BasicInfoEditable, BasicInfoReadonly, BasicInfoView } from './basic-info.field';
import { PetSelectionEditable, PetSelectionReadonly, PetSelectionView } from './pet-selection.field';

/**
 * Custom 필드 컴포넌트 맵
 */
export const customEditableMap = {
  'pet-selection': PetSelectionEditable,
  'basic-info': BasicInfoEditable,
} as const;

export const customReadonlyMap = {
  'pet-selection': PetSelectionReadonly,
  'basic-info': BasicInfoReadonly,
} as const;

export const customViewMap = {
  'pet-selection': PetSelectionView,
  'basic-info': BasicInfoView,
} as const;
