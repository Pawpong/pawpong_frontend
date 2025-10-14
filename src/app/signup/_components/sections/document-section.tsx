"use client";

import Crown from "@/assets/icons/crown";
import Plant from "@/assets/icons/plant";
import { OathDialog } from "@/components/oath/oath-dialog";
import { OathLabel } from "@/components/oath/oath-label";
import { Oath } from "@/components/oath/oath-provider";
import SignupFormDescription from "@/components/signup-form-section/signup-form-description";
import SignupFormHeader from "@/components/signup-form-section/signup-form-header";
import SignupFormItems from "@/components/signup-form-section/signup-form-items";
import SignupFormSection from "@/components/signup-form-section/signup-form-section";
import SignupFormTitle from "@/components/signup-form-section/signup-form-title";
import UndoButton from "@/components/signup-form-section/undo-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useSignupFormStore from "@/stores/signup-form-store";
import { useState } from "react";
import DocumentSkipDialogTrigger from "../document-skip-dialog-trigger";
import FileButton from "./file-button";

const oathInfo: Record<"elite" | "new", React.ReactNode> = {
  elite: (
    <>
      <p>
        본인은 <span className="text-primary">포퐁 플랫폼 브리더 회원</span>으로
        입점함에 있어, 아래의 기준을 충실히 준수할 것을 서약합니다. 만약 이를
        위반하거나 허위 사실이 적발될 경우, 플랫폼에서 즉시 퇴출될 수 있음을
        이해하며 이에 동의합니다.
      </p>
      {[
        <p key={0}>
          본인은{" "}
          <span className="text-primary">관할 지자체에 동물생산업 등록</span>을
          완료하였으며, 관련 법규를 성실히 준수합니다.
        </p>,
        <p key={1}>
          모든 분양 과정에서{" "}
          <span className="text-primary">표준 입양계약서</span>를 작성합니다.
        </p>,
        <p key={2}>
          <span className="text-primary">2종 이하 브리딩 원칙</span>을 지키며,
          다품종 브리딩을 하지 않습니다.
        </p>,
        <p key={3}>
          모든 아이들은{" "}
          <span className="text-primary">중성화 완료 후 분양</span>하거나, 입양
          계약서에 반드시 중성화 조항을 명시합니다.
        </p>,
        <p key={4}>
          모든 아이들은{" "}
          <span className="text-primary">3차 종합백신 완료 후</span> 분양합니다.
        </p>,
        <p key={5}>
          <span className="text-primary">혈통서 발급</span>을 의무화하며, 공식
          협회 발급 혈통서만 제공합니다.
        </p>,
        <p key={6}>
          모든 아이들은 반드시{" "}
          <span className="text-primary">생후 3개월 이후</span>에만 분양합니다.
        </p>,
        <p key={7}>
          국내에서 진행되는 모든 분양은 반드시{" "}
          <span className="text-primary">대면 분양</span>으로 진행하며,
          비대면·택배 분양은 절대 하지 않습니다.
        </p>,
        <p key={8}>
          분양 개체의 사회화, 건강, 복지를 최우선으로 하며, 무분별한 번식을 하지
          않습니다.
        </p>,
        <p key={9}>
          포퐁 플랫폼과 입양자에게{" "}
          <span className="text-primary">
            허위 사실 없이 투명하게 정보를 제공
          </span>
          합니다.
        </p>,
      ].map((e) => (
        <div className="flex gap-2 items-start" key={e.key}>
          <div className="h-5 flex items-center">
            <div className="size-[3px] bg-grayscale-gray5 rounded-full " />
          </div>
          {e}
        </div>
      ))}
    </>
  ),
  new: (
    <>
      <p>
        본인은 <span className="text-primary">포퐁 플랫폼 브리더 회원</span>으로
        입점함에 있어, 아래의 기준을 충실히 준수할 것을 서약합니다. 만약 이를
        위반하거나 허위 사실이 적발될 경우, 플랫폼에서 즉시 퇴출될 수 있음을
        이해하며 이에 동의합니다.
      </p>
      {[
        <p key={0}>
          본인은{" "}
          <span className="text-primary">관할 지자체에 동물생산업 등록</span>을
          아님을 확인합니다.
        </p>,
        <p key={1}>
          모든 아이들은 반드시{" "}
          <span className="text-primary">생후 3개월 이후</span>에만 분양합니다.
        </p>,
        <p key={2}>
          국내에서 진행되는 모든 분양은 반드시{" "}
          <span className="text-primary">대면 분양</span>으로 진행하며,
          비대면·택배 분양은 절대 하지 않습니다.
        </p>,
        <p key={3}>
          분양 개체의 사회화, 건강, 복지를 최우선으로 하며, 무분별한 번식을 하지
          않습니다.
        </p>,
        <p key={4}>
          포퐁 플랫폼과 입양자에게{" "}
          <span className="text-primary">
            허위 사실 없이 투명하게 정보를 제공
          </span>
          합니다.
        </p>,
      ].map((e) => (
        <div className="flex gap-2 items-start" key={e.key}>
          <div className="h-5 flex items-center">
            <div className="size-[3px] bg-grayscale-gray5 rounded-full " />
          </div>
          {e}
        </div>
      ))}
    </>
  ),
};
const levelInfo = [
  {
    name: "elite",
    icon: Crown,
    label: "Elite 엘리트",
    description:
      "엘리트 레벨은 전문성과 윤리적 기준을 증명해 차별화된 신뢰와 가치를 제공하는 상위 레벨이에요.",
    documents: [
      "신분증 사본",
      "동물생산업 등록증",
      "표준 입양계약서 샘플",
      "최근 발급된 혈통서 사본",
      "고양이 브리더 인증 서류",
    ],
  },
  {
    name: "new",
    icon: Plant,
    label: "New 뉴",
    description:
      "뉴 레벨은 법적 필수 요건만 충족하면 입점할 수 있는, 막 시작한 브리더를 위한 기본 신뢰 레벨이에요.",
    documents: ["신분증 사본", "동물생산업 등록증"],
  },
];

