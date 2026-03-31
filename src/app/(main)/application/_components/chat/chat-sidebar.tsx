'use client';

import Link from 'next/link';
import type { ApplicationItem } from '../../_hooks/use-applications';

interface ChatSidebarProps {
  applications: ApplicationItem[];
  activeId: string;
  width: number;
}

export function ChatSidebar({ applications, activeId, width }: ChatSidebarProps) {
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
                {app.adopterName || '입양 신청자'}
              </p>
              <p className="text-caption text-grayscale-gray5 truncate mt-0.5">
                {app.preferredPetInfo || app.petName || '분양 중인 아이'}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
