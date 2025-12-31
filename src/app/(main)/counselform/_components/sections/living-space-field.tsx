import TextareaWithCount from '../shared/textarea-with-count';
import { QuestionBlock } from '../shared/question-block';

export default function LivingSpaceField() {
  return (
    <QuestionBlock title="아이와 함께 지내게 될 공간을 소개해 주세요.">
      <div className="flex flex-col gap-2.5 items-start w-full">
        <TextareaWithCount
          name="livingSpace"
          placeholder="반려동물이 주로 생활할 공간(예: 거실 등)과 환경(크기, 구조 등)"
        />
        <p className="text-caption font-medium text-grayscale-gray5">
          아이들은 철장, 베란다, 야외 등 열악한 공간에서는 지낼 수 없어요
        </p>
      </div>
    </QuestionBlock>
  );
}
