"use client";

import NextButton from "@/components/signup-form-section/next-button";
import SignupFormHeader from "@/components/signup-form-section/signup-form-header";
import SignupFormItems from "@/components/signup-form-section/signup-form-items";
import SignupFormSection from "@/components/signup-form-section/signup-form-section";
import SignupFormTitle from "@/components/signup-form-section/signup-form-title";
import UndoButton from "@/components/signup-form-section/undo-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSignupFormStore from "@/stores/signup-form-store";

export default function NicknameSection() {
  const nickname = useSignupFormStore((e) => e.nickname);
  const setNickname = useSignupFormStore((e) => e.setNickname);
  const nextFlowIndex = useSignupFormStore((e) => e.nextFlowIndex);

  return (
    <SignupFormSection className="">
      <SignupFormHeader>
        <SignupFormTitle>닉네임을 입력해 주세요</SignupFormTitle>
      </SignupFormHeader>

      <SignupFormItems className="flex flex-col gap-8">
        <div className="flex gap-3">
          <Input
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <Button variant="tertiary" disabled={!nickname}>
            중복 검사
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <NextButton
            onClick={() => {
              nextFlowIndex();
            }}
          >
            제출
          </NextButton>
          <UndoButton />
        </div>
      </SignupFormItems>
    </SignupFormSection>
  );
}
