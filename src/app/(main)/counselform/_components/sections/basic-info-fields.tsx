import InputField from '../shared/input-field';
import type { BasicInfoFieldConfig } from '../shared/basic-info.config';
import { BASIC_INFO_FIELDS } from '../shared/basic-info.config';

export default function BasicInfoFields({ onFormatPhone }: { onFormatPhone: (value: string) => string }) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-3 items-start w-full">
        {BASIC_INFO_FIELDS.map((field: BasicInfoFieldConfig) => (
          <InputField
            key={field.name}
            {...field}
            onChangeTransform={field.name === 'phone' ? onFormatPhone : undefined}
          />
        ))}
      </div>
    </div>
  );
}
