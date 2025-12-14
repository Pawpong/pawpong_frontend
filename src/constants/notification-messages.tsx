import PaperRed from "@/assets/icons/paper-red.svg";
import HeartBubble from "@/assets/icons/heart-bubble.svg";
import Cat from "@/assets/icons/cat";
import Dog from "@/assets/icons/dog";
import Letter from "@/assets/icons/heart-letter.svg";

export type NotificationType =
  | "BREEDER_APPROVED"
  | "BREEDER_UNAPPROVED"
  | "BREEDER_ONBOARDING_INCOMPLETE"
  | "NEW_CONSULT_REQUEST"
  | "NEW_REVIEW_REGISTERED"
  | "CONSULT_COMPLETED"
  | "NEW_PET_REGISTERED"
  | "new_application";

interface NotificationConfig {
  message: string;
  icon: (variables?: Record<string, string>) => React.ReactNode;
  bgColor?: string;
  defaultVariables?: Record<string, string>;
}

export const NOTIFICATION_CONFIG: Record<NotificationType, NotificationConfig> =
  {
    BREEDER_APPROVED: {
      icon: () => <PaperRed />,
      message:
        "포퐁 브리더 입점이 승인되었습니다!\n지금 프로필을 세팅하고 아이들 정보를 등록해 보세요.",
    },

    BREEDER_UNAPPROVED: {
      icon: () => <PaperRed />,
      message:
        "브리더 입점 심사 결과, 보완이 필요합니다.\n자세한 사유는 이메일을 확인해주세요",
    },

    BREEDER_ONBOARDING_INCOMPLETE: {
      icon: () => <PaperRed />,
      message:
        "브리더 입점 절차가 아직 완료되지 않았어요!\n필요한 서류들을 제출하시면 입양자에게 프로필이 공개됩니다.",
    },

    NEW_CONSULT_REQUEST: {
      icon: () => <Letter />,
      message: "새로운 입양 상담 신청이 도착했어요!\n지금 확인해 보세요.",
    },

    NEW_REVIEW_REGISTERED: {
      icon: () => <HeartBubble className="text-grayscale-gray6" />,
      message:
        "새로운 후기가 등록되었어요!\n브리더 프로필에서 후기를 확인해 보세요.",
    },

    CONSULT_COMPLETED: {
      icon: () => <HeartBubble />,
      message:
        "$breederName$님과의 상담이 완료되었어요!\n어떠셨는지 후기를 남겨주세요",
      defaultVariables: { breederName: "" },
    },

    NEW_PET_REGISTERED: {
      // variables.petType → 'cat' | 'dog'
      icon: (variables) => (variables?.petType === "dog" ? <Dog /> : <Cat />),
      message:
        "$breederName$님이 새로운 아이를 등록했어요!\n지금 바로 확인해보세요",
      defaultVariables: { breederName: "" },
    },

    new_application: {
      icon: () => <Letter />,
      message: "새로운 입양 상담 신청이 도착했어요!\n지금 확인해 보세요.",
    },
  };
