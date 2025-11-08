"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import LevelBadge from "@/components/level-badge";
import Image from "next/image";
import RightArrow from "@/assets/icons/right-arrow.svg";
import Close from "@/assets/icons/close";
import { cn } from "@/lib/utils";

interface ReviewWriteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  breederName: string;
  breederLevel: "elite" | "new";
  applicationDate: string;
  profileImage: string;
  animalType: "cat" | "dog";
}

export default function ReviewWriteDialog({
  open,
  onOpenChange,
  breederName,
  breederLevel,
  applicationDate,
  profileImage,
  animalType,
}: ReviewWriteDialogProps) {
  const [activeTab, setActiveTab] = useState<"상담 후기" | "입양 후기">(
    "상담 후기"
  );
  const [reviewText, setReviewText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[37.5rem] w-full min-h-[37.5rem] max-h-[41.3125rem] md:min-h-[37.5rem] md:max-h-[41.3125rem] overflow-hidden flex flex-col p-0 gap-0"
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>후기 작성</DialogTitle>
        </VisuallyHidden>
        {/* 헤더 */}
        <div className="flex flex-col gap-[10px] items-start pt-6 px-5 pb-[10px] md:pt-6 md:px-6 md:pb-[10px]">
          <div className="flex gap-1 items-center justify-end w-full">
            <DialogClose asChild>
              <Button variant="secondary" size="icon">
                <Close className="size-7" />
              </Button>
            </DialogClose>
          </div>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-grayscale-gray2 w-full" />

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div className="bg-[var(--color-tertiary-500)] flex flex-col gap-5 min-h-0 overflow-y-auto px-5 pt-6 pb-[9.25rem] scrollbar-custom md:px-6 md:pb-[4.5rem]">
          {/* 브리더 정보 */}
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-5 items-center grow">
              {/* 프로필 이미지 */}
              <div className="relative shrink-0 size-[68px] rounded-lg overflow-hidden">
                <Image
                  src={profileImage}
                  alt={breederName}
                  width={68}
                  height={68}
                  className="object-cover w-full h-full"
                />
                {/* 동물 타입 배지 */}
                <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-grayscale-gray1)] flex items-center justify-center py-1.5 px-1.5">
                  <p className="text-caption font-medium text-grayscale-gray6 text-center">
                    {animalType === "cat" ? "고양이" : "강아지"}
                  </p>
                </div>
              </div>

              {/* 브리더 정보 */}
              <div className="flex flex-col gap-3 items-start grow">
                <div className="flex gap-2 items-center">
                  <p className="text-body-l font-semibold text-primary w-[70px]">
                    {breederName}
                  </p>
                  <LevelBadge level={breederLevel} />
                </div>
                <p className="text-body-s font-normal text-grayscale-gray5 whitespace-nowrap">
                  {applicationDate}
                </p>
              </div>
            </div>
            <Button className="gap-1 text-grayscale-gray5 text-body-xs h-auto p-0 has-[>svg]:px-0 hover:bg-transparent">
              <span>보기</span>
              <RightArrow className="size-5" />
            </Button>
          </div>

          {/* 탭 및 후기 작성 영역 */}
          <div className="flex flex-col gap-5 items-start w-full">
            {/* 탭 */}
            <div className="flex gap-4 items-start">
              <button
                onClick={() => setActiveTab("상담 후기")}
                className="flex flex-col items-start"
              >
                <p
                  className={cn(
                    "text-body-m font-semibold",
                    activeTab === "상담 후기"
                      ? "text-primary"
                      : "text-grayscale-gray5"
                  )}
                >
                  상담 후기
                </p>
                <div className="h-[2px] w-full mt-1.5">
                  {activeTab === "상담 후기" && (
                    <div className="bg-primary-500 h-[2px] w-full" />
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("입양 후기")}
                className="flex flex-col items-start"
              >
                <p
                  className={cn(
                    "text-body-m font-semibold",
                    activeTab === "입양 후기"
                      ? "text-primary"
                      : "text-grayscale-gray5"
                  )}
                >
                  입양 후기
                </p>
                <div className="h-[2px] w-full mt-1.5">
                  {activeTab === "입양 후기" && (
                    <div className="bg-primary-500 h-[2px] w-full" />
                  )}
                </div>
              </button>
            </div>

            {/* 후기 작성 Textarea */}
            <div className="bg-white flex flex-col items-start overflow-clip rounded-lg w-full">
              <div className="box-border flex flex-col gap-[var(--space-16)] items-start overflow-clip pb-0 pt-[var(--space-12)] px-[var(--space-16)] relative shrink-0 w-full">
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={
                    activeTab === "상담 후기"
                      ? "브리더님과의 상담은 어떠셨나요?"
                      : "입양하는 과정은 어떠셨나요?"
                  }
                  maxLength={800}
                  showLength={false}
                  currentLength={reviewText.length}
                  className="min-h-[140px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-body-s placeholder:text-grayscale-gray5"
                />
              </div>
              <div className="bg-white box-border flex gap-[10px] items-center justify-end pb-[var(--space-12)] pt-[var(--space-16)] px-[var(--space-16)] relative rounded-bl-lg rounded-br-lg shrink-0 w-full min-h-[44px]">
                <p
                  className={`text-[14px] font-medium text-grayscale-gray5 text-right leading-[20px] ${
                    isFocused ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="text-[#4e9cf1]">{reviewText.length}</span>
                  /800
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-grayscale-gray2 w-full shrink-0" />

        {/* 하단 버튼 */}
        <div className="bg-white flex gap-2.5 items-start justify-end overflow-clip pb-4 pt-4 px-5 md:pb-6 md:pt-4 md:px-6 shrink-0">
          <button className="button-brown">후기 작성하기</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
