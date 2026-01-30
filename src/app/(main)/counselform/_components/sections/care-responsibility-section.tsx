import { CheckboxField } from '../shared/checkbox-field';
import { QuestionBlock } from '../shared/question-block';

export default function CareResponsibilitySection() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <QuestionBlock title="정기 예방접종·건강검진·훈련 등 기본 케어를 책임지고 해주실 수 있나요?">
        <CheckboxField name="basicCare" label="네" />
      </QuestionBlock>
      <QuestionBlock title="예상치 못한 질병이나 사고 등으로 치료비가 발생할 경우 감당 가능하신가요?">
        <CheckboxField name="medicalExpense" label="네" />
      </QuestionBlock>
    </div>
  );
}

