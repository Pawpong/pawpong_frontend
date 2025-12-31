'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import type { CounselFormData } from '../../_types/counsel';

/**
 * CounselFormData 중 string 타입 필드만 추출
 */
type StringFieldName = {
  [K in keyof CounselFormData]: CounselFormData[K] extends string ? K : never;
}[keyof CounselFormData];

interface Props {
  name: StringFieldName;
  placeholder?: string;
  maxLength?: number;
}

export default function TextareaWithCount({ name, placeholder, maxLength = 800 }: Props) {
  const { control, watch } = useFormContext<CounselFormData>();
  const value = watch(name) ?? '';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Textarea
          {...field}
          value={field.value ?? ''}
          placeholder={placeholder}
          maxLength={maxLength}
          showLength={value.length > 0}
          currentLength={value.length}
        />
      )}
    />
  );
}
