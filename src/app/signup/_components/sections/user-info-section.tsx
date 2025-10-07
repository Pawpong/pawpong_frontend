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

  const hasUncheckedRequiredAgreements = checkboxInfo
    .filter((e) => e.required)
    .some((e) => !agreements[e.name]);
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
        <Input
          placeholder="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="space-y-3">
          <div className="flex gap-3">
            <Input
              placeholder="휴대폰 번호"
              className="flex-1"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button
              variant="tertiary"
              className="px-4 py-3"
              disabled={phoneNumber.length !== 13}
            >
              인증번호 받기
            </Button>
          </div>
          <Input placeholder="인증번호" />
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
