'use client';

import Alarm from '@/assets/icons/alarm';
import { Button } from '../ui/button';
import NotificationDialog from '../notification/notification-dialog';
import { useUnreadCount } from '@/hooks/use-notifications';

export default function NoticeButton() {
  const { data: unreadCount } = useUnreadCount();

  // 배지에 표시할 텍스트 (99+가 최대)
  const badgeText = unreadCount && unreadCount > 0 ? (unreadCount > 99 ? '99+' : String(unreadCount)) : null;

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
