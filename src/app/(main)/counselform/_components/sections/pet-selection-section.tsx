import AdoptionTimingField from './adoption-timing-field';
import PetDropdownField from './pet-dropdown-field';
import PreferredPetDetailField from './preferred-pet-detail-field';
import { QuestionBlock } from '../shared/question-block';

type Props = {
  availablePets: Array<{ petId: string; name: string; breed: string; gender: 'male' | 'female' }>;
};

export function PetSelectionSection({ availablePets }: Props) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <QuestionBlock title="마음에 두신 아이가 있으신가요?">
        <PetDropdownField availablePets={availablePets} />
        <PreferredPetDetailField />
      </QuestionBlock>
      <QuestionBlock title="원하시는 입양 시기가 있나요?">
        <AdoptionTimingField />
      </QuestionBlock>
    </div>
  );
}
