'use client';

import { Badge } from '@/components/ui/badge';
import {
  ConsultationPendingIcon,
  ConsultationCompletedIcon,
  AdoptionApprovedIcon,
  AdoptionRejectedIcon,
} from '../icons/status-icons';
import type { ApplicationStatus } from '../../_types/application.types';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  size?: 'default' | 'small';
}

/**
 * 신청 상태 배지 컴포넌트
 * application-list-item.tsx와 application-detail-modal.tsx에서 공통 사용
 */
export function ApplicationStatusBadge({ status, size = 'default' }: ApplicationStatusBadgeProps) {
  const isSmall = size === 'small';

  switch (status) {
    case 'consultation_pending':
      return (
        <Badge className="bg-[#A0C8F4] text-[#4F3B2E] hover:bg-[#A0C8F4] h-7 px-3 py-1.5 gap-1.5 rounded-full flex items-center">
          <ConsultationPendingIcon />
          <span className="text-caption font-medium">상담 전</span>
        </Badge>
      );
    case 'consultation_completed':
      return (
        <Badge className="bg-[#A0A0A0] text-white hover:bg-[#A0A0A0] h-7 px-3 py-1.5 gap-1.5 rounded-full flex items-center">
          <ConsultationCompletedIcon size={isSmall ? 10 : 16} />
          <span className={`${isSmall ? 'text-xs' : 'text-caption'} font-medium`}>상담 완료</span>
        </Badge>
      );
    case 'adoption_approved':
      return (
        <Badge className="bg-[#A0A0A0] text-white hover:bg-[#A0A0A0] h-7 px-3 py-1.5 gap-1.5 rounded-full flex items-center">
          <AdoptionApprovedIcon />
          <span className="text-caption font-medium">입양 승인</span>
        </Badge>
      );
    case 'adoption_rejected':
      return (
        <Badge className="bg-[#A0A0A0] text-white hover:bg-[#A0A0A0] h-7 px-3 py-1.5 gap-1.5 rounded-full flex items-center">
          <AdoptionRejectedIcon />
          <span className="text-caption font-medium">입양 거절</span>
        </Badge>
      );
    default:
      return null;
  }
}
