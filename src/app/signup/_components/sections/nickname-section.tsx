"use client";

import NextButton from "@/components/signup-form-section/next-button";
import SignupFormHeader from "@/components/signup-form-section/signup-form-header";
import SignupFormItems from "@/components/signup-form-section/signup-form-items";
import SignupFormSection from "@/components/signup-form-section/signup-form-section";
import SignupFormTitle from "@/components/signup-form-section/signup-form-title";
import UndoButton from "@/components/signup-form-section/undo-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  checkNicknameDuplicate,
  completeAdopterRegistration,
} from "@/lib/auth";
import useSignupFormStore from "@/stores/signup-form-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Check from "@/assets/icons/check-blue.svg";

export default function NicknameSection() {
  const router = useRouter();
  const nickname = useSignupFormStore((e) => e.nickname);
  const setNickname = useSignupFormStore((e) => e.setNickname);
  const nextFlowIndex = useSignupFormStore((e) => e.nextFlowIndex);

  // Social login info
  const tempId = useSignupFormStore((e) => e.tempId);
  const email = useSignupFormStore((e) => e.email);
  const socialName = useSignupFormStore((e) => e.socialName);
  const provider = useSignupFormStore((e) => e.provider);
  const agreements = useSignupFormStore((e) => e.agreements);
  const phoneNumber = useSignupFormStore((e) => e.phoneNumber);

  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(false);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isSocialLogin = !!tempId;

  // Check nickname duplication
  const handleCheckNickname = async () => {
    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (nickname.length < 2 || nickname.length > 10) {
      alert("닉네임은 2~10자로 입력해주세요.");
      return;
    }

    const nicknameRegex = /^[a-zA-Z0-9가-힣]+$/;
    if (!nicknameRegex.test(nickname)) {
      alert("닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.");
      return;
    }

    setCheckingNickname(true);

    try {
      const isDuplicate = await checkNicknameDuplicate(nickname);
      if (isDuplicate) {
        alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.");
        setNicknameChecked(false);
        setNicknameAvailable(false);
      } else {
        setNicknameChecked(true);
        setNicknameAvailable(true);
      }
    } catch (error) {
      alert("닉네임 중복 확인에 실패했습니다.");
      setNicknameChecked(false);
      setNicknameAvailable(false);
    } finally {
      setCheckingNickname(false);
    }
  };

  // Reset check when nickname changes
  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setNicknameChecked(false);
    setNicknameAvailable(false);
  };

  // Complete registration
  const handleSubmit = async () => {
    if (!nicknameChecked || !nicknameAvailable) {
      alert("닉네임 중복 확인을 완료해주세요.");
      return;
    }

    if (!tempId) {
      alert("소셜 로그인 정보가 없습니다. 다시 로그인해주세요.");
      router.push("/login");
      return;
    }

    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    setSubmitting(true);

    const requestData = {
      tempId,
      email,
      name: socialName,
      role: "adopter" as const,
      nickname,
      phone: phoneNumber,
      marketingAgreed: agreements.marketing,
    };

    console.log("=== Registration Request ===", requestData);

    try {
      const result = await completeAdopterRegistration(requestData);

      // HttpOnly 쿠키에 저장
      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        }),
      });

      // 다음 단계 진행
      nextFlowIndex();
    } catch (error) {
      console.error("=== Registration Error ===", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("회원가입에 실패했습니다.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SignupFormSection className="">
      <SignupFormHeader>
        <SignupFormTitle>닉네임을 입력해 주세요</SignupFormTitle>
      </SignupFormHeader>

      <SignupFormItems className="flex flex-col gap-8">
        {/* Social Login Info Display */}
        {isSocialLogin && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
            <div className="text-sm font-semibold text-green-800">
              회원가입 정보 확인 (디버깅용)
            </div>
            <div className="text-xs space-y-1 text-green-700">
              <div>Provider: {provider}</div>
              <div>Name: {socialName}</div>
              <div>Email: {email}</div>
              <div>Phone: {phoneNumber}</div>
              <div>TempId: {tempId}</div>
              <div>Nickname: {nickname || "(미입력)"}</div>
              <div>Marketing: {agreements.marketing ? "동의" : "비동의"}</div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-[10px]">
          <div className="flex gap-3">
            <Input
              placeholder="닉네임 (2-10자, 한글/영문/숫자)"
              value={nickname}
              onChange={(e) => handleNicknameChange(e.target.value)}
              minLength={2}
              maxLength={10}
              disabled={submitting}
              className={
                nicknameAvailable
                  ? "border-green-500 focus:border-green-500"
                  : ""
              }
            />
            <Button
              variant="tertiary"
              disabled={
                checkingNickname || !nickname || nicknameAvailable || submitting
              }
              onClick={handleCheckNickname}
            >
              {checkingNickname ? "확인 중..." : "중복 검사"}
            </Button>
          </div>
          {nicknameAvailable && (
            <div className="flex items-center gap-0.5">
              <Check className="size-3 shrink-0" />
              <p className="text-caption font-medium text-status-success-500">
                사용할 수 있는 닉네임이에요
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <NextButton
            disabled={!nicknameAvailable || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "가입 중..." : "제출"}
          </NextButton>
          <UndoButton />
        </div>
      </SignupFormItems>
    </SignupFormSection>
  );
}
