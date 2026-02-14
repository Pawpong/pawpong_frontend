export type QuestionType = 'input' | 'textarea' | 'checkbox' | 'custom';

export interface ApplicationQuestion {
  id: string;
  question: string;
  type: QuestionType;
  maxCount?: number;
  label?: string;
  subDescription?: string;
  componentType?: 'preferred_pet'; // Special case identifier
}

export const APPLICATION_QUESTIONS: ApplicationQuestion[] = [
  {
    id: 'selfIntroduction',
    question: '간단하게 자기소개 부탁드려요.',
    type: 'textarea',
    maxCount: 1500,
  },
  {
    id: 'familyMembers',
    question: '함께 거주하는 가족 구성원을 알려주세요.',
    type: 'input',
  },
  {
    id: 'allFamilyConsent',
    question: '모든 가족 구성원들이 입양에 동의하셨나요?',
    type: 'checkbox',
    label: '네',
  },
  {
    id: 'allergyTestInfo',
    question: '본인을 포함한 모든 가족 구성원분들께서 알러지 검사를 마치셨나요?',
    type: 'input',
  },
  {
    id: 'timeAwayFromHome',
    question: '평균적으로 집을 비우는 시간은 얼마나 되나요?',
    type: 'input',
  },
  {
    id: 'livingSpaceDescription',
    question: '아이와 함께 지내게 될 공간을 소개해 주세요.',
    type: 'textarea',
    maxCount: 800,
    subDescription: '아이들은 철장, 베란다, 야외 등 열악한 공간에서는 지낼 수 없어요',
  },
  {
    id: 'previousPetExperience',
    question: '현재 함께하는, 또는 이전에 함께했던 반려동물에 대해 알려주세요.',
    type: 'textarea',
    maxCount: 800,
  },
  {
    id: 'canProvideBasicCare',
    question: '정기 예방접종·건강검진·훈련 등 기본 케어를 책임지고 해주실 수 있나요?',
    type: 'checkbox',
    label: '네',
  },
  {
    id: 'canAffordMedicalExpenses',
    question: '예상치 못한 질병이나 사고 등으로 치료비가 발생할 경우 감당 가능하신가요?',
    type: 'checkbox',
    label: '네',
  },
  {
    id: 'preferredPetDescription',
    question: '마음에 두신 아이가 있으신가요?',
    type: 'custom',
    componentType: 'preferred_pet',
    maxCount: 800,
  },
  {
    id: 'desiredAdoptionTiming',
    question: '원하시는 입양 시기가 있나요?',
    type: 'input',
  },
];
