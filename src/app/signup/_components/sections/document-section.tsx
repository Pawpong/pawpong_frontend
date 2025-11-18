"use client"

import Crown from "@/assets/icons/crown"
import Plant from "@/assets/icons/plant"
import SignupFormDescription from "@/components/signup-form-section/signup-form-description"
import SignupFormHeader from "@/components/signup-form-section/signup-form-header"
import SignupFormItems from "@/components/signup-form-section/signup-form-items"
import SignupFormSection from "@/components/signup-form-section/signup-form-section"
import SignupFormTitle from "@/components/signup-form-section/signup-form-title"
import UndoButton from "@/components/signup-form-section/undo-button"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { completeBreederRegistration, uploadBreederDocuments } from "@/lib/auth"
import useSignupFormStore from "@/stores/signup-form-store"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { useState } from "react"
import DocumentSkipDialogTrigger from "../document-skip-dialog-trigger"
import OathDialogTrigger from "../oath-dialog-trigger"
import FileButton from "./file-button"

// 서류 타입 매핑 (백엔드 camelCase 형식에 맞춤)
const DOCUMENT_TYPES = {
  ID_CARD: "idCard",
  ANIMAL_LICENSE: "animalProductionLicense",
  CONTRACT_SAMPLE: "adoptionContractSample",
  PEDIGREE: "recentAssociationDocument",
  BREEDER_CERT: "breederCertification",
} as const

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
]

export default function DocumentSection() {
  const router = useRouter()
  const level = useSignupFormStore((e) => e.level)
  const setLevel = useSignupFormStore((e) => e.setLevel)
  const nextFlowIndex = useSignupFormStore((e) => e.nextFlowIndex)

  // Social login info
  const tempId = useSignupFormStore((e) => e.tempId)
  const provider = useSignupFormStore((e) => e.provider)
  const email = useSignupFormStore((e) => e.email)
  const socialName = useSignupFormStore((e) => e.socialName)
  const phoneNumber = useSignupFormStore((e) => e.phoneNumber)
  const agreements = useSignupFormStore((e) => e.agreements)

  // Breeder info
  const animal = useSignupFormStore((e) => e.animal)
  const plan = useSignupFormStore((e) => e.plan)
  const breederName = useSignupFormStore((e) => e.breederName)
  const breederLocation = useSignupFormStore((e) => e.breederLocation)
  const breeds = useSignupFormStore((e) => e.breeds)

  const [check, setCheck] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<
    { type: string; file: File }[]
  >([])
  const [uploading, setUploading] = useState(false)

  // 파일 업로드 핸들러
  const handleFileUpload = (type: string) => (file: File) => {
    setUploadedFiles((prev) => {
      // 같은 타입의 파일이 있으면 교체, 없으면 추가
      const filtered = prev.filter((f) => f.type !== type)
      return [...filtered, { type, file }]
    })
  }

  // Complete breeder registration
  const handleSubmit = async () => {
    if (!check) {
      alert("브리더 입점 서약서에 동의해주세요.")
      return
    }

    if (!tempId) {
      alert("소셜 로그인 정보가 없습니다. 다시 로그인해주세요.")
      router.push("/login")
      return
    }

    // Parse location into city and district
    const locationParts = breederLocation?.split(" ") || ["", ""]
    const city = locationParts[0] || ""
    const district = locationParts.slice(1).join(" ") || ""

    setSubmitting(true)

    try {
      // 1단계: 파일이 있으면 먼저 업로드
      if (uploadedFiles.length > 0) {
        setUploading(true)
        console.log("=== Uploading Documents ===", uploadedFiles.length)

        await uploadBreederDocuments(tempId, uploadedFiles, level)

        console.log("=== Documents Uploaded Successfully ===")
        setUploading(false)
      }

      // 2단계: 회원가입 완료
      const requestData = {
        tempId,
        provider,
        email,
        name: socialName,
        phone: phoneNumber.replace(/-/g, ""),
        petType: animal || "",
        plan: plan || "",
        breederName,
        city,
        district,
        breeds,
        level,
        marketingAgreed: agreements.marketing,
      }

      console.log("=== Breeder Registration Request ===", requestData)

      const result = await completeBreederRegistration(requestData)

      // HttpOnly 쿠키에 저장
      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        }),
      })

      // 다음 단계 진행 (SignupComplete)
      nextFlowIndex()
    } catch (error) {
      console.error("=== Breeder Registration Error ===", error)
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert("회원가입에 실패했습니다.")
      }
    } finally {
      setSubmitting(false)
      setUploading(false)
    }
  }

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
            <FileButton onUpload={handleFileUpload(DOCUMENT_TYPES.ID_CARD)}>
              신분증 사본
            </FileButton>
            <div className="text-secondary-700 font-medium text-caption-s">
              이름과 생년월일 이외에는 가려서 제출하시길 권장드립니다.
            </div>
          </div>
          <div className="space-y-3">
            <FileButton
              onUpload={handleFileUpload(DOCUMENT_TYPES.ANIMAL_LICENSE)}
            >
              동물생산업 등록증
            </FileButton>
            {level === "elite" && (
              <>
                <FileButton
                  onUpload={handleFileUpload(DOCUMENT_TYPES.CONTRACT_SAMPLE)}
                >
                  표준 입양계약서 샘플
                </FileButton>

                <div className="space-y-2.5">
                  <FileButton
                    onUpload={handleFileUpload(DOCUMENT_TYPES.PEDIGREE)}
                  >
                    최근 발급된 혈통서 사본
                  </FileButton>
                  <div className="text-grayscale-gray5 font-medium text-caption-s">
                    분양 예정인 개체의 혈통서를 첨부해 주세요
                  </div>
                </div>
              </>
            )}
          </div>
          {level === "elite" && (
            <div className="space-y-2.5">
              <FileButton
                onUpload={handleFileUpload(DOCUMENT_TYPES.BREEDER_CERT)}
              >
                고양이 브리더 인증 서류
              </FileButton>
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
          <OathDialogTrigger
            className="cursor-pointer"
            onAgree={() => {
              setCheck(true)
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
                        e.stopPropagation()
                        setCheck(false)
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
              disabled={submitting}
            >
              나중에 할래요
            </Button>
          </DocumentSkipDialogTrigger>

          <Button
            variant={"tertiary"}
            className="py-3 px-4 w-full flex-1"
            onClick={handleSubmit}
            disabled={submitting || !check}
          >
            {uploading
              ? "서류 업로드 중..."
              : submitting
              ? "회원가입 중..."
              : "제출"}
          </Button>
        </div>
        <UndoButton />
      </SignupFormItems>
    </SignupFormSection>
  )
}
