"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import NotificationItem from "./notification-item";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  NOTIFICATION_CONFIG,
  NotificationType,
} from "@/constants/notification-messages";

// 목 데이터 인터페이스
interface NotificationData {
  id: number;
  type: NotificationType;
  date: string;
  isRead: boolean;
  variables?: { [key: string]: string };
}

// 목 데이터
const mockNotifications: NotificationData[] = [
  {
    id: 1,
    type: "BREEDER_APPROVED",
    date: "2024. 01. 15. 10:00",
    isRead: false,
  },
  {
    id: 2,
    type: "BREEDER_UNAPPROVED",
    date: "2024. 01. 14. 14:30",
    isRead: false,
  },
  {
    id: 3,
    type: "BREEDER_ONBOARDING_INCOMPLETE",
    date: "2024. 01. 13. 09:15",
    isRead: false,
  },
  {
    id: 4,
    type: "NEW_CONSULT_REQUEST",
    date: "2024. 01. 12. 16:45",
    isRead: false,
  },
  {
    id: 5,
    type: "NEW_REVIEW_REGISTERED",
    date: "2024. 01. 11. 11:20",
    isRead: true,
  },
  {
    id: 6,
    type: "CONSULT_COMPLETED",
    date: "2024. 01. 10. 13:00",
    isRead: true,
    variables: { breederName: "홍길동" },
  },
  {
    id: 7,
    type: "NEW_PET_REGISTERED",
    date: "2024. 01. 09. 15:30",
    isRead: true,
    variables: { breederName: "김철수" },
  },
  {
    id: 8,
    type: "NEW_PET_REGISTERED",
    date: "2024. 01. 09. 15:30",
    isRead: true,
    variables: { breederName: "김철수" },
  },
  {
    id: 9,
    type: "NEW_PET_REGISTERED",
    date: "2024. 01. 09. 15:30",
    isRead: true,
    variables: { breederName: "김철수" },
  },
  {
    id: 10,
    type: "NEW_PET_REGISTERED",
    date: "2024. 01. 09. 15:30",
    isRead: true,
    variables: { breederName: "김철수" },
  },
  {
    id: 11,
    type: "NEW_PET_REGISTERED",
    date: "2024. 01. 09. 15:30",
    isRead: true,
    variables: { breederName: "김철수" },
  },
  {
    id: 12,
    type: "NEW_PET_REGISTERED",
    date: "2024. 01. 09. 15:30",
    isRead: true,
    variables: { breederName: "김철수" },
  },
  {
    id: 13,
    type: "NEW_PET_REGISTERED",
    date: "2024. 01. 09. 15:30",
    isRead: true,
    variables: { breederName: "김철수" },
  },
  {
    id: 14,
    type: "NEW_PET_REGISTERED",
    date: "2024. 01. 09. 15:30",
    isRead: true,
    variables: { breederName: "김철수" },
  },
];

interface NotificationDialogProps {
  children: React.ReactNode;
}

export default function NotificationDialog({
  children,
}: NotificationDialogProps) {
  const [notifications, setNotifications] =
    useState<NotificationData[]>(mockNotifications);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
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
        className="fixed inset-x-0 top-[64px] bottom-0 w-full max-w-full p-0 flex flex-col overflow-hidden translate-x-0 translate-y-0 rounded-none border-0 lg:w-[480px] lg:h-[816px] lg:max-w-[480px] lg:max-h-[816px] lg:top-[64px] lg:right-[48px] lg:left-auto lg:rounded-2xl lg:shadow-[0px_0px_13px_0px_rgba(12,17,29,0.08)]"
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
          <Button
            variant="ghost"
            onClick={handleMarkAllAsRead}
            className="text-body-xs font-normal text-[#4E9CF1] underline hover:no-underline p-0 h-auto"
          >
            모두 읽음으로 표시
          </Button>
        </div>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <ScrollArea className="flex-1 min-h-0 px-5 md:px-10">
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
        </ScrollArea>

        {/* 하단 버튼 (모바일/패드용) */}
        <div className="lg:hidden flex  px-5 md:px-10 pb-4 border-grayscale-gray2 flex-shrink-0">
          <Button
            variant="ghost"
            onClick={handleMarkAllAsRead}
            className="text-body-xs font-normal text-[#4E9CF1] underline hover:no-underline p-0 h-auto"
          >
            모두 읽음으로 표시
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
