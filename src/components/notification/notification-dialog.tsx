'use client';

import React, { useMemo, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import NotificationItem from './notification-item';
import NotificationEmptyState from './notification-empty-state';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NOTIFICATION_CONFIG, NotificationType, getNotificationTargetUrl } from '@/constants/notification-messages';
import { useNotifications, useMarkAllAsRead, useMarkAsRead, transformNotificationForUI } from '@/hooks/use-notifications';
import ReviewWriteDialog from '@/app/(main)/application/_components/review-write-dialog';

// UI에서 사용할 알림 데이터 인터페이스
interface NotificationData {
  id: string;
  type: NotificationType;
  date: string;
  isRead: boolean;
  targetUrl?: string;
  variables?: { [key: string]: string };
}

// 후기 작성 다이얼로그에 필요한 데이터
interface ReviewWriteData {
  applicationId: string;
  breederId: string;
  breederName: string;
  breederLevel: 'elite' | 'new';
  applicationDate: string;
  profileImage: string;
  animalType: 'cat' | 'dog';
}

interface NotificationDialogProps {
  children: React.ReactNode;
}

export default function NotificationDialog({ children }: NotificationDialogProps) {
  const router = useRouter();
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  // 후기 작성 다이얼로그 상태
  const [showReviewWriteDialog, setShowReviewWriteDialog] = useState(false);
  const [reviewWriteData, setReviewWriteData] = useState<ReviewWriteData | null>(null);

  // API에서 알림 목록 조회
  const { data, isLoading } = useNotifications(1, 50);
  const markAllAsReadMutation = useMarkAllAsRead();
  const markAsReadMutation = useMarkAsRead();

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
        targetUrl: transformed.targetUrl,
        variables: transformed.metadata,
      };
    });
  }, [data?.items]);

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  // 알림 클릭 시 읽음 처리 및 페이지 이동
  const handleNotificationClick = useCallback(
    (notification: NotificationData) => {
      // 읽지 않은 알림이면 읽음 처리
      if (!notification.isRead) {
        markAsReadMutation.mutate(notification.id);
      }

      // consult_completed 타입인 경우 후기 작성 다이얼로그 띄우기
      if (notification.type === 'consult_completed' && notification.variables) {
        const { applicationId, breederId, breederName, breederLevel, applicationDate, profileImage, animalType } =
          notification.variables;

        if (applicationId && breederId) {
          // 다이얼로그 닫기
          dialogCloseRef.current?.click();

          // 후기 작성 다이얼로그 데이터 설정
          setReviewWriteData({
            applicationId,
            breederId,
            breederName: breederName || '브리더',
            breederLevel: (breederLevel as 'elite' | 'new') || 'new',
            applicationDate: applicationDate || '',
            profileImage: profileImage || '',
            animalType: (animalType as 'cat' | 'dog') || 'cat',
          });
          setShowReviewWriteDialog(true);
          return;
        }
      }

      // targetUrl 결정: API에서 받은 targetUrl 우선, 없으면 기본 경로 사용
      const targetUrl = notification.targetUrl || getNotificationTargetUrl(notification.type, notification.variables);

      // targetUrl이 있으면 해당 페이지로 이동
      if (targetUrl) {
        // 다이얼로그 닫기
        dialogCloseRef.current?.click();
        // 페이지 이동
        router.push(targetUrl);
      }
    },
    [markAsReadMutation, router],
  );

  const newNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  // 알림 메시지 가져오기 (변수 치환 포함)
  const getNotificationMessage = (type: NotificationType, variables?: { [key: string]: string }): string => {
    const config = NOTIFICATION_CONFIG[type];
    if (!config) {
      console.error(`Unknown notification type: ${type}`);
      return '알림이 도착했습니다.';
    }

    let message = config.message;
    const mergedVariables = {
      ...config.defaultVariables,
      ...variables,
    };

    if (mergedVariables) {
      for (const key in mergedVariables) {
        const value = mergedVariables[key];
        // 값이 없으면 기본값 사용 (breederName이 비어있으면 "브리더"로 대체)
        const replacement = value || (key === 'breederName' ? '브리더' : '');
        message = message.replace(`$${key}$`, replacement);
      }
    }
    return message;
  };

  // 알림 아이콘 가져오기
  const getNotificationIcon = (type: NotificationType, variables?: { [key: string]: string }): React.ReactNode => {
    const config = NOTIFICATION_CONFIG[type];
    if (!config) {
      console.error(`Unknown notification type: ${type}`);
      return null;
    }
    return config.icon(variables);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={`fixed inset-x-0 top-[64px] bottom-0 w-full max-w-full p-0 flex flex-col overflow-hidden translate-x-0 translate-y-0 rounded-none border-0 lg:w-[480px] lg:max-w-[480px] lg:top-[64px] lg:right-[48px] lg:left-auto lg:bottom-auto lg:rounded-2xl lg:shadow-[0px_0px_13px_0px_rgba(12,17,29,0.08)] data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full ${
          notifications.length > 0 ? 'lg:h-[816px] lg:max-h-[816px]' : 'lg:h-auto lg:max-h-none'
        }`}
        overlayClassName="inset-0 bg-transparent"
        showCloseButton={false}
      >
        {/* 접근성을 위한 DialogTitle */}
        <VisuallyHidden>
          <DialogTitle>알림</DialogTitle>
        </VisuallyHidden>

        {/* 숨겨진 다이얼로그 닫기 버튼 (프로그래밍 방식으로 닫기 위함) */}
        <DialogClose ref={dialogCloseRef} className="hidden" />

        {/* 헤더 */}
        <div className="hidden lg:flex justify-between items-center px-6 pt-6 pb-[10px]">
          <h2 className="text-body-l font-semibold text-primary">알림</h2>
          {/* Figma 요구사항: 신규 알림이 1개 이상일 때만 표시 */}
          {newNotifications.length > 0 && (
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
          className={`${notifications.length > 0 ? 'flex-1 min-h-0' : 'flex-none'} px-5 md:px-10 lg:px-[12px] lg:pb-6`}
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
                    <p className="text-body-xs font-semibold text-grayscale-gray5">신규</p>
                  </div>
                  <div className="flex flex-col">
                    {newNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        icon={getNotificationIcon(notification.type, notification.variables)}
                        content={getNotificationMessage(notification.type, notification.variables)}
                        date={notification.date}
                        onClick={() => handleNotificationClick(notification)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 읽음 섹션 */}
              {readNotifications.length > 0 && (
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center px-3">
                    <p className="text-body-xs font-semibold text-grayscale-gray5">읽음</p>
                  </div>
                  <div className="flex flex-col">
                    {readNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        icon={getNotificationIcon(notification.type, notification.variables)}
                        content={getNotificationMessage(notification.type, notification.variables)}
                        date={notification.date}
                        onClick={() => handleNotificationClick(notification)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* 하단 버튼 (모바일/패드용) - Figma 요구사항: 신규 알림이 있을 때만 표시 */}
        {newNotifications.length > 0 && (
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

      {/* 후기 작성 다이얼로그 */}
      {reviewWriteData && (
        <ReviewWriteDialog
          applicationId={reviewWriteData.applicationId}
          breederId={reviewWriteData.breederId}
          open={showReviewWriteDialog}
          onOpenChange={setShowReviewWriteDialog}
          breederName={reviewWriteData.breederName}
          breederLevel={reviewWriteData.breederLevel}
          applicationDate={reviewWriteData.applicationDate}
          profileImage={reviewWriteData.profileImage}
          animalType={reviewWriteData.animalType}
        />
      )}
    </Dialog>
  );
}
