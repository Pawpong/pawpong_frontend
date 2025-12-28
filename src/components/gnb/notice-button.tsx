'use client';

import { useMemo } from 'react';
import Alarm from '@/assets/icons/alarm';
import { Button } from '../ui/button';
import NotificationDialog from '../notification/notification-dialog';
import { useNotifications } from '@/hooks/use-notifications';
import { NOTIFICATION_CONFIG } from '@/constants/notification-messages';
import { useAuthStore } from '@/stores/auth-store';

export default function NoticeButton() {
  const { user } = useAuthStore();

  // 비회원인 경우 버튼을 렌더링하지 않음
  if (!user) {
    return null;
  }

  // 실제 알림 목록에서 읽지 않은 개수를 계산
  const { data } = useNotifications(1, 50);

  // 지원하는 타입의 알림만 필터링하여 읽지 않은 개수 계산
  const unreadCount = useMemo(() => {
    if (!data?.items) return 0;
    return data.items.filter((item) => {
      // 지원하는 타입이고 읽지 않은 알림만 카운트
      return !item.isRead && NOTIFICATION_CONFIG[item.type as keyof typeof NOTIFICATION_CONFIG];
    }).length;
  }, [data?.items]);

  // 배지에 표시할 텍스트 (99+가 최대)
  const badgeText = unreadCount > 0 ? (unreadCount > 99 ? '99+' : String(unreadCount)) : null;

  return (
    <NotificationDialog>
      <Button
        variant="ghost"
        size="icon"
        className="group size-9 -m-1.5 text-[#545454] hover:text-[#545454] active:text-[#4F3B2E] data-[state=open]:text-[#4F3B2E] data-[state=open]:hover:text-[#4F3B2E] relative"
      >
        <div className="flex items-center justify-center size-6">
          <Alarm className="size-5 transition-colors text-[#545454] group-hover:text-[#545454] group-active:text-[#4F3B2E] group-data-[state=open]:text-[#4F3B2E] group-data-[state=open]:hover:text-[#4F3B2E] [&_.default-paths]:opacity-100 group-hover:[&_.default-paths]:opacity-0 group-active:[&_.default-paths]:opacity-0 group-data-[state=open]:[&_.default-paths]:opacity-0 group-data-[state=open]:hover:[&_.default-paths]:opacity-0 [&_.hover-paths]:opacity-0 group-hover:[&_.hover-paths]:opacity-100 group-active:[&_.hover-paths]:opacity-0 group-data-[state=open]:[&_.hover-paths]:opacity-0 group-data-[state=open]:hover:[&_.hover-paths]:opacity-0 [&_.active-paths]:opacity-0 group-active:[&_.active-paths]:opacity-100 group-data-[state=open]:[&_.active-paths]:opacity-100 group-data-[state=open]:hover:[&_.active-paths]:opacity-100" />
        </div>
        {/* 읽지 않은 알림 배지 */}
        {badgeText && (
          <div className="absolute -top-1 -right-1 bg-secondary-700 text-tertiary-500 text-caption font-medium px-1.5 py-0.5 rounded-full min-w-[16px] flex items-center justify-center leading-none">
            {badgeText}
          </div>
        )}
      </Button>
    </NotificationDialog>
  );
}
