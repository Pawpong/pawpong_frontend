"use client";

import SignupFormItems from "@/components/signup-form-section/signup-form-items";
import SignupFormSection from "@/components/signup-form-section/signup-form-section";
import SignupFormTitle from "@/components/signup-form-section/signup-form-title";
import UndoButton from "@/components/signup-form-section/undo-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useSignupFormStore, { Plan } from "@/stores/signup-form-store";
import Image from "next/image";

const planInfo: Array<{
  name: Plan;
  label: string;
  description: string[];
  className?: string;
  disabled?: boolean;
  isFree: boolean;

  src: string;
}> = [
  {
    name: "basic",
    label: "Basic",
    description: [
      "브리더 프로필 만들기",
      "엄마·아빠 / 분양 중인 아이 등록",
      "입양 상담 신청 간편 관리",
    ],
    className: "bg-secondary hover:bg-secondary-600 text-primary!",
    src: "/images/basic.png",
    isFree: true,
  },
  {
    name: "pro",
    label: "Pro",
    description: ["comming soon"],
    className: "bg-status-disabled hover:bg-tertiary-600 text-grayscale-gray4!",
    src: "/images/pro.png",
    isFree: false,
    disabled: true,
  },
];

export default function PlanSection() {
  const setPlan = useSignupFormStore((e) => e.setPlan);
  const nextFlowIndex = useSignupFormStore((e) => e.nextFlowIndex);
  return (
    <SignupFormSection>
      <SignupFormTitle>회원 유형을 선택해 주세요</SignupFormTitle>
      <SignupFormItems>
        {planInfo.map(
          ({ name, label, description, src, className, disabled, isFree }) => (
            <Button
              disabled={disabled}
              key={name}
              className={cn(
                "w-full justify-between py-7 px-8  rounded-2xl gap-5 disabled:opacity-100",
                className
              )}
              onClick={() => {
                setPlan(name);
                nextFlowIndex();
              }}
            >
              <div className="space-y-1 text-left">
                <div className="text-body-l font-semibold flex gap-1.5 items-center">
                  {label}
                  {isFree && (
                    <span className="rounded-full bg-primary text-secondary text-caption-s font-medium py-0.5 px-1.5">
                      Free
                    </span>
                  )}
                </div>
                <div className="text-body-xs font-medium">
                  {description.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
              <Image src={src} alt={label} width={100} height={100} />
            </Button>
          )
        )}
      </SignupFormItems>
      <UndoButton />
    </SignupFormSection>
  );
}
