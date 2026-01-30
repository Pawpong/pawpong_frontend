import IntroductionField from './introduction-field';
import InputField from '../shared/input-field';
import { CheckboxField } from '../shared/checkbox-field';
import { QuestionBlock } from '../shared/question-block';

export default function IntroductionAndFamilySection() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <IntroductionField />
      <QuestionBlock title="함께 거주하는 가족 구성원을 알려주세요.">
        <InputField name="familyMembers" placeholder="인원 수, 관계, 연령대 등" />
      </QuestionBlock>
      <QuestionBlock title="모든 가족 구성원들이 입양에 동의하셨나요?">
        <CheckboxField name="familyAgreement" label="네" />
      </QuestionBlock>
      <QuestionBlock title="본인을 포함한 모든 가족 구성원분들께서 알러지 검사를 마치셨나요?">
        <InputField name="allergyCheck" placeholder="알러지 검사 여부와 결과(유무), 혹은 향후 계획" />
      </QuestionBlock>
    </div>
  );
}
