import type { AnimalType } from '@/components/animal-tab-bar';

export type InquiryType = 'common' | 'direct';

export interface InquiryAnswer {
  breederName: string;
  answeredAt: string;
  content: string;
  profileImageUrl?: string;
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
}

export type InquirySortType = 'latest_answer' | 'latest' | 'most_viewed';

export interface InquiryListResponse {
  data: Inquiry[];
  hasMore: boolean;
}
