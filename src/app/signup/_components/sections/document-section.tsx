"use client";

import Crown from "@/assets/icons/crown";
import Plant from "@/assets/icons/plant";
import SignupFormDescription from "@/components/signup-form-section/signup-form-description";
import SignupFormHeader from "@/components/signup-form-section/signup-form-header";
import SignupFormItems from "@/components/signup-form-section/signup-form-items";
import SignupFormSection from "@/components/signup-form-section/signup-form-section";
import SignupFormTitle from "@/components/signup-form-section/signup-form-title";
import UndoButton from "@/components/signup-form-section/undo-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useSignupFormStore from "@/stores/signup-form-store";
import DocumentSkipDialogTrigger from "./document-skip-dialog-trigger";
import FileButton from "./file-button";
import OathDialogTrigger from "./oath-dialog-trigger";

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
  return (
    <SignupFormSection className="gap-15 md:gap-20 lg:gap-20">
      <SignupFormHeader>
        <SignupFormTitle>브리더 입점 서류를 등록해 주세요</SignupFormTitle>
        <SignupFormDescription>
          브리더 활동 경험에 따라 적합한 레벨을 선택해 서류를 업로드해주세요.
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
        </div>
      </SignupFormItems>

      <SignupFormItems className="gap-4 ">
        <div className="flex gap-3">
          <DocumentSkipDialogTrigger asChild>
            <Button className="bg-grayscale-gray2 text-grayscale-gray5! py-3 px-4 hover:bg-grayscale-gray3 hover:text-primary!">
              나중에 할래요
            </Button>
          </DocumentSkipDialogTrigger>
          <OathDialogTrigger asChild level={level}>
            <Button variant={"tertiary"} className="py-3 px-4 w-full flex-1">
              제출
            </Button>
          </OathDialogTrigger>
        </div>
        <UndoButton />
      </SignupFormItems>
    </SignupFormSection>
  );
}
