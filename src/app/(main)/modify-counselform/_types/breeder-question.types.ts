/**
 * 브리더 추가 질문 관련 타입 정의
 */

export interface Question {
  id: string;
  question: string;
}

export interface BreederAdditionalQuestionSectionRef {
  saveQuestions: () => Promise<void>;
  hasChanges: boolean;
  hasValidInput: boolean;
}

export interface BreederAdditionalQuestionSectionProps {
  onSaveComplete?: () => void;
  onStateChange?: (hasChanges: boolean, hasValidInput: boolean) => void;
}
