import TextareaWithCount from '../shared/textarea-with-count';
import { QuestionBlock } from '../shared/question-block';

export default function IntroductionField() {
  return (
    <QuestionBlock title="간단하게 자기소개 부탁드려요.">
      <TextareaWithCount name="introduction" placeholder="성별, 연령대, 거주지, 결혼 계획, 생활 패턴 등" />
    </QuestionBlock>
  );
}
