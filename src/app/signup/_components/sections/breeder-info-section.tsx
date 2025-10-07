"use client";

import Arrow from "@/assets/icons/arrow";
import Camera from "@/assets/icons/camera";
import NextButton from "@/components/signup-form-section/next-button";
import SignupFormHeader from "@/components/signup-form-section/signup-form-header";
import SignupFormItems from "@/components/signup-form-section/signup-form-items";
import SignupFormSection from "@/components/signup-form-section/signup-form-section";
import SignupFormTitle from "@/components/signup-form-section/signup-form-title";
import UndoButton from "@/components/signup-form-section/undo-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import useSignupFormStore from "@/stores/signup-form-store";

export default function BreederInfoSection() {
  const photo = useSignupFormStore((state) => state.photo);
  const setPhoto = useSignupFormStore((state) => state.setPhoto);
  const breederName = useSignupFormStore((state) => state.breederName);
  const setBreederName = useSignupFormStore((state) => state.setBreederName);
  const breederDescription = useSignupFormStore(
    (state) => state.breederDescription
  );
  const setBreederDescription = useSignupFormStore(
    (state) => state.setBreederDescription
  );
  const breederLocation = useSignupFormStore((state) => state.breederLocation);
  const setBreederLocation = useSignupFormStore(
    (state) => state.setBreederLocation
  );
  const breeds = useSignupFormStore((state) => state.breeds);
  const setBreeds = useSignupFormStore((state) => state.setBreeds);
  const nextFlowIndex = useSignupFormStore((state) => state.nextFlowIndex);
  return (
    <SignupFormSection className="gap-15 md:gap-20 lg:gap-20">
      <SignupFormHeader>
        <SignupFormTitle>브리더 정보를 입력해 주세요</SignupFormTitle>
      </SignupFormHeader>
      <SignupFormItems className="gap-8">
        <div className="flex flex-col gap-3 items-center">
          <Button
            size="icon"
            variant="input"
            className="size-20 justify-center"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setPhoto(event.target.result);
                  };
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }}
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt="Uploaded"
                className="object-cover w-full h-full"
              />
            ) : (
              <Camera className="text-grayscale-gray6 size-7" />
            )}
          </Button>
          <Input
            placeholder="브리더명(상호명)"
            value={breederName}
            onChange={(e) => setBreederName(e.target.value)}
          />
          <InputGroup>
            <InputGroupTextarea
              maxLength={1500}
              placeholder="소개"
              value={breederDescription}
              onChange={(e) => setBreederDescription(e.target.value)}
              id="breeder-description"
            />
            <InputGroupAddon
              align="block-end"
              className="justify-end pt-4 pb-3 px-4"
              onClick={() => {
                const textarea = document.getElementById("breeder-description");
                textarea?.focus();
              }}
            >
              <InputGroupText>
                <div className="font-medium">
                  <span className="text-secondary-700">
                    {breederDescription.length}
                  </span>
                  <span className="text-grayscale-gray5">/1500</span>
                </div>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>

          <Button variant="input" className="py-3 px-4 pr-3.5">
            지역
            <Arrow className="size-5" />
          </Button>
          <div className="space-y-2.5 w-full">
            <Button variant="input" className="py-3 px-4 pr-3.5">
              품종
              <Arrow className="size-5" />
            </Button>
            <div className="text-caption-s text-grayscale-gray5 font-medium">
              최대 다섯 가지 선택할 수 있어요
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <NextButton onClick={() => nextFlowIndex()} />
          <UndoButton />
        </div>
      </SignupFormItems>
    </SignupFormSection>
  );
}
