import { dynamicClient } from '@/utils/dynamic-client';

// 기존 섹션들은 counselform에서 import
const PrivacyAndBasicInfoSection = dynamicClient(
  () => import('@/app/(main)/counselform/_components/sections/privacy-and-basic-info-section'),
);

const IntroductionAndFamilySection = dynamicClient(
  () => import('@/app/(main)/counselform/_components/sections/introduction-and-family-section'),
);

const LivingEnvironmentSection = dynamicClient(
  () => import('@/app/(main)/counselform/_components/sections/living-environment-section'),
);

const CareResponsibilitySection = dynamicClient(
  () => import('@/app/(main)/counselform/_components/sections/care-responsibility-section'),
);

const PetSelectionSection = dynamicClient(
  () => import('@/app/(main)/counselform/_components/sections/pet-selection-section'),
);

// 새로운 섹션만 로컬에 유지
const BreederAdditionalQuestionSection = dynamicClient(() => import('./sections/breeder-additional-question-section'));

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
    id: 'breeder-additional-question',
    Component: BreederAdditionalQuestionSection,
  },
];
