'use client';

import type { HTMLAttributes } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import type { CounselFormData } from '../../_types/counsel';

type StringFieldName = {
  [K in keyof CounselFormData]: CounselFormData[K] extends string ? K : never;
}[keyof CounselFormData];

type Props = {
  name: StringFieldName;
  placeholder: string;
  type?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  className?: string;
  onChangeTransform?: (value: string) => string;
};

export default function InputField({
  name,
  placeholder,
  type,
  inputMode,
  maxLength,
  className,
  onChangeTransform,
}: Props) {
  const { control } = useFormContext<CounselFormData>();
  const defaultClassName = 'overflow-hidden text-ellipsis whitespace-nowrap';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          type={type}
          placeholder={placeholder}
          inputMode={inputMode}
          maxLength={maxLength}
          className={className ?? defaultClassName}
          onChange={(e) => {
            const value = onChangeTransform ? onChangeTransform(e.target.value) : e.target.value;
            field.onChange(value);
          }}
        />
      )}
    />
  );
}
