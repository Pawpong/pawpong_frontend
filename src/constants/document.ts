// 서류 미제출 경고 메시지
export const DOCUMENT_ERROR_MESSAGES = {
  BREEDER_CERT: '해당되는 서류를 하나 골라 첨부해 주세요',
  REQUIRED_DOCUMENTS: '필수 서류를 첨부해 주세요',
  FILE_SIZE_LIMIT: '파일은 최대 10MB까지 업로드할 수 있어요',
} as const;

// 브리더 인증 서류 안내 텍스트
export const BREEDER_CERT_INFO = {
  cat: [
    'TICA 또는 CFA 등록 확인서 (브리더 회원증/캐터리 등록증)',
    '캣쇼 참가 증빙 자료 (참가 확인증, 수상 기록, 공식 프로그램 또는 카탈로그에 게재된 기록 등)',
  ],
  dog: ['애견연맹견사호등록증', '도그쇼 참가 증빙 자료(참가 확인증, 수상 기록, 공식 프로그램 등에 게재된 기록 등)'],
} as const;
