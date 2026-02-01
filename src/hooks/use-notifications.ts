'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  NotificationResponseDto,
} from '@/api/notification';
import { useAuthStore } from '@/stores/auth-store';

/** 알림 목록 조회 훅 */
export function useNotifications(page: number = 1, limit: number = 50) {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  return useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: () => getNotifications(page, limit),
    staleTime: 1000 * 60, // 1분
    refetchOnWindowFocus: true,
    enabled: hasHydrated && isAuthenticated, // 인증된 사용자만 조회
  });
}

/** 읽지 않은 알림 수 조회 훅 */
export function useUnreadCount() {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCount,
    staleTime: 1000 * 30, // 30초
    refetchInterval: 1000 * 60, // 1분마다 자동 갱신
    refetchOnWindowFocus: true,
    enabled: hasHydrated && isAuthenticated, // 인증된 사용자만 조회
  });
}

/** 알림 읽음 처리 훅 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      // 알림 목록과 읽지 않은 수 갱신
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

/** 모든 알림 읽음 처리 훅 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      // 알림 목록과 읽지 않은 수 갱신
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

/** 알림 삭제 훅 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      // 알림 목록과 읽지 않은 수 갱신
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

/** 알림 데이터를 UI 형식으로 변환 */
export function transformNotificationForUI(notification: NotificationResponseDto) {
  return {
    id: notification.notificationId,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    date: formatRelativeTime(notification.createdAt),
    isRead: notification.isRead,
    targetUrl: notification.targetUrl,
    metadata: notification.metadata,
  };
}

/** 상대 시간 포맷 (예: "방금 전", "5분 전", "1시간 전") */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return '방금 전';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    // 7일 이상이면 날짜 표시
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  }
}
