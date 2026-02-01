import PreviousPetsField from './previous-pets-field';
import LivingSpaceField from './living-space-field';
import TextareaWithCount from '../shared/textarea-with-count';
import { QuestionBlock } from '../shared/question-block';
import { SectionHeader } from '../shared/section-header';
import { LIVING_ENVIRONMENT } from '@/constants/counsel-form';

export default function LivingEnvironmentSection() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <SectionHeader title={LIVING_ENVIRONMENT.sectionTitle} subtitle={LIVING_ENVIRONMENT.description} />
      <QuestionBlock title="평균적으로 집을 비우는 시간은 얼마나 되나요?">
        <TextareaWithCount
          name="awayTime"
          placeholder="출퇴근·외출 시간을 포함해 하루 중 집을 비우는 시간"
          maxLength={200}
        />
      </QuestionBlock>
      <LivingSpaceField />
      <PreviousPetsField />
    </div>
  );
}
