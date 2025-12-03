import Crown from "@/assets/icons/crown";
import Plant from "@/assets/icons/plant";
import type { ComponentType } from "react";

export const DOCUMENT_KEYS = {
  ID_CARD: "idCard",
  BUSINESS_LICENSE: "businessLicense",
  CONTRACT_SAMPLE: "contractSample",
  BREEDER_DOG: "breederDogCertificate",
  BREEDER_CAT: "breederCatCertificate",
} as const;

export type DocumentKey = (typeof DOCUMENT_KEYS)[keyof typeof DOCUMENT_KEYS];

export type Level = "elite" | "new";
export type Animal = "dog" | "cat";

export interface LevelInfo {
  name: Level;
  icon: ComponentType<{ className?: string }>;
  label: string;
  description: string;
}

export const LEVEL_INFO: LevelInfo[] = [
  {
    name: "elite",
    icon: Crown,
    label: "Elite 엘리트",
    description:
      "엘리트 레벨은 전문성과 윤리적 기준을 증명해 차별화된 신뢰와 가치를 제공하는 상위 레벨이에요.",
  },
  {
    name: "new",
    icon: Plant,
    label: "New 뉴",
    description:
      "뉴 레벨은 법적 필수 요건만 충족하면 입점할 수 있는, 막 시작한 브리더를 위한 기본 신뢰 레벨이에요.",
  },
];
