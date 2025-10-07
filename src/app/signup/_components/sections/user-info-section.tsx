"use client";

import ErrorIcon from "@/assets/icons/error";
import CheckboxForm from "@/components/signup-form-section/checkbox-form";
import CheckboxFormList from "@/components/signup-form-section/checkbox-form-list";
import NextButton from "@/components/signup-form-section/next-button";
import SignupFormDescription from "@/components/signup-form-section/signup-form-description";
import SignupFormHeader from "@/components/signup-form-section/signup-form-header";
import SignupFormItems from "@/components/signup-form-section/signup-form-items";
import SignupFormSection from "@/components/signup-form-section/signup-form-section";
import SignupFormTitle from "@/components/signup-form-section/signup-form-title";
import UndoButton from "@/components/signup-form-section/undo-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSignupFormStore, { AgreementName } from "@/stores/signup-form-store";
import { sendVerificationCode, verifyCode } from "@/lib/auth";
import { useState } from "react";

const checkboxInfo: {
  name: AgreementName;
  label: string;
  required: boolean;
  href?: string;
}[] = [
  {
    name: "term",
    label: "서비스 이용약관 동의",
    required: true,
    href: "/terms",
  },
  {
    name: "privacy",
    label: "개인정보 수집 및 이용 동의",
    required: true,
    href: "/privacy",
  },
  { name: "marketing", label: "광고성 정보 수신 동의", required: false },
];

export default function UserInfoSection() {
  const agreements = useSignupFormStore((e) => e.agreements);
  const setAgreements = useSignupFormStore((e) => e.setAgreements);
  const phoneNumber = useSignupFormStore((e) => e.phoneNumber);
  const setPhoneNumber = useSignupFormStore((e) => e.setPhoneNumber);
  const email = useSignupFormStore((e) => e.email);
  const setEmail = useSignupFormStore((e) => e.setEmail);
  const nextFlowIndex = useSignupFormStore((e) => e.nextFlowIndex);

  // Social login info
  const tempId = useSignupFormStore((e) => e.tempId);
  const provider = useSignupFormStore((e) => e.provider);
  const socialName = useSignupFormStore((e) => e.socialName);

  // SMS verification state
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const hasUncheckedRequiredAgreements = checkboxInfo
    .filter((e) => e.required)
    .some((e) => !agreements[e.name]);

  const isSocialLogin = !!tempId;

  // Send verification code
  const handleSendCode = async () => {
    if (phoneNumber.length !== 13) {
      alert("올바른 휴대폰 번호를 입력해주세요.");
      return;
    }

    setIsSending(true);

    try {
      await sendVerificationCode(phoneNumber);
      setIsCodeSent(true);
      alert("인증번호가 발송되었습니다.");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("인증번호 발송에 실패했습니다.");
      }
    } finally {
      setIsSending(false);
    }
  };

  // Verify code
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    if (verificationCode.length !== 6) {
      alert("인증번호는 6자리입니다.");
      return;
    }

    setIsVerifying(true);

    try {
      await verifyCode(phoneNumber, verificationCode);
      setIsVerified(true);
      alert("인증이 완료되었습니다!");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("인증번호가 일치하지 않습니다.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Reset verification when phone number changes
  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setIsCodeSent(false);
    setIsVerified(false);
    setVerificationCode("");
  };

  return (
    <SignupFormSection className="gap-15 md:gap-20 lg:gap-20">
      <SignupFormHeader>
        <SignupFormTitle>계정 정보를 입력해 주세요</SignupFormTitle>
        <SignupFormDescription>
          문자 미수신 시{" "}
          <span className="text-secondary-700">[인증번호 재전송]</span> 버튼을
          눌러주세요
        </SignupFormDescription>
      </SignupFormHeader>
      <SignupFormItems className="gap-8">
        {/* Social Login Info Display */}
        {isSocialLogin && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="text-sm font-semibold text-blue-800">
              소셜 로그인 정보 (디버깅용)
            </div>
            <div className="text-xs space-y-1 text-blue-700">
              <div>Provider: {provider}</div>
              <div>Name: {socialName}</div>
              <div>Email: {email}</div>
              <div>TempId: {tempId}</div>
            </div>
          </div>
        )}

        <Input
          placeholder="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSocialLogin}
          className={isSocialLogin ? "bg-gray-100" : ""}
        />
        <div className="space-y-3">
          <div className="flex gap-3">
            <Input
              placeholder="휴대폰 번호 (010-1234-5678)"
              className="flex-1"
              type="tel"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              disabled={isVerified}
            />
            <Button
              variant="tertiary"
              className="px-4 py-3 whitespace-nowrap"
              disabled={phoneNumber.length !== 13 || isSending || isVerified}
              onClick={handleSendCode}
            >
              {isSending ? "발송 중..." : isCodeSent ? "인증번호 재전송" : "인증번호 받기"}
            </Button>
          </div>
          {isCodeSent && (
            <div className="flex gap-3">
              <Input
                placeholder="인증번호 (6자리)"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={isVerified}
                maxLength={6}
              />
              <Button
                variant="tertiary"
                className="px-4 py-3 whitespace-nowrap"
                disabled={verificationCode.length !== 6 || isVerifying || isVerified}
                onClick={handleVerifyCode}
              >
                {isVerifying ? "확인 중..." : isVerified ? "인증 완료" : "인증 확인"}
              </Button>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <CheckboxFormList>
            <CheckboxForm
              label="전체 약관 동의"
              checked={
                Object.values(agreements).filter((e) => e).length ===
                checkboxInfo.length
              }
              onCheckedChange={(checked) => {
                checkboxInfo.forEach(({ name }) =>
                  setAgreements(name, checked)
                );
              }}
            />
            {checkboxInfo.map(({ name, label, required, href }) => (
              <CheckboxForm
                key={name}
                label={`(${required ? "필수" : "선택"}) ${label}`}
                onCheckedChange={(checked) => setAgreements(name, checked)}
                checked={agreements[name]}
                href={href}
              />
            ))}
          </CheckboxFormList>
          {checkboxInfo
            .filter((e) => e.required)
            .some((e) => !agreements[e.name]) && (
            <div className="flex gap-0.5 text-status-error text-caption-s">
              <div className="size-3 flex justify-center items-center">
                <ErrorIcon className="h-2.5 w-2.5 " />
              </div>
              <span>필수 약관에 동의해 주세요.</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <NextButton
            onClick={() => {
              if (hasUncheckedRequiredAgreements) return;
              nextFlowIndex();
            }}
          />
          <UndoButton />
        </div>
      </SignupFormItems>
    </SignupFormSection>
  );
}
