"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import NotificationItem from "./notification-item";
import NotificationEmptyState from "./notification-empty-state";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  NOTIFICATION_CONFIG,
  NotificationType,
} from "@/constants/notification-messages";
import {
  useNotifications,
  useMarkAllAsRead,
  transformNotificationForUI,
} from "@/hooks/use-notifications";

// UI에서 사용할 알림 데이터 인터페이스
interface NotificationData {
  id: string;
  type: NotificationType;
  date: string;
  isRead: boolean;
  variables?: { [key: string]: string };
}

interface NotificationDialogProps {
  children: React.ReactNode;
}

export default function NotificationDialog({
  children,
}: NotificationDialogProps) {
  // API에서 알림 목록 조회
  const { data, isLoading } = useNotifications(1, 50);
  const markAllAsReadMutation = useMarkAllAsRead();

  // API 응답을 UI 형식으로 변환
  const notifications: NotificationData[] = useMemo(() => {
    if (!data?.items) return [];
    return data.items.map((item) => {
      const transformed = transformNotificationForUI(item);
      return {
        id: transformed.id,
        type: transformed.type as NotificationType,
        date: transformed.date,
        isRead: transformed.isRead,
        variables: transformed.metadata,
      };
    });
  }, [data?.items]);

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const newNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  // 알림 메시지 가져오기 (변수 치환 포함)
  const getNotificationMessage = (
    type: NotificationType,
    variables?: { [key: string]: string }
  ): string => {
    const config = NOTIFICATION_CONFIG[type];
    let message = config.message;
    const mergedVariables = {
      ...config.defaultVariables,
      ...variables,
    };

    if (mergedVariables) {
      for (const key in mergedVariables) {
        message = message.replace(`$${key}$`, mergedVariables[key] || "");
      }
    }
    return message;
  };

  // 알림 아이콘 가져오기
  const getNotificationIcon = (
    type: NotificationType,
    variables?: { [key: string]: string }
  ): React.ReactNode => {
    const config = NOTIFICATION_CONFIG[type];
    return config.icon(variables);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={`fixed inset-x-0 top-[64px] bottom-0 w-full max-w-full p-0 flex flex-col overflow-hidden translate-x-0 translate-y-0 rounded-none border-0 lg:w-[480px] lg:max-w-[480px] lg:top-[64px] lg:right-[48px] lg:left-auto lg:bottom-auto lg:rounded-2xl lg:shadow-[0px_0px_13px_0px_rgba(12,17,29,0.08)] data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full ${
          notifications.length > 0
            ? "lg:h-[816px] lg:max-h-[816px]"
            : "lg:h-auto lg:max-h-none"
        }`}
        overlayClassName="inset-0 bg-transparent"
        showCloseButton={false}
      >
        {/* 접근성을 위한 DialogTitle */}
        <VisuallyHidden>
          <DialogTitle>알림</DialogTitle>
        </VisuallyHidden>

        {/* 헤더 */}
        <div className="hidden lg:flex justify-between items-center px-6 pt-6 pb-[10px]">
          <h2 className="text-body-l font-semibold text-primary">알림</h2>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleMarkAllAsRead}
              className="text-body-xs font-normal text-[#4E9CF1] underline hover:no-underline p-0 h-auto"
            >
              모두 읽음으로 표시
            </Button>
          )}
        </div>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <ScrollArea
          className={`${
            notifications.length > 0 ? "flex-1 min-h-0" : "flex-none"
          } px-5 md:px-10 lg:px-[12px] lg:pb-6`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-body-s text-grayscale-gray5">로딩 중...</p>
            </div>
          ) : notifications.length === 0 ? (
            <NotificationEmptyState />
          ) : (
            <div className="flex flex-col gap-6 ">
              {/* 신규 섹션 */}
              {newNotifications.length > 0 && (
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center px-3">
                    <p className="text-body-xs font-semibold text-grayscale-gray5">
                      신규
                    </p>
                  </div>
                  <div className="flex flex-col">
                    {newNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        icon={getNotificationIcon(
                          notification.type,
                          notification.variables
                        )}
                        content={getNotificationMessage(
                          notification.type,
                          notification.variables
                        )}
                        date={notification.date}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 읽음 섹션 */}
              {readNotifications.length > 0 && (
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center px-3">
                    <p className="text-body-xs font-semibold text-grayscale-gray5">
                      읽음
                    </p>
                  </div>
                  <div className="flex flex-col">
                    {readNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        icon={getNotificationIcon(
                          notification.type,
                          notification.variables
                        )}
                        content={getNotificationMessage(
                          notification.type,
                          notification.variables
                        )}
                        date={notification.date}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* 하단 버튼 (모바일/패드용) */}
        {notifications.length > 0 && (
          <div className="lg:hidden flex  px-5 md:px-10 pb-4 border-grayscale-gray2 flex-shrink-0">
            <Button
              variant="ghost"
              onClick={handleMarkAllAsRead}
              className="text-body-xs font-normal text-[#4E9CF1] underline hover:no-underline p-0 h-auto"
            >
              모두 읽음으로 표시
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
