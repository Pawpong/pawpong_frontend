import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CounselFormData {
  // 개인정보 동의
  privacyAgreement: boolean;
  // 기본 정보
  name: string;
  phone: string;
  email: string;
  // 자기소개
  introduction: string;

  // 가족 구성원
  familyMembers: string;
  familyAgreement: boolean;

  // 알러지 검사
  allergyCheck: string;

  // 생활 패턴
  awayTime: string;
  livingSpace: string;
  previousPets: string;

  // 케어 관련
  basicCare: boolean;
  medicalExpense: boolean;

  // 선택 사항
  interestedAnimal: string;
  interestedAnimalDetails: string;
  adoptionTiming: string;
  additionalMessage: string;
}

interface CounselFormStore {
  counselFormData: CounselFormData | null;
  setCounselFormData: (data: CounselFormData) => void;
  clearCounselFormData: () => void;
}

export const useCounselFormStore = create<CounselFormStore>()(
  persist(
    (set) => ({
      counselFormData: null,
      setCounselFormData: (data) => set({ counselFormData: data }),
      clearCounselFormData: () => set({ counselFormData: null }),
    }),
    {
      name: 'counsel-form-storage',
    },
  ),
);
