'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { getMyChatRooms } from '@/app/api/chat';
import { getUserRoleFromCookie } from '@/app/api/cookie-utils';
import type { ApplicationItem } from '../../_hooks/use-applications';

interface ChatSidebarProps {
  applications: ApplicationItem[];
  activeId: string;
  width: number;
}

export function ChatSidebar({ applications, activeId, width }: ChatSidebarProps) {
  const { user } = useAuthStore();
  const cookieRole = getUserRoleFromCookie();
  const isBreeder = (cookieRole || user?.role) === 'breeder';

  const { data: chatRooms = [] } = useQuery({
    queryKey: ['chat-rooms'],
    queryFn: getMyChatRooms,
    staleTime: 30_000,
  });

  return (
    <div
      className="hidden md:flex md:flex-col border-r border-grayscale-gray2 bg-white shrink-0"
      style={{ width }}
    >
      <div className="px-4 pt-5 pb-3 border-b border-tertiary-600">
        <h2 className="text-body-m font-semibold text-primary-500">채팅 목록</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {applications.map((app) => {
          const isActive = activeId === app.applicationId;
          // 브리더 뷰: 상대방 = 입양자 / 입양자 뷰: 상대방 = 브리더
          const displayName = isBreeder
            ? (app.adopterName || '입양 신청자')
            : (app.breederName || '브리더');
          const room = chatRooms.find((r) => r.applicationId === app.applicationId);
          const displaySub = room?.lastMessage?.trim() ?? '';

          return (
            <Link
              key={app.applicationId}
              href={`/application/chat/${app.applicationId}`}
              className={`
                block w-full px-4 py-3 border-b border-tertiary-600 transition-colors
                ${isActive ? 'bg-tertiary-500' : 'hover:bg-grayscale-gray1'}
              `}
            >
              <p className="text-body-s font-semibold text-primary-500 truncate">
                {displayName}
              </p>
              {displaySub && (
                <p className="text-caption text-grayscale-gray5 truncate mt-0.5">
                  {displaySub}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
