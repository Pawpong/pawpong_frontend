'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useAuthStore } from '@/stores/auth-store';
import { getUserRoleFromCookie } from '@/api/cookie-utils';
import { useApplications } from '../../_hooks/use-applications';
import { useResizePanel } from '../../_hooks/use-resize-panel';
import { ChatRoom } from '../../_components/chat/chat-room';
import { ChatSidebar } from '../../_components/chat/chat-sidebar';
import { LoadingState } from '@/components/loading-state';
import LeftArrow from '@/assets/icons/left-arrow.svg';
import ApplicationDetailModal from '../../_components/detail/application-detail-modal';
import { Button } from '@/components/ui/button';

export default function ChatPage() {
  useAuthGuard();
  const { applicationId } = useParams<{ applicationId: string }>();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { user } = useAuthStore();
  const cookieRole = getUserRoleFromCookie();
  const isBreeder = (cookieRole || user?.role) === 'breeder';
  const { data } = useApplications();
  const { width, handleMouseDown } = useResizePanel();

  const allApplications = data?.pages.flatMap((page) => page.data) ?? [];
  const application = allApplications.find((app) => app.applicationId === applicationId);

  if (!data) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <LoadingState />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white">
        <p className="text-body-s text-grayscale-gray5">신청을 찾을 수 없습니다.</p>
        <Link href="/application" className="text-body-s text-primary-500 underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-white">
      {/* 좌측 사이드바 - 데스크톱 */}
      <ChatSidebar applications={allApplications} activeId={applicationId} width={width} />

      {/* 리사이즈 핸들 - 데스크톱 */}
      <div
        className="hidden md:flex w-1 cursor-col-resize items-center justify-center hover:bg-grayscale-gray2 active:bg-grayscale-gray3 transition-colors group shrink-0"
        onMouseDown={handleMouseDown}
      >
        <div className="w-0.5 h-8 rounded-full bg-grayscale-gray3 group-hover:bg-grayscale-gray4 transition-colors" />
      </div>

      {/* 채팅방 */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2 h-14 px-3 bg-white border-b border-grayscale-gray2 shrink-0">
          <Link href="/application" className="flex items-center justify-center w-8 h-8">
            <LeftArrow className="text-primary-500" />
          </Link>
          <span className="flex h-8 items-center text-body-m leading-none font-semibold text-primary-500">
            {isBreeder
              ? (application.adopterName || '입양 신청자')
              : (application.breederName || '브리더')}
          </span>
          <Button
            type="button"
            variant="tertiary"
            className="ml-auto h-8 px-3 py-0 text-caption"
            onClick={() => setIsDetailModalOpen(true)}
          >
            신청서 보기
          </Button>
        </div>
        <ChatRoom application={application} />
      </div>
      <ApplicationDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        applicationId={applicationId}
        showActions={false}
      />
    </div>
  );
}
