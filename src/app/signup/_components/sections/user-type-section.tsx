"use client";

import SignupFormItems from "@/components/signup-form-section/signup-form-items";
import SignupFormSection from "@/components/signup-form-section/signup-form-section";
import SignupFormTitle from "@/components/signup-form-section/signup-form-title";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useSignupFormStore, { UserType } from "@/stores/signup-form-store";
import Image from "next/image";

const userTypeInfo: Array<{
  name: UserType;
  label: string;
  description: string[];
  className?: string;
  src: string;
}> = [
  {
    name: "guest",
    label: "일반",
    description: ["새로운 반려동물을 가족으로", "맞이하고 싶은 보호자예요."],
    className: "bg-secondary hover:bg-secondary-600",
    src: "/images/guest.png",
  },
  {
    name: "breeder",
    label: "브리더",
    description: ["반려동물을 책임감 있게 돌보는", "전문가예요."],
    className: "bg-white hover:bg-tertiary-600",
    src: "/images/breeder.png",
  },
];

export default function UserTypeSection() {
  const setUserType = useSignupFormStore((e) => e.setUserType);
  const nextFlowIndex = useSignupFormStore((e) => e.nextFlowIndex);

  return (
    <SignupFormSection>
      <SignupFormTitle>회원 유형을 선택해 주세요</SignupFormTitle>
      <SignupFormItems>
        {userTypeInfo.map(({ name, label, description, src, className }) => (
          <Button
            key={name}
            className={cn(
              "w-full justify-between py-7 px-8  rounded-2xl",
              className
            )}
            onClick={() => {
              setUserType(name);
              nextFlowIndex();
            }}
          >
            <div className="space-y-1 text-left">
              <div className="text-body-l text-primary font-semibold">
                {label}
              </div>
              <div className="text-body-xs text-primary/80 font-medium">
                {description.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </div>
            <Image src={src} alt={label} width={100} height={100} />
          </Button>
        ))}
      </SignupFormItems>
    </SignupFormSection>
  );
}
