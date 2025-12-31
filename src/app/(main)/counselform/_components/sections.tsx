import { AdditionalMessageSection } from './sections/additional-message-section';
import { CareResponsibilitySection } from './sections/care-responsibility-section';
import { IntroductionAndFamilySection } from './sections/introduction-and-family-section';
import { LivingEnvironmentSection } from './sections/living-environment-section';
import { PetSelectionSection } from './sections/pet-selection-section';
import { PrivacyAndBasicInfoSection } from './sections/privacy-and-basic-info-section';

export const COUNSEL_FORM_SECTIONS = [
  {
    id: 'privacy-and-basic-info',
    Component: PrivacyAndBasicInfoSection,
  },
  {
    id: 'introduction-and-family',
    Component: IntroductionAndFamilySection,
  },
  {
    id: 'living-environment',
    Component: LivingEnvironmentSection,
  },
  {
    id: 'care-responsibility',
    Component: CareResponsibilitySection,
  },
  {
    id: 'pet-selection',
    Component: PetSelectionSection,
  },
  {
    id: 'additional-message',
    Component: AdditionalMessageSection,
  },
];