export default function DocumentSection() {
  const level = useSignupFormStore((e) => e.level);
  const setLevel = useSignupFormStore((e) => e.setLevel);
  const [checked, setChecked] = useState(false);
  return (
    <SignupFormSection className="gap-15 md:gap-20 lg:gap-20">
      <SignupFormHeader>
        <SignupFormTitle>브리더 입점 서류를 등록해 주세요</SignupFormTitle>
        <SignupFormDescription>
          브리더 활동 경험에 따라 적합한 레벨을 선택해 <br />
          서류를 업로드해주세요.
        </SignupFormDescription>
      </SignupFormHeader>
      <SignupFormItems className="gap-8">
        <div className="grid grid-cols-2 gap-5 items-center">
          {levelInfo.map(({ name, icon: Icon, label }) => (
            <Button
              key={name}
              variant="ghost"
              className="flex flex-col gap-2 bg-transparent p-0 text-grayscale-gray5 hover:text-grayscale-gray6!"
              onClick={() => setLevel(name as "elite" | "new")}
            >
              <div
                className={cn("flex items-center gap-2 ", {
                  "text-primary": level === name,
                })}
              >
                <Icon className="size-5" />
                <div className="text-heading-3 font-semibold">{label}</div>
              </div>
              <div
                className={cn("h-0.5 w-full bg-transparent", {
                  "bg-primary": level === name,
                })}
              />
            </Button>
          ))}
        </div>
        <div className="text-primary/80 font-medium text-body-m text-balance text-center break-keep">
          {levelInfo.find((e) => e.name === level)?.description}
        </div>
        <div className="space-y-8">
          <div className="space-y-2.5">
            <FileButton>신분증 사본</FileButton>
            <div className="text-secondary-700 font-medium text-caption-s">
              이름과 생년월일 이외에는 가려서 제출하시길 권장드립니다.
            </div>
          </div>
          <div className="space-y-3">
            <FileButton>동물생산업 등록증</FileButton>
            {level === "elite" && (
              <>
                <FileButton>표준 입양계약서 샘플</FileButton>

                <div className="space-y-2.5">
                  <FileButton>최근 발급된 혈통서 사본</FileButton>
                  <div className="text-grayscale-gray5 font-medium text-caption-s">
                    분양 예정인 개체의 혈통서를 첨부해 주세요
                  </div>
                </div>
              </>
            )}
          </div>
          {level === "elite" && (
            <div className="space-y-2.5">
              <FileButton>고양이 브리더 인증 서류</FileButton>
              <div className="text-grayscale-gray5 font-medium text-caption-s space-y-2">
                <p>해당되는 서류를 하나 골라 첨부해 주세요</p>
                {[
                  "TICA 또는 CFA 등록 확인서 (브리더 회원증/캐터리 등록증)",
                  "캣쇼 참가 증빙 자료 (참가 확인증, 수상 기록, 공식 프로그램 또는 카탈로그에 게재된 기록 등)",
                ].map((e, i) => (
                  <div className="flex gap-1" key={i}>
                    <div className="h-3 flex items-center">
                      <div className="size-0.5 rounded-full bg-grayscale-gray5" />
                    </div>
                    {e}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Oath onCheckedChange={setChecked}>
            <OathDialog
              title={`${
                level === "elite" ? "엘리트" : "뉴"
              } 레벨 브리더 입점 서약서`}
              content={
                <>
                  <p>
                    본인은 포퐁 플랫폼 브리더 회원으로 입점함에 있어, 아래의
                    기준을 충실히 준수할 것을 서약합니다. 만약 이를 위반하거나
                    허위 사실이 적발될 경우, 플랫폼에서 즉시 퇴출될 수 있음을
                    이해하며 이에 동의합니다.
                  </p>
                  {oathInfo[level]}
                </>
              }
            >
              <button className="w-full">
                <OathLabel>
                  (필수) {level === "elite" ? "엘리트" : "뉴"} 레벨 브리더 입점
                  서약서
                </OathLabel>
              </button>
            </OathDialog>
          </Oath>
        </div>
      </SignupFormItems>

      <SignupFormItems className="gap-4 ">
        <div className="flex gap-3">
          <DocumentSkipDialogTrigger asChild>
            <Button
              className="bg-tertiary-700 text-grayscale-gray6! py-3 px-4 hover:bg-tertiary-800 hover:text-grayscale-gray6!"
              variant="tertiary"
            >
              나중에 할래요
            </Button>
          </DocumentSkipDialogTrigger>

          <Button variant={"tertiary"} className="py-3 px-4 w-full flex-1">
            제출
          </Button>
        </div>
        <UndoButton />
      </SignupFormItems>
    </SignupFormSection>
  );
}
