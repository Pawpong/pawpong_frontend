import PaperRed from "@/assets/icons/paper-red.svg";
import HeartBubble from "@/assets/icons/heart-bubble.svg";
import Cat from "@/assets/icons/cat";
import Dog from "@/assets/icons/dog";
import Letter from "@/assets/icons/heart-letter.svg";

export type NotificationType =
  | "breeder_approved"
  | "breeder_unapproved"
  | "breeder_onboarding_incomplete"
  | "new_consult_request"
  | "consult_request_confirmed"
  | "new_review_registered"
  | "consult_completed"
  | "new_pet_registered"
  | "document_reminder";

interface NotificationConfig {
  message: string;
  icon: (variables?: Record<string, string>) => React.ReactNode;
  bgColor?: string;
  defaultVariables?: Record<string, string>;
}

export const NOTIFICATION_CONFIG: Record<NotificationType, NotificationConfig> =
  {
    breeder_approved: {
      icon: () => <PaperRed />,
      message:
        "포퐁 브리더 입점이 승인되었습니다!\n지금 프로필을 세팅하고 아이들 정보를 등록해 보세요.",
    },

    breeder_unapproved: {
      icon: () => <PaperRed />,
      message:
        "브리더 입점 심사 결과, 보완이 필요합니다.\n자세한 사유는 이메일을 확인해주세요",
    },

    breeder_onboarding_incomplete: {
      icon: () => <PaperRed />,
      message:
        "브리더 입점 절차가 아직 완료되지 않았어요!\n필요한 서류들을 제출하시면 입양자에게 프로필이 공개됩니다.",
    },

    new_consult_request: {
      icon: () => <Letter />,
      message: "새로운 입양 상담 신청이 도착했어요!\n지금 확인해 보세요.",
    },

    consult_request_confirmed: {
      icon: () => <Letter />,
      message:
        "$breederName$님께 상담 신청이 접수되었습니다!\n브리더님이 확인 후 연락드릴 예정입니다.",
      defaultVariables: { breederName: "" },
    },

    new_review_registered: {
      icon: () => <HeartBubble className="text-grayscale-gray6" />,
      message:
        "새로운 후기가 등록되었어요!\n브리더 프로필에서 후기를 확인해 보세요.",
    },

    consult_completed: {
      icon: () => <HeartBubble />,
      message:
        "$breederName$님과의 상담이 완료되었어요!\n어떠셨는지 후기를 남겨주세요",
      defaultVariables: { breederName: "" },
    },

    new_pet_registered: {
      // variables.petType → 'cat' | 'dog'
      icon: (variables?: Record<string, string>) => (variables?.petType === "dog" ? <Dog /> : <Cat />),
      message:
        "$breederName$님이 새로운 아이를 등록했어요!\n지금 바로 확인해보세요",
      defaultVariables: { breederName: "" },
    },

    document_reminder: {
      icon: () => <PaperRed />,
      message:
        "브리더 입점 절차가 아직 완료되지 않았어요!\n필요한 서류들을 제출하시면 입양자에게 프로필이 공개됩니다.",
    },
  };
