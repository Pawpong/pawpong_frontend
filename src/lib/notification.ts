import api from "./api";

/** 알림 타입 */
export type NotificationType =
  | "BREEDER_APPROVED"
  | "BREEDER_UNAPPROVED"
  | "BREEDER_ONBOARDING_INCOMPLETE"
  | "NEW_CONSULT_REQUEST"
  | "NEW_REVIEW_REGISTERED"
  | "CONSULT_COMPLETED"
  | "NEW_PET_REGISTERED"
  | "DOCUMENT_REMINDER";

/** 알림 응답 DTO */
export interface NotificationResponseDto {
  notificationId: string;
  userId: string;
  userRole: "adopter" | "breeder";
  type: NotificationType;
  title: string;
  body: string;
  metadata?: Record<string, any>;
  targetUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

/** 읽지 않은 알림 수 응답 DTO */
export interface UnreadCountResponseDto {
  unreadCount: number;
}

/** 알림 읽음 처리 응답 DTO */
export interface MarkAsReadResponseDto {
  notificationId: string;
  isRead: boolean;
  readAt: string;
}

/** 모든 알림 읽음 처리 응답 DTO */
export interface MarkAllAsReadResponseDto {
  updatedCount: number;
}

/** 페이지네이션 응답 */
export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** 알림 목록 응답 */
export interface NotificationListResponse {
  items: NotificationResponseDto[];
  pagination: PaginationInfo;
}

/** API 응답 래퍼 */
interface ApiResponse<T> {
  success: boolean;
  code: number;
  data: T;
  message?: string;
  error?: string;
  timestamp: string;
}

/**
 * 알림 목록 조회
 * @param page 페이지 번호 (기본값: 1)
 * @param limit 페이지당 항목 수 (기본값: 20)
 * @param isRead 읽음 여부 필터 (선택)
 */
export async function getNotifications(
  page: number = 1,
  limit: number = 20,
  isRead?: boolean
): Promise<NotificationListResponse> {
  const params: Record<string, any> = {
    page,
    limit,
  };
  if (isRead !== undefined) {
    params.isRead = isRead;
  }

  const response = await api.get<ApiResponse<NotificationListResponse>>(
    "/api/notification",
    { params }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || "알림 목록을 불러오는데 실패했습니다.");
  }

  return response.data.data;
}

/**
 * 읽지 않은 알림 수 조회
 */
export async function getUnreadCount(): Promise<number> {
  const response = await api.get<ApiResponse<UnreadCountResponseDto>>(
    "/api/notification/unread-count"
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || "읽지 않은 알림 수를 불러오는데 실패했습니다.");
  }

  return response.data.data.unreadCount;
}

/**
 * 특정 알림 읽음 처리
 * @param notificationId 알림 ID
 */
export async function markAsRead(
  notificationId: string
): Promise<MarkAsReadResponseDto> {
  const response = await api.patch<ApiResponse<MarkAsReadResponseDto>>(
    `/api/notification/${notificationId}/read`
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || "알림 읽음 처리에 실패했습니다.");
  }

  return response.data.data;
}

/**
 * 모든 알림 읽음 처리
 */
export async function markAllAsRead(): Promise<MarkAllAsReadResponseDto> {
  const response = await api.patch<ApiResponse<MarkAllAsReadResponseDto>>(
    "/api/notification/read-all"
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || "모든 알림 읽음 처리에 실패했습니다.");
  }

  return response.data.data;
}

/**
 * 알림 삭제
 * @param notificationId 알림 ID
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  const response = await api.delete<ApiResponse<null>>(
    `/api/notification/${notificationId}`
  );

  if (!response.data.success) {
    throw new Error(response.data.error || "알림 삭제에 실패했습니다.");
  }
}
