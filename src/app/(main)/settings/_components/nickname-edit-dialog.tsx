"use client";

import { useState, useEffect } from "react";
import {
  LargeDialog,
  LargeDialogContent,
  LargeDialogHeader,
  LargeDialogTitle,
  LargeDialogFooter,
  LargeDialogClose,
} from "@/components/ui/large-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { checkNicknameDuplicate } from "@/lib/auth";
import Close from "@/assets/icons/close";
import Check from "@/assets/icons/check";
import ErrorIcon from "@/assets/icons/error";

interface NicknameEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentNickname: string;
  onSave: (nickname: string) => void;
}

export default function NicknameEditDialog({
  open,
  onOpenChange,
  currentNickname,
  onSave,
}: NicknameEditDialogProps) {
  const [nickname, setNickname] = useState(currentNickname);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(
    null
  );
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 다이얼로그가 열릴 때 currentNickname으로 초기화
  useEffect(() => {
    if (open) {
      setNickname(currentNickname);
      setIsModified(false);
      setNicknameAvailable(null);
    }
  }, [open, currentNickname]);

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setIsModified(value !== currentNickname);
    setNicknameAvailable(null);
  };

  const handleCheckNickname = async () => {
    if (!nickname || nickname === currentNickname) {
      return;
    }

    setCheckingNickname(true);
    try {
      const isDuplicate = await checkNicknameDuplicate(nickname);
      setNicknameAvailable(!isDuplicate);
    } catch (error) {
      console.error("닉네임 중복 확인 오류:", error);
      setNicknameAvailable(false);
    } finally {
      setCheckingNickname(false);
    }
  };

  const handleSave = async () => {
    if (
      !isModified ||
      !nickname ||
      nickname === currentNickname ||
      checkingNickname ||
      isSaving
    ) {
      return;
    }

    setIsSaving(true);
    try {
      const isDuplicate = await checkNicknameDuplicate(nickname);
      if (isDuplicate) {
        setNicknameAvailable(false);
        alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.");
        return;
      }

      setNicknameAvailable(true);
      onSave(nickname);
      onOpenChange(false);
      setIsModified(false);
      setNicknameAvailable(null);
    } catch (error) {
      console.error("닉네임 중복 확인 오류:", error);
      alert("닉네임 중복 확인에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset to original nickname
    setNickname(currentNickname);
    setIsModified(false);
    setNicknameAvailable(null);
  };

  const isSaveDisabled =
    !isModified ||
    !nickname ||
    nickname === currentNickname ||
    checkingNickname ||
    isSaving;

  return (
    <LargeDialog open={open} onOpenChange={handleClose}>
      <LargeDialogContent className="w-full md:w-[600px] h-full md:h-[280px] flex flex-col  md:rounded-2xl">
        {/* Header */}
        <LargeDialogHeader className="px-5 md:px-6 pt-4 md:pt-6 pb-2.5 md:pb-2.5 border-b-0">
          <LargeDialogTitle>
            <div className="flex justify-between items-center gap-1 md:gap-1">
              <span className="text-body-l font-semibold text-grayscale-gray7 flex-1 text-left">
                닉네임 수정
              </span>
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
        <div className="flex-1 bg-[#F6F6EA] px-5 md:px-6 py-5 flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 md:gap-[12px]">
              <div className="flex-1 flex flex-col gap-[10px]">
                <Input
                  value={nickname}
                  onChange={(e) => handleNicknameChange(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  className="h-12"
                  disabled={checkingNickname || isSaving}
                />
                {nicknameAvailable === true && (
                  <div className="flex items-center gap-0.5">
                    <Check className="size-3 shrink-0 text-status-success-500" />
                    <p className="text-caption font-medium text-status-success-500">
                      사용할 수 있는 닉네임이에요
                    </p>
                  </div>
                )}
                {nicknameAvailable === false && (
                  <div className="flex items-center gap-[0.12rem]">
                    <ErrorIcon className="size-3 shrink-0" />
                    <p className="text-caption font-medium text-status-error-500">
                      이미 사용 중인 닉네임이에요
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="tertiary"
                disabled={
                  checkingNickname ||
                  isSaving ||
                  !nickname ||
                  nickname === currentNickname ||
                  !isModified
                }
                onClick={handleCheckNickname}
                className="h-12 px-4 shrink-0 text-body-s font-semibold"
              >
                {checkingNickname ? "확인 중..." : "중복검사"}
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-grayscale-gray2" />

        {/* Footer */}
        <LargeDialogFooter className="px-5 md:px-6 pt-4 md:pt-4 pb-6 md:pb-6 justify-end border-t-0">
          <Button
            variant={isSaveDisabled ? "secondary" : "default"}
            disabled={
              !isModified ||
              nickname === currentNickname ||
              checkingNickname ||
              isSaving ||
              !nickname
            }
            onClick={handleSave}
            className="h-9 bg-primary-500 px-4 min-w-[72px] disabled:bg-[#E1E1E1] disabled:text-[#A0A0A0]"
          >
            {isSaving ? "수정 중..." : "수정"}
          </Button>
        </LargeDialogFooter>
      </LargeDialogContent>
    </LargeDialog>
  );
}
