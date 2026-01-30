import { dynamicClient } from '@/utils/dynamic-client';

const PrivacyAndBasicInfoSection = dynamicClient(() =>
  import('./sections/privacy-and-basic-info-section'),
);

const IntroductionAndFamilySection = dynamicClient(() =>
  import('./sections/introduction-and-family-section'),
);

const LivingEnvironmentSection = dynamicClient(() =>
  import('./sections/living-environment-section'),
);

const CareResponsibilitySection = dynamicClient(() =>
  import('./sections/care-responsibility-section'),
);

const PetSelectionSection = dynamicClient(() =>
  import('./sections/pet-selection-section'),
);

const AdditionalMessageSection = dynamicClient(() =>
  import('./sections/additional-message-section'),
);

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
