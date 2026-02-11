export interface CounselFormData {
  // 동의
  privacyAgreement: boolean;

  // 기본 정보
  name: string;
  phone: string;
  email: string;

  // 자기소개 및 환경
  introduction: string;
  familyMembers: string;
  familyAgreement: boolean;
  allergyCheck: string;
  awayTime: string;
  livingSpace: string;
  previousPets: string;

  // 케어
  basicCare: boolean;
  medicalExpense: boolean;

  // 선택 사항
  interestedAnimal: string[];
  interestedAnimalDetails: string;
  adoptionTiming: string;
  additionalMessage: string;

  // 커스텀 질문 답변
  customQuestionResponses?: Record<string, string>;
}
