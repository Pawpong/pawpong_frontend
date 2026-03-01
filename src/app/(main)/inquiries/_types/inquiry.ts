import type { AnimalType } from '@/components/animal-tab-bar';

export type InquiryType = 'common' | 'direct';

export interface InquiryAnswer {
  breederName: string;
  answeredAt: string;
  content: string;
  profileImageUrl?: string;
  imageUrls?: string[];
  helpfulCount?: number;
  animalTypeName?: string;
  breed?: string;
}

export interface Inquiry {
  id: string;
  title: string;
  content: string;
  type: InquiryType;
  animalType: AnimalType;
  viewCount: number;
  answerCount: number;
  latestAnswer?: InquiryAnswer;
  createdAt: string;
  /** 상세 페이지용: 작성자 닉네임 */
  authorNickname?: string;
  /** 상세 페이지용: 첨부 이미지 URL 목록 */
  imageUrls?: string[];
  /** 상세 페이지용: 답변 전체 목록 (상세에서만 사용) */
  answers?: InquiryAnswer[];
  /** 브리더용: 답변 마감 기한 */
  answerDeadline?: string;
  /** 브리더용: 현재 로그인한 브리더가 이 질문에 이미 답변했는지 */
  currentUserHasAnswered?: boolean;
}

export type InquirySortType = 'latest_answer' | 'latest' | 'most_viewed';

export interface InquiryListResponse {
  data: Inquiry[];
  hasMore: boolean;
}
