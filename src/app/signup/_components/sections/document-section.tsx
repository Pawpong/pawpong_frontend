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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import useSignupFormStore from "@/stores/signup-form-store";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import DocumentSkipDialogTrigger from "../document-skip-dialog-trigger";
import OathDialogTrigger from "../oath-dialog-trigger";
import FileButton from "./file-button";

const DOCUMENT_KEYS = {
  ID_CARD: "idCard",
  BUSINESS_LICENSE: "businessLicense",
  CONTRACT_SAMPLE: "contractSample",
  BREEDER_DOG: "breederDogCertificate",
  BREEDER_CAT: "breederCatCertificate",
} as const;

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
  const animal = useSignupFormStore((e) => e.animal);
  const documents = useSignupFormStore((e) => e.documents);
  const setDocuments = useSignupFormStore((e) => e.setDocuments);
  const [check, setCheck] = useState(false);

  const handleFileUpload = (key: string) => (file: File) => {
    setDocuments(key, file);
  };

  const handleFileDelete = (key: string) => () => {
    setDocuments(key, null);
  };

  const breederDocKey =
    animal === "dog" ? DOCUMENT_KEYS.BREEDER_DOG : DOCUMENT_KEYS.BREEDER_CAT;
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
        <div className="flex gap-5 items-stretch w-full">
          {levelInfo.map(({ name, icon: Icon, label }) => (
            <Button
              key={name}
              variant="ghost"
              className={cn(
                "flex flex-col gap-2 bg-transparent p-0 text-grayscale-gray5 hover:text-grayscale-gray6! flex-1",
                {
                  "text-primary-500": level === name,
                }
              )}
              onClick={() => setLevel(name as "elite" | "new")}
            >
              <div className="flex items-center gap-2 justify-center">
                <Icon className="size-7" />
                <div className="text-heading-3 font-semibold">{label}</div>
              </div>
              <div
                className={cn("h-0.5 w-full bg-transparent", {
                  "bg-primary-500": level === name,
                })}
              />
            </Button>
          ))}
        </div>
        <div className="text-primary-500/80 font-medium text-body-m text-balance text-center break-keep">
          {levelInfo.find((e) => e.name === level)?.description}
        </div>
        <div className="flex flex-col gap-8 w-full">
          {/* 신분증 사본 - info 있음 */}
          <div className="flex flex-col gap-2.5">
            <FileButton
              file={documents[DOCUMENT_KEYS.ID_CARD] ?? null}
              onUpload={handleFileUpload(DOCUMENT_KEYS.ID_CARD)}
              onDelete={handleFileDelete(DOCUMENT_KEYS.ID_CARD)}
            >
              신분증 사본
            </FileButton>
            <div className="text-secondary-700 font-medium text-caption">
              이름과 생년월일 이외에는 가려서 제출하시는 걸 권장드려요.
            </div>
          </div>

          {/* 동물생산업 등록증, 표준 입양계약서 샘플*/}
          <div className="flex flex-col gap-3">
            <FileButton
              file={documents[DOCUMENT_KEYS.BUSINESS_LICENSE] ?? null}
              onUpload={handleFileUpload(DOCUMENT_KEYS.BUSINESS_LICENSE)}
              onDelete={handleFileDelete(DOCUMENT_KEYS.BUSINESS_LICENSE)}
            >
              동물생산업 등록증
            </FileButton>
            {level === "elite" && (
              <FileButton
                file={documents[DOCUMENT_KEYS.CONTRACT_SAMPLE] ?? null}
                onUpload={handleFileUpload(DOCUMENT_KEYS.CONTRACT_SAMPLE)}
                onDelete={handleFileDelete(DOCUMENT_KEYS.CONTRACT_SAMPLE)}
              >
                표준 입양계약서 샘플
              </FileButton>
            )}
          </div>

          {/* 브리더 인증 서류 - info 있음 (elite만) */}
          {level === "elite" && (
            <div className="flex flex-col gap-2.5">
              <FileButton
                file={documents[breederDocKey] ?? null}
                onUpload={handleFileUpload(breederDocKey)}
                onDelete={handleFileDelete(breederDocKey)}
              >
                {animal === "dog"
                  ? "강아지 브리더 인증 서류"
                  : "고양이 브리더 인증 서류"}
              </FileButton>
              <div className="flex flex-col gap-2">
                <p className="text-grayscale-gray5 font-medium text-caption">
                  해당되는 서류를 하나 골라 첨부해 주세요
                </p>
                <div className="flex flex-col gap-2">
                  {animal === "dog" ? (
                    <>
                      <div className="flex gap-1 items-start">
                        <div className="h-3 flex items-center pt-0.5">
                          <div className="size-0.5 rounded-full bg-grayscale-gray5" />
                        </div>
                        <span className="text-grayscale-gray5 font-medium text-caption">
                          애견연맹견사호등록증
                        </span>
                      </div>
                      <div className="flex gap-1 items-start">
                        <div className="h-3 flex items-center pt-0.5">
                          <div className="size-0.5 rounded-full bg-grayscale-gray5" />
                        </div>
                        <span className="text-grayscale-gray5 font-medium text-caption">
                          도그쇼 참가 증빙 자료(참가 확인증, 수상 기록, 공식
                          프로그램 등에 게재된 기록 등)
                        </span>
                      </div>
                    </>
                  ) : (
                    [
                      "TICA 또는 CFA 등록 확인서 (브리더 회원증/캐터리 등록증)",
                      "캣쇼 참가 증빙 자료 (참가 확인증, 수상 기록, 공식 프로그램 등에 게재된 기록 등)",
                    ].map((e, i) => (
                      <div className="flex gap-1 items-start" key={i}>
                        <div className="h-3 flex items-center pt-0.5">
                          <div className="size-0.5 rounded-full bg-grayscale-gray5" />
                        </div>
                        <span className="text-grayscale-gray5 font-medium text-caption">
                          {e}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          <OathDialogTrigger
            className="cursor-pointer"
            onAgree={() => {
              setCheck(true);
            }}
            asChild
            level={level}
          >
            <div className="flex items-center">
              <div className="flex-1 flex items-center gap-2 py-2 pr-2.5 font-medium">
                <div className="size-5 flex items-center justify-center">
                  <Checkbox
                    checked={check}
                    onClick={(e) => {
                      if (check === true) {
                        e.stopPropagation();
                        setCheck(false);
                      }
                    }}
                  />
                </div>
                <span className="text-body-xs text-grayscale-gray6 select-none">
                  (필수) {level === "elite" ? "엘리트" : "뉴"} 레벨 브리더 입점
                  서약서
                </span>
              </div>

              <Button
                variant="ghost"
                className="flex items-center gap-2.5 text-grayscale-gray5 text-body-xs"
              >
                <div>보기</div>
                <div className="size-5 flex items-center justify-center">
                  <ChevronRight className="size-4" />
                </div>
              </Button>
            </div>
          </OathDialogTrigger>
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
