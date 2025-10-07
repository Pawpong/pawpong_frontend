"use client";

import SignupFormItems from "@/components/signup-form-section/signup-form-items";
import SignupFormSection from "@/components/signup-form-section/signup-form-section";
import SignupFormTitle from "@/components/signup-form-section/signup-form-title";
import UndoButton from "@/components/signup-form-section/undo-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useSignupFormStore, { Animal } from "@/stores/signup-form-store";
import Image from "next/image";

const animalInfo: Array<{
  name: Animal;
  label: string;

  className?: string;
  src: string;
}> = [
  {
    name: "cat",
    label: "고양이",
    className: "bg-primary hover:bg-primary-600 text-tertiary-500",
    src: "/images/cat.png",
  },
  {
    name: "dog",
    label: "강아지",
    className: "bg-secondary hover:bg-secondary-600 text-primary!",
    src: "/images/dog.png",
  },
];

export default function AnimalSection() {
  const setAnimal = useSignupFormStore((e) => e.setAnimal);
  const nextFlowIndex = useSignupFormStore((e) => e.nextFlowIndex);
  return (
    <SignupFormSection>
      <SignupFormTitle>어떤 동물을 브리딩하시나요?</SignupFormTitle>
      <SignupFormItems>
        {animalInfo.map(({ name, label, src, className }) => (
          <Button
            key={name}
            className={cn(
              "w-full justify-between pt-12 pb-0 px-8 rounded-2xl flex flex-col h-39",
              className
            )}
            onClick={() => {
              setAnimal(name);
              nextFlowIndex();
            }}
          >
            <div className="text-body-l font-semibold">{label}</div>
            <div className="relative w-[424px] h-[72px]">
              <Image src={src} alt={label} fill className="object-contain" />
            </div>
          </Button>
        ))}
      </SignupFormItems>
      <UndoButton />
    </SignupFormSection>
  );
}
