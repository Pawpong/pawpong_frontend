'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import type { CounselFormData } from '../../_types/counsel';

interface CheckboxFieldProps {
  name: {
    [K in keyof CounselFormData]: CounselFormData[K] extends boolean ? K : never;
  }[keyof CounselFormData];
  label: string;
}

export function CheckboxField({ name, label }: CheckboxFieldProps) {
  const { control } = useFormContext<CounselFormData>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className="bg-white flex gap-2 h-12 w-full items-center px-4 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          <span className="text-body-s font-medium text-grayscale-gray6">{label}</span>
        </label>
      )}
    />
  );
}
