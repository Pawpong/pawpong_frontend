import BasicInfoFields from './basic-info-fields';
import { InfoRow } from './info-row';
import { CheckboxField } from '../shared/checkbox-field';
import { QuestionBlock } from '../shared/question-block';

type Props = {
  onFormatPhone: (value: string) => string;
};

export default function PrivacyAndBasicInfoSection({ onFormatPhone }: Props) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <QuestionBlock title="반려동물 입양 상담을 위한 개인정보 수집과 이용에 동의하시나요?">
        <div className="flex flex-col gap-2.5 w-full">
          <CheckboxField name="privacyAgreement" label="동의합니다" />
          <div className="flex flex-col gap-2 pl-1.5">
            <InfoRow text="수집하는 개인정보 항목: 이름, 연락처, 이메일주소 등" />
            <InfoRow text="수집 및 이용 목적: 입양자 상담 및 검토" />
            <InfoRow text="보유 및 이용기간: 상담 또는 입양 직후 폐기" />
          </div>
        </div>
      </QuestionBlock>
      <BasicInfoFields onFormatPhone={onFormatPhone} />
    </div>
  );
}
