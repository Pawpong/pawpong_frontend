'use client';

import { useState, useEffect } from 'react';
import {
  LargeDialog,
  LargeDialogContent,
  LargeDialogHeader,
  LargeDialogTitle,
  LargeDialogFooter,
  LargeDialogClose,
} from '@/components/ui/large-dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import Close from '@/assets/icons/close';
import RadioActive from '@/assets/icons/radio-active.svg';
import RadioInactive from '@/assets/icons/radio-inactive.svg';
import { withdrawReasons, breederWithdrawReasons, withdrawTitle, withdrawDescription } from '@/constants/withdraw';
import AdoptionCompleteDialog from './adoption-complete-dialog';

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string, otherReason?: string) => void;
  userType?: 'adopter' | 'breeder';
}

export default function WithdrawDialog({ open, onOpenChange, onConfirm, userType = 'adopter' }: WithdrawDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReasonText, setOtherReasonText] = useState<string>('');
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [isAdoptionCompleteDialogOpen, setIsAdoptionCompleteDialogOpen] = useState(false);

  const isOtherSelected = selectedReason === 'other';
  const isBreeder = userType === 'breeder';
  const reasons = isBreeder ? breederWithdrawReasons : withdrawReasons;

  // 다이얼로그가 열릴 때 초기화
  useEffect(() => {
    if (open) {
      setSelectedReason(null);
      setOtherReasonText('');
      setIsTextareaFocused(false);
      setIsAdoptionCompleteDialogOpen(false);
    }
  }, [open]);

  const handleClose = () => {
    onOpenChange(false);
    setSelectedReason(null);
    setOtherReasonText('');
    setIsTextareaFocused(false);
    setIsAdoptionCompleteDialogOpen(false);
  };

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    // 일반 사용자이고 "이미 입양을 마쳤어요" 선택 시 입양 완료 다이얼로그 열기
    if (!isBreeder && reason === 'already_adopted') {
      setIsAdoptionCompleteDialogOpen(true);
    }
  };

  const handleConfirm = () => {
    if (selectedReason) {
      if (isOtherSelected) {
        onConfirm(selectedReason, otherReasonText);
      } else {
        onConfirm(selectedReason);
      }
      handleClose();
    }
  };

  const handleAdoptionCompleteConfirm = (source: string, otherSource?: string) => {
    // 입양 완료 정보와 함께 탈퇴 처리
    console.log('입양 경로:', source);
    if (otherSource) {
      console.log('기타 경로:', otherSource);
    }
    // 탈퇴 처리
    onConfirm('already_adopted', `입양경로: ${source}${otherSource ? ` - ${otherSource}` : ''}`);
    handleClose();
  };

  return (
    <>
      <LargeDialog open={open} onOpenChange={handleClose}>
        <LargeDialogContent className="w-full md:w-[600px] h-full md:h-auto flex flex-col md:rounded-2xl overflow-hidden">
          {/* Header */}
          <LargeDialogHeader className="px-5 md:px-6 pt-4 md:pt-6 pb-2.5 md:pb-2.5 border-b-0">
            <LargeDialogTitle>
              <div className="flex justify-end items-center gap-1 md:gap-1">
                <LargeDialogClose asChild>
                  <Button variant="secondary" className="size-9 shrink-0">
                    <Close className="size-5 text-grayscale-gray7" />
                  </Button>
                </LargeDialogClose>
              </div>
            </LargeDialogTitle>
          </LargeDialogHeader>

          <Separator className="bg-grayscale-gray2" />

          {/* Content */}
          <div
            className={`bg-[#F6F6EA] px-5 md:px-6 pt-6 md:pt-6 flex flex-1 sm:flex-none flex-col gap-9 md:gap-9 overflow-x-clip overflow-y-auto sm:h-[452px] shrink-0 ${
              isOtherSelected ? 'pb-10' : 'pb-[7.44rem]'
            }`}
          >
            {/* Title Section */}
            <div className="flex flex-col gap-1.5">
              <h2 className="text-body-l font-semibold text-primary-500">{withdrawTitle}</h2>
              <p className="text-caption font-medium text-grayscale-gray5">{withdrawDescription}</p>
            </div>

            {/* Radio List */}
            <div className="flex flex-col gap-0">
              {reasons.map((reason) => {
                const isOther = reason.value === 'other';
                return (
                  <div key={reason.value} className="flex flex-col items-start relative shrink-0 w-full">
                    <button
                      type="button"
                      onClick={() => handleReasonSelect(reason.value)}
                      className="flex items-center gap-2 px-0 pr-[10px] py-2 h-9 w-full text-left"
                    >
                      {/* Radio Button */}
                      <div className="relative shrink-0 size-5">
                        {selectedReason === reason.value ? (
                          <RadioActive className="size-5" />
                        ) : (
                          <RadioInactive className="size-5" />
                        )}
                      </div>
                      {/* Label */}
                      <span className="text-body-xs font-medium text-grayscale-gray6">{reason.label}</span>
                    </button>
                    {/* 기타 사유 선택 시 textarea 표시 */}
                    {isOther && isOtherSelected && (
                      <div className="bg-white flex flex-col items-start overflow-clip relative rounded-lg shrink-0 w-full">
                        <div className="box-border flex flex-col items-start overflow-clip pb-0 pt-3 px-4 sm:pt-4 sm:px-4 relative shrink-0 w-full">
                          <Textarea
                            placeholder="탈퇴 사유를 최대한 상세히 적어주세요."
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
                            className="min-h-[12.5rem] font-medium leading-[24px] text-body-s w-full resize-none px-0 pt-0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator className="bg-grayscale-gray2" />

          {/* Footer */}
          <LargeDialogFooter className="px-5 md:px-6 pt-4 md:pt-4 pb-4 md:pb-6 justify-end border-t-0">
            <button
              className={`button-brown ${
                !selectedReason || (isOtherSelected && !otherReasonText.trim())
                  ? 'bg-[var(--color-status-disabled)] text-[var(--color-grayscale-gray4)] cursor-not-allowed'
                  : ''
              }`}
              onClick={handleConfirm}
              disabled={!selectedReason || (isOtherSelected && !otherReasonText.trim())}
            >
              탈퇴
            </button>
          </LargeDialogFooter>
        </LargeDialogContent>
      </LargeDialog>

      {/* 입양 완료 다이얼로그 */}
      <AdoptionCompleteDialog
        open={isAdoptionCompleteDialogOpen}
        onOpenChange={setIsAdoptionCompleteDialogOpen}
        onConfirm={handleAdoptionCompleteConfirm}
      />
    </>
  );
}
