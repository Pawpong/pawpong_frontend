"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import SmallDot from "@/assets/icons/small-dot.svg";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ProfileImageWithBadge from "@/components/breeder/profile-image-with-badge";
import BreederInfo from "@/components/breeder/breeder-info";
import RightArrow from "@/assets/icons/right-arrow.svg";
import Close from "@/assets/icons/close";
import { useCounselFormStore } from "@/stores/counsel-form-store";
import Arrow from "@/assets/icons/arrow";
import { cn } from "@/lib/utils";
import ReviewWriteDialog from "./review-write-dialog";
import { formatPhoneNumber } from "@/utils/phone";

interface ReviewDialogProps {
  breederId: string;
  breederName: string;
  breederLevel: "elite" | "new";
  applicationDate: string;
  profileImage: string;
  animalType: "cat" | "dog";
  children: React.ReactNode;
}

export default function ReviewDialog({
  breederName,
  breederLevel,
  applicationDate,
  profileImage,
  animalType,
  children,
}: ReviewDialogProps) {
  const { counselFormData } = useCounselFormStore();
  const [showReviewWriteDialog, setShowReviewWriteDialog] = useState(false);
  const [open, setOpen] = useState(false);

  const handleReviewWriteClick = () => {
    setOpen(false); // 첫 번째 다이얼로그 닫기
    setShowReviewWriteDialog(true); // 두 번째 다이얼로그 열기
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="max-w-[37.5rem] w-full max-h-[37.5rem] overflow-hidden flex flex-col p-0 gap-0 !animate-none data-[state=open]:!animate-none data-[state=closed]:!animate-none data-[state=open]:!fade-in-0 data-[state=closed]:!fade-out-0 data-[state=open]:!zoom-in-95 data-[state=closed]:!zoom-out-95 !duration-0"
          showCloseButton={false}
        >
          <VisuallyHidden>
            <DialogTitle>신청 내역 상세</DialogTitle>
          </VisuallyHidden>
          {/* 헤더 */}
          <div className="flex flex-col gap-[10px] items-start pt-6 px-6 pb-[10px]">
            <div className="flex gap-1 items-center justify-end w-full">
              <DialogClose asChild>
                <Button variant="secondary" size="icon">
                  <Close className="size-7" />
                </Button>
              </DialogClose>
            </div>
          </div>

          {/* 스크롤 가능한 콘텐츠 영역 */}
          <div className="bg-[var(--color-tertiary-500)] flex flex-col gap-9 min-h-0 overflow-y-auto pl-6 pr-6 pt-6 pb-10 ">
            {/* 브리더 정보 */}
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-5 items-center grow">
                <ProfileImageWithBadge
                  src={profileImage}
                  alt={breederName}
                  animalType={animalType}
                  size={68}
                />
                <BreederInfo
                  breederName={breederName}
                  breederLevel={breederLevel}
                  applicationDate={applicationDate}
                  className="gap-3"
                />
              </div>
              <Button className="gap-1 text-grayscale-gray5 text-body-xs h-auto p-0 has-[>svg]:px-0 hover:bg-transparent">
                <span>보기</span>
                <RightArrow className="size-5" />
              </Button>
            </div>

            {/* 구분선 */}
            <div className="w-full flex flex-col">
              <div className="h-px bg-grayscale-gray2 w-full" />
            </div>

            {/* 폼 내용 */}
            <div className="flex flex-col gap-12 md:gap-8 w-full">
              {/* 개인정보 동의 섹션 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  반려동물 입양 상담을 위한 개인정보 수집과 이용에 동의하시나요?
                </h2>
                <div className="flex flex-col gap-2.5 w-full">
                  <label className="bg-white flex gap-2 h-12 items-center px-4 py-2 rounded-lg cursor-pointer">
                    <Checkbox
                      checked={counselFormData?.privacyAgreement || false}
                      disabled
                    />
                    <span className="text-body-s font-medium text-grayscale-gray6">
                      동의합니다
                    </span>
                  </label>
                  <div className="flex flex-col gap-2 pl-1.5">
                    <div className="flex gap-1 items-start">
                      <SmallDot />
                      <p className="text-caption font-medium text-grayscale-gray5">
                        수집하는 개인정보 항목: 이름, 연락처, 이메일주소 등
                      </p>
                    </div>
                    <div className="flex gap-1 items-start">
                      <SmallDot />
                      <p className="text-caption font-medium text-grayscale-gray5">
                        수집 및 이용 목적: 입양자 상담 및 검토
                      </p>
                    </div>
                    <div className="flex gap-1 items-start">
                      <SmallDot />
                      <p className="text-caption font-medium text-grayscale-gray5">
                        보유 및 이용기간: 상담 또는 입양 직후 폐기
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <Input
                  value={counselFormData?.name || ""}
                  readOnly
                  placeholder="이름"
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                />
                <Input
                  value={
                    counselFormData?.phone
                      ? formatPhoneNumber(counselFormData.phone)
                      : ""
                  }
                  readOnly
                  placeholder="휴대폰 번호"
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                />
                <Input
                  value={counselFormData?.email || ""}
                  readOnly
                  placeholder="이메일 주소"
                  type="email"
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                />
              </div>

              {/* 구분선 */}
              <div className="h-px bg-grayscale-gray2 w-full my-7" />

              {/* 자기소개 섹션 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  간단하게 자기소개 부탁드려요.
                </h2>
                <Textarea
                  value={counselFormData?.introduction || ""}
                  readOnly
                  placeholder="성별, 연령대, 거주지, 결혼 계획, 생활 패턴 등"
                  maxLength={800}
                  showLength={(counselFormData?.introduction || "").length > 0}
                  currentLength={(counselFormData?.introduction || "").length}
                />
              </div>

              {/* 가족 구성원 섹션 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  함께 거주하는 가족 구성원을 알려주세요.
                </h2>
                <Input
                  value={counselFormData?.familyMembers || ""}
                  readOnly
                  placeholder="인원 수, 관계, 연령대 등"
                  className="h-12"
                />
              </div>

              {/* 가족 동의 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  모든 가족 구성원들이 입양에 동의하셨나요?
                </h2>
                <label className="bg-white flex gap-2 h-12 w-full items-center px-4 py-2 rounded-lg cursor-pointer">
                  <Checkbox
                    checked={counselFormData?.familyAgreement || false}
                    disabled
                  />
                  <span className="text-body-s font-medium text-grayscale-gray6">
                    네
                  </span>
                </label>
              </div>

              {/* 알러지 검사 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  본인을 포함한 모든 가족 구성원분들께서 알러지 검사를
                  마치셨나요?
                </h2>
                <Input
                  value={counselFormData?.allergyCheck || ""}
                  readOnly
                  placeholder="알러지 검사 여부와 결과(유무), 혹은 향후 계획"
                  className="h-12"
                />
              </div>

              {/* 구분선 */}
              <div className="h-px bg-grayscale-gray2 w-full my-7" />

              {/* 생활 패턴 섹션 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  평균적으로 집을 비우는 시간은 얼마나 되나요?
                </h2>
                <Input
                  value={counselFormData?.awayTime || ""}
                  readOnly
                  placeholder="출퇴근·외출 시간을 포함해 하루 중 집을 비우는 시간"
                  className="h-12"
                />
              </div>

              {/* 생활 공간 */}
              <div className="flex flex-col gap-2.5 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  아이와 함께 지내게 될 공간을 소개해 주세요.
                </h2>
                <div className="w-full">
                  <Textarea
                    value={counselFormData?.livingSpace || ""}
                    readOnly
                    placeholder="반려동물이 주로 생활할 공간(예: 거실 등)과 환경(크기, 구조 등)"
                    maxLength={800}
                    showLength={(counselFormData?.livingSpace || "").length > 0}
                    currentLength={(counselFormData?.livingSpace || "").length}
                  />
                  <p className="text-caption font-medium text-grayscale-gray5 mt-2.5">
                    아이들은 철장, 베란다, 야외 등 열악한 공간에서는 지낼 수
                    없어요
                  </p>
                </div>
              </div>

              {/* 이전 반려동물 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  현재 함께하는, 또는 이전에 함께했던 반려동물에 대해
                  알려주세요.
                </h2>
                <Textarea
                  value={counselFormData?.previousPets || ""}
                  readOnly
                  placeholder="반려동물의 품종, 성격, 함께한 기간, 이별 사유 등"
                  maxLength={800}
                  showLength={(counselFormData?.previousPets || "").length > 0}
                  currentLength={(counselFormData?.previousPets || "").length}
                />
              </div>

              {/* 구분선 */}
              <div className="h-px bg-grayscale-gray2 w-full my-7" />

              {/* 케어 관련 섹션 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  정기 예방접종·건강검진·훈련 등 기본 케어를 책임지고 해주실 수
                  있나요?
                </h2>
                <label className="bg-white flex gap-2 h-12 w-full items-center px-4 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
                  <Checkbox
                    checked={counselFormData?.basicCare || false}
                    disabled
                  />
                  <span className="text-body-s font-medium text-grayscale-gray6">
                    네
                  </span>
                </label>
              </div>

              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  예상치 못한 질병이나 사고 등으로 치료비가 발생할 경우 감당
                  가능하신가요?
                </h2>
                <label className="bg-white flex gap-2 h-12 w-full items-center px-4 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
                  <Checkbox
                    checked={counselFormData?.medicalExpense || false}
                    disabled
                  />
                  <span className="text-body-s font-medium text-grayscale-gray6">
                    네
                  </span>
                </label>
              </div>

              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  모든 아이들은 중성화 후 분양되거나, 입양 후 중성화를 진행해야
                  합니다. 동의하십니까?
                </h2>
                <label className="bg-white flex gap-2 h-12 w-full items-center px-4 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
                  <Checkbox
                    checked={counselFormData?.neuteringAgreement || false}
                    disabled
                  />
                  <span className="text-body-s font-medium text-grayscale-gray6">
                    동의합니다
                  </span>
                </label>
              </div>

              {/* 구분선 */}
              <div className="h-px bg-grayscale-gray2 w-full my-7" />

              {/* 선택 사항 섹션 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  마음에 두신 아이가 있으신가요?
                </h2>
                <Button
                  variant="input"
                  size={undefined}
                  className="!px-[var(--space-16)] !py-[var(--space-12)] w-full group"
                  disabled
                >
                  <span
                    className={cn(
                      "text-body-s font-medium",
                      counselFormData?.interestedAnimal
                        ? "text-[#4F3B2E]"
                        : "text-grayscale-gray5"
                    )}
                  >
                    {counselFormData?.interestedAnimal || "분양 중인 아이"}
                  </span>
                  <Arrow className="size-5 group-hover:[&_path]:fill-[#4F3B2E]" />
                </Button>
                {counselFormData?.interestedAnimal === "특징 직접 입력" && (
                  <Textarea
                    value={counselFormData?.interestedAnimalDetails || ""}
                    readOnly
                    placeholder="원하시는 아이의 특징을 자유롭게 입력해주세요"
                    maxLength={800}
                    showLength={
                      (counselFormData?.interestedAnimalDetails || "").length >
                      0
                    }
                    currentLength={
                      (counselFormData?.interestedAnimalDetails || "").length
                    }
                    className="text-color-primary-500-basic"
                  />
                )}
              </div>

              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  원하시는 입양 시기가 있나요?
                </h2>
                <Input
                  value={counselFormData?.adoptionTiming || ""}
                  readOnly
                  className="h-12"
                />
              </div>

              {/* 구분선 */}
              <div className="h-px bg-grayscale-gray2 w-full my-7" />

              {/* 마지막 메시지 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  마지막으로 궁금하신 점이나 남기시고 싶으신 말씀이 있나요?
                </h2>
                <Textarea
                  value={counselFormData?.additionalMessage || ""}
                  readOnly
                  maxLength={800}
                  showLength={
                    (counselFormData?.additionalMessage || "").length > 0
                  }
                  currentLength={
                    (counselFormData?.additionalMessage || "").length
                  }
                />
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-grayscale-gray2 w-full shrink-0" />

          {/* 하단 버튼 */}
          <div className="bg-white flex gap-2.5 items-start justify-end overflow-clip pb-6 pt-4 px-6 shrink-0">
            <button className="button-brown" onClick={handleReviewWriteClick}>
              후기 작성하기
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 후기 작성 다이얼로그 */}
      <ReviewWriteDialog
        open={showReviewWriteDialog}
        onOpenChange={setShowReviewWriteDialog}
        breederName={breederName}
        breederLevel={breederLevel}
        applicationDate={applicationDate}
        profileImage={profileImage}
        animalType={animalType}
      />
    </>
  );
}
