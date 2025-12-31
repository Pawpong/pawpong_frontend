import TextareaWithCount from '../shared/textarea-with-count';
import { QuestionBlock } from '../shared/question-block';

export default function PreviousPetsField() {
  return (
    <QuestionBlock title="이전에 함께했던 반려동물에 대해 알려주세요.">
      <TextareaWithCount name="previousPets" placeholder="반려동물의 품종, 성격, 함께한 기간, 이별 사유 등" />
    </QuestionBlock>
  );
}
