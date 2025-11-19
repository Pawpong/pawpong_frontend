export interface FAQItem {
  question: string;
  answer?: string;
}

// 일반 회원 질문 목록
export const generalUserFAQ: FAQItem[] = [
  {
    question: "혹시 사기나 허위 브리더가 있을까 걱정돼요.",
  },
  {
    question: "브리더 레벨은 뭔가요?",
  },
  {
    question: "입양비가 펫샵에 비해 너무 비싸요.",
  },
  {
    question: "브리더 검증은 구체적으로 어떻게 이루어지나요?",
  },
  {
    question: "지금 분양 가능한 아이들은 실시간인가요?",
  },
  {
    question: "반려동물 입양이 처음인데 괜찮을까요?",
  },
];

// 브리더 회원 질문 목록
export const breederUserFAQ: FAQItem[] = [
  {
    question: "심사는 어떻게 진행되나요?",
  },
  {
    question: "입점 심사 기준은 어떻게 되나요?",
  },
  {
    question: "입점 심사 서류는 어떤 게 필요한가요?",
  },
  {
    question: "브리더 레벨은 어떻게 나뉘나요?",
  },
  {
    question: "아이들 사진이나 정보는 얼마나 자주 업데이트해야 하나요?",
  },
  {
    question: "분양가 책정 기준은 어떻게 하면 좋을까요?",
  },
];
