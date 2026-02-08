'use client';

import { Input } from '@/components/ui/input';
import InputField from '../../input-field';
import { BASIC_INFO_FIELDS } from '../../../../_constants/counsel-questions.constants';
import { formatPhoneNumber } from '@/utils/phone';

/**
 * BasicInfoField - 기본 정보 필드 (이름, 전화, 이메일)
 */
export function BasicInfoEditable({ onFormatPhone }: { onFormatPhone?: (value: string) => string }) {
  const formatPhoneFn = onFormatPhone || formatPhoneNumber;
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-3 items-start w-full">
        {BASIC_INFO_FIELDS.map((field) => (
          <InputField
            key={field.name}
            {...field}
            onChangeTransform={field.name === 'phone' ? formatPhoneFn : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export function BasicInfoReadonly({
  value,
  onFormatPhone,
  readonlyVariant = 'default',
}: {
  value?: any;
  onFormatPhone?: (value: string) => string;
  readonlyVariant?: 'default' | 'white';
}) {
  const basicInfo = value || {};
  const formatPhoneFn = onFormatPhone || formatPhoneNumber;
  const bgClass = readonlyVariant === 'white' ? 'bg-white' : 'bg-[rgba(255,255,255,0.40)]';

  return (
    <div className="flex flex-col gap-3 items-start w-full">
      {BASIC_INFO_FIELDS.map((field) => {
        const fieldValue =
          field.name === 'phone' && basicInfo[field.name] ? formatPhoneFn(basicInfo[field.name]) : basicInfo[field.name] || '';
        return (
          <Input
            key={field.name}
            value={fieldValue}
            readOnly
            placeholder={field.placeholder}
            type={field.type}
            className={`overflow-hidden text-ellipsis whitespace-nowrap rounded-lg ${bgClass}`}
          />
        );
      })}
    </div>
  );
}

export function BasicInfoView({
  value,
  onFormatPhone,
}: {
  value?: any;
  onFormatPhone?: (value: string) => string;
}) {
  const basicInfo = value || {};
  const formatPhoneFn = onFormatPhone || formatPhoneNumber;

  return (
    <div className="flex flex-col gap-2.5">
      {BASIC_INFO_FIELDS.map((field) => {
        const fieldValue = basicInfo[field.name];
        if (!fieldValue) return null;
        const displayValue = field.name === 'phone' ? formatPhoneFn(fieldValue) : fieldValue;
        return (
          <p key={field.name} className="text-body-s text-grayscale-gray6">
            {field.placeholder}: {displayValue}
          </p>
        );
      })}
    </div>
  );
}
