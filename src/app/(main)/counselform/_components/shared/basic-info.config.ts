import type { HTMLAttributes } from 'react';
import type { CounselFormData } from '../../_types/counsel';

type StringFieldName = {
  [K in keyof CounselFormData]: CounselFormData[K] extends string ? K : never;
}[keyof CounselFormData];

export type BasicInfoFieldConfig = {
  name: StringFieldName;
  placeholder: string;
  type?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
};

export const BASIC_INFO_FIELDS: BasicInfoFieldConfig[] = [
  {
    name: 'name',
    placeholder: '이름',
  },
  {
    name: 'phone',
    placeholder: '휴대폰 번호',
    inputMode: 'numeric',
    maxLength: 13,
  },
  {
    name: 'email',
    placeholder: '이메일 주소',
    type: 'email',
  },
];
