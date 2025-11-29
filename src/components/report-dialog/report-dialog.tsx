"use client";

import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import Close from "@/assets/icons/close";
import RadioActive from "@/assets/icons/radio-active.svg";
import RadioInactive from "@/assets/icons/radio-inactive.svg";
import {
  reportDescription,
  reportReasons,
  reportTitle,
  type ReportReason,
} from "@/constants/report";
import {
  breederReportDescription,
  breederReportReasons,
  breederReportTitle,
} from "@/constants/breeder-report";
import ReportSuccessDialog from "./report-success-dialog";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: "review" | "breeder";
  breederNickname?: string;
}

export default function ReportDialog({
  open,
  onOpenChange,
  type = "review",
  breederNickname,
}: ReportDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReasonText, setOtherReasonText] = useState<string>("");
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const isOtherSelected = selectedReason === "other";

  const isBreederReport = type === "breeder";
  const title = isBreederReport
    ? breederReportTitle(breederNickname || "")
    : reportTitle;
  const description = isBreederReport
    ? breederReportDescription
    : reportDescription;
  const reasons = isBreederReport
    ? Object.entries(breederReportReasons).map(([key, label]) => ({
        key,
        label,
      }))
    : reportReasons;

  const handleSubmit = () => {
    // TODO: 신고 API 호출
    console.log("신고 사유:", selectedReason);
    if (isOtherSelected) {
      console.log("기타 사유:", otherReasonText);
    }
    // 신고 다이얼로그 닫고 완료 다이얼로그 열기
    onOpenChange(false);
    setIsSuccessDialogOpen(true);
  };

  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false);
    setSelectedReason(null);
    setOtherReasonText("");
    setIsTextareaFocused(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setSelectedReason(null);
      setOtherReasonText("");
      setIsTextareaFocused(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-w-[24.5625rem] sm:max-w-[37.5rem] w-full p-0 gap-0 overflow-hidden rounded-2xl"
          showCloseButton={false}
        >
          {/* 상단 헤더 */}
          <div className="bg-white flex flex-col gap-[10px] items-start overflow-clip pb-[10px] pt-6 px-6 shrink-0 w-full">
            <div className="flex gap-1 items-center justify-end relative shrink-0 w-full">
              <DialogClose asChild>
                <Button variant="secondary" size="icon">
                  <Close className="size-7" />
                </Button>
              </DialogClose>
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-grayscale-gray2 w-full shrink-0" />

          {/* 콘텐츠 영역 */}
          <div className="bg-[var(--color-tertiary-500)] flex flex-col gap-9 h-[452px] items-start overflow-x-clip overflow-y-auto pb-[7.44rem] sm:pb-10 pt-6 px-6 relative shrink-0 w-full">
            {/* 제목 */}
            <div className="flex flex-col gap-1.5 items-start not-italic relative shrink-0">
              <p className="font-semibold leading-[32px] relative shrink-0 text-primary text-[20px]">
                {title}
              </p>
              <p className="font-medium leading-[12px] relative shrink-0 text-grayscale-gray5 text-[12px]">
                {description}
              </p>
            </div>

            {/* 라디오 버튼 리스트 */}
            <div className="flex flex-col items-start relative shrink-0 w-full">
              {reasons.map(
                (
                  reason: ReportReason | { key: string; label: string },
                  index: number
                ) => {
                  const reasonValue =
                    "value" in reason ? reason.value : reason.key;
                  const reasonLabel = reason.label;
                  const isOther =
                    reasonValue === "other" ||
                    reasonLabel === "기타 부적절한 사유가 있어요.";

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-start relative shrink-0 w-full"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedReason(reasonValue)}
                        className="box-border flex gap-2 h-9 items-start pl-0 pr-[10px] py-2 relative shrink-0 w-full"
                      >
                        {/* 라디오 버튼 */}
                        <div className="relative shrink-0 size-5">
                          {selectedReason === reasonValue ? (
                            <RadioActive className="size-5" />
                          ) : (
                            <RadioInactive className="size-5" />
                          )}
                        </div>
                        {/* 텍스트 */}
                        <div className="flex flex-col font-medium justify-center leading-[0] not-italic relative shrink-0 text-grayscale-gray6 text-body-xs">
                          <p className="leading-[20px] whitespace-pre">
                            {reasonLabel}
                          </p>
                        </div>
                      </button>
                      {/* 기타 사유 선택 시 textarea 표시 */}
                      {isOther && isOtherSelected && (
                        <div className="bg-white flex flex-col items-start overflow-clip relative rounded-lg shrink-0 w-full mt-2">
                          <div className="box-border flex flex-col items-start overflow-clip pb-0 pt-3 px-4 sm:pt-4 sm:px-4 relative shrink-0 w-full">
                            <Textarea
                              placeholder="신고 사유를 최대한 상세히 적어주세요."
                              value={otherReasonText}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 200) {
                                  setOtherReasonText(value);
                                }
                              }}
                              onFocus={() => setIsTextareaFocused(true)}
                              onBlur={() => setIsTextareaFocused(false)}
                              maxLength={200}
                              showLength={isTextareaFocused}
                              currentLength={otherReasonText.length}
                              className="h-[12.5rem] sm:min-h-[140px] font-medium leading-[24px] text-body-s w-full resize-none px-0 pt-0"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-grayscale-gray2 w-full shrink-0" />

          {/* 하단 버튼 영역 */}
          <div className="bg-white flex gap-[10px] items-start justify-end overflow-clip py-4 px-5 sm:pb-6 sm:pt-4 sm:px-6 relative rounded-bl-2xl rounded-br-2xl shrink-0 w-full">
            <button
              className={`button-brown ${
                !selectedReason || (isOtherSelected && !otherReasonText.trim())
                  ? "bg-[var(--color-status-disabled)] text-[var(--color-grayscale-gray4)] cursor-not-allowed"
                  : ""
              }`}
              onClick={handleSubmit}
              disabled={
                !selectedReason || (isOtherSelected && !otherReasonText.trim())
              }
            >
              신고
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 신고 완료 다이얼로그 */}
      <ReportSuccessDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
        onConfirm={handleSuccessDialogClose}
      />
    </>
  );
}
