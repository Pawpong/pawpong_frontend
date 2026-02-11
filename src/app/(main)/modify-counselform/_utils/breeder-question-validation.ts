/**
 * 브리더 추가 질문 검증 유틸리티
 */

import { BREEDER_QUESTION_CONSTANTS } from '../_constants/breeder-question.constants';

export interface Question {
  id: string;
  question: string;
}

export interface ValidationError {
  title: string;
  description: string;
}

export type ValidationErrorOrNull = ValidationError | null;

/**
 * 질문 유효성 검증
 */
export function validateQuestions(questions: Question[]): ValidationError | null {
  // 빈 질문 필터링
  const validQuestions = questions.filter((q) => q.question?.trim().length > 0);

  if (validQuestions.length === 0) {
    return {
      title: '저장 실패',
      description: '최소 1개 이상의 질문을 입력해주세요.',
    };
  }

  // 각 질문 검증 (2~200자)
  for (const q of validQuestions) {
    const trimmed = q.question.trim();
    if (trimmed.length < BREEDER_QUESTION_CONSTANTS.MIN_LENGTH) {
      return {
        title: '저장 실패',
        description: `질문은 최소 ${BREEDER_QUESTION_CONSTANTS.MIN_LENGTH}자 이상이어야 합니다.`,
      };
    }
    if (trimmed.length > BREEDER_QUESTION_CONSTANTS.MAX_LENGTH) {
      return {
        title: '저장 실패',
        description: `질문은 최대 ${BREEDER_QUESTION_CONSTANTS.MAX_LENGTH}자까지 입력 가능합니다.`,
      };
    }
  }

  // 중복 검사 (대소문자 무시)
  const questionTexts = validQuestions.map((q) => q.question.trim().toLowerCase());
  const uniqueQuestions = new Set(questionTexts);
  if (uniqueQuestions.size !== questionTexts.length) {
    return {
      title: '저장 실패',
      description: '중복된 질문이 있습니다. 각 질문은 고유해야 합니다.',
    };
  }

  return null;
}

/**
 * 유효한 질문만 필터링
 */
export function getValidQuestions(questions: Question[]): Question[] {
  return questions.filter((q) => q.question?.trim().length > 0);
}

/**
 * 질문 변경사항 확인
 */
export function hasQuestionChanges(
  questions: Question[],
  initialQuestions: Question[],
): boolean {
  if (questions.length !== initialQuestions.length) {
    return true;
  }

  return questions.some((q, index) => {
    const initialQ = initialQuestions[index];
    const currentQuestion = q.question?.trim() || '';
    const initialQuestion = initialQ?.question?.trim() || '';
    return !initialQ || currentQuestion !== initialQuestion;
  });
}

/**
 * 유효한 입력이 있는지 확인
 */
export function hasValidInput(questions: Question[]): boolean {
  return questions.length > 0 && questions.some((q) => (q.question?.trim() || '').length > 0);
}
