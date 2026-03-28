import type { CounselFormData } from '../_types/counsel';
import type { HTMLAttributes } from 'react';

/**
 * 질문 렌더링 모드
 */
export type QuestionMode = 'editable' | 'readonly' | 'view';

/**
 * 기본 정보 필드 타입
 */
type StringFieldName = {
  [K in keyof CounselFormData]: CounselFormData[K] extends string ? K : never;
}[keyof CounselFormData];

/**
 * 기본 정보 필드 설정
 */
export type BasicInfoFieldConfig = {
  name: StringFieldName;
  placeholder: string;
  type?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
};

/**
 * 기본 정보 필드 정의 (이름, 전화, 이메일)
 */
export const BASIC_INFO_FIELDS: BasicInfoFieldConfig[] = [
  {
    name: 'name',
    placeholder: '이름',
  },
  {
    name: 'phone',
    placeholder: '휴대폰 번호',
    inputMode: 'numeric',
    maxLength: 13,
  },
  {
    name: 'email',
    placeholder: '이메일 주소',
    type: 'email',
  },
];

/**
 * 질문 타입 정의
 */
export type QuestionType = 'input' | 'textarea' | 'checkbox' | 'select' | 'custom';

/**
 * 질문 필드 ID 타입 (CounselFormData의 키)
 */
export type QuestionFieldId = keyof CounselFormData;

/**
 * Select 옵션 타입
 */
export interface SelectOption {
  label: string;
  value: string;
}

/**
 * 질문 정의 인터페이스
 */
export interface QuestionConfig {
  id: QuestionFieldId;
  label: string; // 질문 텍스트 (기존 title에서 변경)
  type: QuestionType;
  required?: boolean;
  placeholder?: string;
  maxLength?: number; // textarea 전용
  options?: SelectOption[]; // select 전용
  checkboxLabel?: string; // checkbox용 (기존 label에서 변경)
  subDescription?: string; // 추가 설명 텍스트
  infoRows?: string[]; // 개인정보 동의 같은 경우의 정보 행들
  customComponent?: string; // 'pet-selection', 'basic-info' 등 특수 컴포넌트
  dependsOn?: {
    field: QuestionFieldId;
    value: string | boolean | string[] | number; // 이 값일 때만 표시
  };
}

/**
 * 섹션 정의 인터페이스
 */
export interface SectionConfig {
  sectionId: string;
  title?: string; // 섹션 제목 (첫 번째 섹션은 제목 없음)
  description?: string; // 섹션 설명 (타이틀 밑에 표시)
  questions: QuestionConfig[];
}

/**
 * 상담폼 질문 정의
 */
export const COUNSEL_SECTIONS: SectionConfig[] = [
  {
    sectionId: 'pet-selection',
    title: '희망 아이 및 입양 계획',
    description: '입양하길 희망하는 아이와 구체적인 시기를 알려주세요.',
    questions: [
      {
        id: 'interestedAnimal',
        label: '마음에 두신 아이가 있으신가요?',
        type: 'custom',
        customComponent: 'pet-selection',
      },
    ],
  },
  {
    sectionId: 'care-responsibility',
    title: '입양 상담을 위한 기본 정보 및 동의',
    description: '반려동물과의 건강한 동행을 위해 필요한 사항을 확인해주세요.',
    questions: [
      {
        id: 'privacyAgreement',
        label: '반려동물 입양 상담을 위한 개인정보 수집과 이용에 동의하시나요?',
        type: 'checkbox',
        checkboxLabel: '동의합니다',
        infoRows: [
          '수집하는 개인정보 항목: 이름, 연락처, 이메일주소 등',
          '수집 및 이용 목적: 입양자 상담 및 검토',
          '보유 및 이용기간: 상담 또는 입양 직후 폐기',
        ],
      },
      {
        id: 'basicCare',
        label: '정기 예방접종·건강검진·훈련 등 기본 케어를 책임지고 해주실 수 있나요?',
        type: 'checkbox',
        checkboxLabel: '네',
      },
      {
        id: 'medicalExpense',
        label: '예상치 못한 질병이나 사고 등으로 치료비가 발생할 경우 감당 가능하신가요?',
        type: 'checkbox',
        checkboxLabel: '네',
      },
    ],
  },
  {
    sectionId: 'introduction-and-family',
    title: '입양 희망자 및 가족 정보',
    description: '함께 지낼 가족분들에 대해 알려주세요.',
    questions: [
      {
        id: 'familyMembers',
        label: '함께 거주하는 가족 구성원을 알려주세요.',
        type: 'input',
        placeholder: '인원 수, 관계, 연령대 등',
      },
      {
        id: 'familyAgreement',
        label: '모든 가족 구성원들이 입양에 동의하셨나요?',
        type: 'checkbox',
        checkboxLabel: '네',
      },
    ],
  },
];

/**
 * 질문 ID로 질문 찾기
 */
export function findQuestionById(questionId: QuestionFieldId): QuestionConfig | undefined {
  for (const section of COUNSEL_SECTIONS) {
    const question = section.questions.find((q) => q.id === questionId);
    if (question) return question;
  }
  return undefined;
}

/**
 * 섹션 ID로 섹션 찾기
 */
export function findSectionById(sectionId: string): SectionConfig | undefined {
  return COUNSEL_SECTIONS.find((section) => section.sectionId === sectionId);
}
