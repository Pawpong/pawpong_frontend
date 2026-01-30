import AdditionalMessageField from '../shared/additional-message-field';
import { QuestionBlock } from '../shared/question-block';

export default function AdditionalMessageSection() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <QuestionBlock title="마지막으로 궁금하신 점이나 남기시고 싶으신 말씀이 있나요?">
        <AdditionalMessageField />
      </QuestionBlock>
    </div>
  );
}
