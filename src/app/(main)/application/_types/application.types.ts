/**
 * 신청 내역 관련 타입 정의
 */

export type ApplicationStatus = 'consultation_pending' | 'consultation_completed' | 'adoption_approved' | 'adoption_rejected';

export interface CustomQuestionResponse {
  questionId: string;
  questionLabel: string;
  questionType: string;
  answer: string;
}
