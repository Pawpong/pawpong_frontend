import PaperRed from '@/assets/icons/paper-red.svg';
import HeartBubble from '@/assets/icons/heart-bubble.svg';
import Cat from '@/assets/icons/cat';
import Dog from '@/assets/icons/dog';
import Letter from '@/assets/icons/heart-letter.svg';

export type NotificationType =
  | 'breeder_approved'
  | 'breeder_unapproved'
  | 'breeder_rejected'
  | 'breeder_onboarding_incomplete'
  | 'new_consult_request'
  | 'new_review_registered'
  | 'consult_completed'
  | 'new_pet_registered'
  | 'document_reminder'
  | 'profile_completion_reminder';

interface NotificationConfig {
  message: string;
  icon: (variables?: Record<string, string>) => React.ReactNode;
  bgColor?: string;
  defaultVariables?: Record<string, string>;
  /** 알림 클릭 시 이동할 기본 경로 (변수 치환 지원: $breederId$ 등) */
  defaultTargetUrl?: string;
}

export const NOTIFICATION_CONFIG: Record<NotificationType, NotificationConfig> = {
  // 브리더 입점 심사 승인 → 홈
  breeder_approved: {
    icon: () => <PaperRed />,
    message: '포퐁 브리더 입점이 승인되었습니다!\n지금 프로필을 세팅하고 아이들 정보를 등록해 보세요.',
    defaultTargetUrl: '/',
  },

  // 브리더 입점 심사 반려 → 홈
  breeder_unapproved: {
    icon: () => <PaperRed />,
    message: '브리더 입점 심사 결과, 보완이 필요합니다.\n자세한 사유는 이메일을 확인해주세요',
    defaultTargetUrl: '/',
  },

  // 브리더 입점 심사 반려 (breeder_unapproved와 동일, 호환성) → 홈
  breeder_rejected: {
    icon: () => <PaperRed />,
    message: '브리더 입점 심사 결과, 보완이 필요합니다.\n자세한 사유는 이메일을 확인해주세요',
    defaultTargetUrl: '/',
  },

  // 서류 등록 독려 → 입점 서류 수정
  breeder_onboarding_incomplete: {
    icon: () => <PaperRed />,
    message: '브리더 입점 절차가 아직 완료되지 않았어요!\n필요한 서류들을 제출하시면 입양자에게 프로필이 공개됩니다.',
    defaultTargetUrl: '/breeder/onboarding/documents',
  },

  // 상담 신청 (브리더에게) → 받은 신청
  new_consult_request: {
    icon: () => <Letter />,
    message: '새로운 입양 상담 신청이 도착했어요!\n지금 확인해 보세요.',
    defaultTargetUrl: '/application',
  },

  // 후기 등록 (브리더에게) → 브리더 프로필 후기 섹션
  new_review_registered: {
    icon: () => <HeartBubble className="text-grayscale-gray6" />,
    message: '새로운 후기가 등록되었어요!\n브리더 프로필에서 후기를 확인해 보세요.',
    defaultTargetUrl: '/explore/breeder/$breederId$#reviews',
  },

  // 후기 작성 독려 (입양자에게) → 후기 작성 다이얼로그 (notification-dialog에서 직접 처리)
  consult_completed: {
    icon: () => <HeartBubble />,
    message: '$breederName$님과의 상담이 완료되었어요!\n어떠셨는지 후기를 남겨주세요',
    defaultVariables: { breederName: '' },
    // defaultTargetUrl 없음 - 후기 작성 다이얼로그로 직접 처리
  },

  // 찜한 브리더 새 아이 등록 (입양자에게) → 브리더 프로필
  new_pet_registered: {
    // variables.petType → 'cat' | 'dog'
    icon: (variables?: Record<string, string>) => (variables?.petType === 'dog' ? <Dog /> : <Cat />),
    message: '$breederName$님이 새로운 아이를 등록했어요!\n지금 바로 확인해보세요',
    defaultVariables: { breederName: '' },
    defaultTargetUrl: '/explore/breeder/$breederId$',
  },

  // 서류 등록 독려 → 입점 서류 수정
  document_reminder: {
    icon: () => <PaperRed />,
    message: '브리더 입점 절차가 아직 완료되지 않았어요!\n필요한 서류들을 제출하시면 입양자에게 프로필이 공개됩니다.',
    defaultTargetUrl: '/breeder/onboarding/documents',
  },

  // 프로필 완성 독려 → 브리더 프로필
  profile_completion_reminder: {
    icon: () => <PaperRed />,
    message:
      '브리더 프로필이 아직 완성되지 않았어요!\n프로필 작성을 마무리하면 입양자에게 노출되고 상담을 받을 수 있어요.',
    defaultTargetUrl: '/profile',
  },
};

/**
 * 알림 타입별 기본 이동 경로 가져오기 (변수 치환 포함)
 * @param type 알림 타입
 * @param variables 변수 (breederId 등)
 * @returns 이동할 경로 또는 undefined
 */
export function getNotificationTargetUrl(
  type: NotificationType,
  variables?: Record<string, string>,
): string | undefined {
  const config = NOTIFICATION_CONFIG[type];
  if (!config?.defaultTargetUrl) return undefined;

  let url = config.defaultTargetUrl;
  if (variables) {
    for (const key in variables) {
      url = url.replace(`$${key}$`, variables[key] || '');
    }
  }
  return url;
}
