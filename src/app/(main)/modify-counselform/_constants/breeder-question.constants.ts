/**
 * 브리더 추가 질문 관련 상수
 */

export const BREEDER_QUESTION_CONSTANTS = {
  MAX_QUESTIONS: 5,
  MIN_LENGTH: 2,
  MAX_LENGTH: 200,
} as const;

export const BREEDER_QUESTION_MESSAGES = {
  MAX_REACHED: {
    title: '최대 개수 초과',
    description: '커스텀 질문은 최대 5개까지만 추가할 수 있습니다.',
  },
  SAVE_FAILED_EMPTY: {
    title: '저장 실패',
    description: '최소 1개 이상의 질문을 입력해주세요.',
  },
  SAVE_FAILED_MIN_LENGTH: {
    title: '저장 실패',
    description: '질문은 최소 2자 이상이어야 합니다.',
  },
  SAVE_FAILED_MAX_LENGTH: {
    title: '저장 실패',
    description: '질문은 최대 200자까지 입력 가능합니다.',
  },
  SAVE_FAILED_DUPLICATE: {
    title: '저장 실패',
    description: '중복된 질문이 있습니다. 각 질문은 고유해야 합니다.',
  },
  SAVE_SUCCESS: (count: number) => ({
    title: '저장 완료',
    description: `커스텀 질문 ${count}개가 저장되었습니다.`,
  }),
  SAVE_ERROR_DEFAULT: {
    title: '저장 실패',
    description: '저장에 실패했습니다.',
  },
} as const;
