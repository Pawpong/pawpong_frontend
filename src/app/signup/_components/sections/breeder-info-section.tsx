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
import useSignupFormStore from "@/stores/signup-form-store";
import BreedsSelectDialogTrigger from "../breeds-select-dialog-trigger";
import LocationSelectDialogTrigger from "../location-select-dialog-trigger";

export default function BreederInfoSection() {
  const setPhoto = useSignupFormStore((state) => state.setPhoto);
  const photoPreview = useSignupFormStore((state) => state.photoPreview);
  const setPhotoPreview = useSignupFormStore((state) => state.setPhotoPreview);
  const breederName = useSignupFormStore((state) => state.breederName);
  const setBreederName = useSignupFormStore((state) => state.setBreederName);

  const breederLocation = useSignupFormStore((state) => state.breederLocation);
  const setBreederLocation = useSignupFormStore(
    (state) => state.setBreederLocation
  );
  const breeds = useSignupFormStore((state) => state.breeds);
  const setBreeds = useSignupFormStore((state) => state.setBreeds);
  const nextFlowIndex = useSignupFormStore((state) => state.nextFlowIndex);
  const animal = useSignupFormStore((state) => state.animal);
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
              input.onchange = (e: Event) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0];
                if (file) {
                  setPhoto(file);
                  const reader = new FileReader();
                  reader.onload = (event: ProgressEvent<FileReader>) => {
                    if (event.target?.result) {
                      setPhotoPreview(event.target.result as string);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }}
          >
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoPreview}
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
          {/* <InputGroup>
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
          </InputGroup> */}
          <LocationSelectDialogTrigger
            onSubmitLocation={(value: string | null) => {
              setBreederLocation(value);
            }}
            asChild
          >
            <Button variant="input" className="py-3 px-4 pr-3.5">
              {breederLocation ? (
                <span className="text-primary">{breederLocation}</span>
              ) : (
                <span>지역</span>
              )}
              <Arrow className="size-5" />
            </Button>
          </LocationSelectDialogTrigger>
          <div className="space-y-2.5 w-full">
            <BreedsSelectDialogTrigger
              animal={animal!}
              onSubmitBreeds={setBreeds}
              asChild
            >
              <Button variant="input" className="py-3 px-4 pr-3.5">
                {breeds.length > 0 ? (
                  <span className="text-primary">{breeds.join(", ")}</span>
                ) : (
                  <span>품종</span>
                )}

                <Arrow className="size-5" />
              </Button>
            </BreedsSelectDialogTrigger>
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
