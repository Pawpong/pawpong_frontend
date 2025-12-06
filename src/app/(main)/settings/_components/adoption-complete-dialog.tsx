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
import { adoptionSources, adoptionCompleteTitle, adoptionCompleteDescription } from '@/constants/adoption-complete';

interface AdoptionCompleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (source: string, otherSource?: string) => void;
}

export default function AdoptionCompleteDialog({ open, onOpenChange, onConfirm }: AdoptionCompleteDialogProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [otherSourceText, setOtherSourceText] = useState<string>('');
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  const isOtherSelected = selectedSource === 'other';

  // 다이얼로그가 열릴 때 초기화
  useEffect(() => {
    if (open) {
      setSelectedSource(null);
      setOtherSourceText('');
      setIsTextareaFocused(false);
    }
  }, [open]);

  const handleClose = () => {
    onOpenChange(false);
    setSelectedSource(null);
    setOtherSourceText('');
    setIsTextareaFocused(false);
  };

  const handleConfirm = () => {
    if (selectedSource) {
      if (isOtherSelected) {
        onConfirm(selectedSource, otherSourceText);
      } else {
        onConfirm(selectedSource);
      }
      handleClose();
    }
  };

  return (
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
            <h2 className="text-body-l font-semibold text-primary">{adoptionCompleteTitle}</h2>
            <p className="text-caption font-medium text-grayscale-gray5">{adoptionCompleteDescription}</p>
          </div>

          {/* Radio List */}
          <div className="flex flex-col gap-0">
            {adoptionSources.map((source) => {
              const isOther = source.value === 'other';
              return (
                <div key={source.value} className="flex flex-col items-start relative shrink-0 w-full">
                  <button
                    type="button"
                    onClick={() => setSelectedSource(source.value)}
                    className="flex items-center gap-2 px-0 pr-[10px] py-2 h-9 w-full text-left"
                  >
                    {/* Radio Button */}
                    <div className="relative shrink-0 size-5">
                      {selectedSource === source.value ? (
                        <RadioActive className="size-5" />
                      ) : (
                        <RadioInactive className="size-5" />
                      )}
                    </div>
                    {/* Label */}
                    <span className="text-body-xs font-medium text-grayscale-gray6">{source.label}</span>
                  </button>
                  {/* 기타 선택 시 textarea 표시 */}
                  {isOther && isOtherSelected && (
                    <div className="bg-white flex flex-col items-start overflow-clip relative rounded-lg shrink-0 w-full mt-2">
                      <div className="box-border flex flex-col items-start overflow-clip pb-0 pt-3 px-4 sm:pt-4 sm:px-4 relative shrink-0 w-full">
                        <Textarea
                          placeholder="입양 경로를 최대한 상세히 적어주세요."
                          value={otherSourceText}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 200) {
                              setOtherSourceText(value);
                            }
                          }}
                          onFocus={() => setIsTextareaFocused(true)}
                          onBlur={() => setIsTextareaFocused(false)}
                          maxLength={200}
                          showLength={isTextareaFocused}
                          currentLength={otherSourceText.length}
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
              !selectedSource || (isOtherSelected && !otherSourceText.trim())
                ? 'bg-[var(--color-status-disabled)] text-[var(--color-grayscale-gray4)] cursor-not-allowed'
                : ''
            }`}
            onClick={handleConfirm}
            disabled={!selectedSource || (isOtherSelected && !otherSourceText.trim())}
          >
            제출
          </button>
        </LargeDialogFooter>
      </LargeDialogContent>
    </LargeDialog>
  );
}
