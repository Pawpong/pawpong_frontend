"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import { Textarea } from "@/components/ui/textarea";
// import Camera from "@/assets/icons/camera";
import Camera from "@/assets/icons/camera.svg";
import Arrow from "@/assets/icons/arrow";
import BreedsSelectDialogTrigger from "@/app/signup/_components/breeds-select-dialog-trigger";
import { useState } from "react";
import LocationSelectDialogTrigger from "@/app/signup/_components/location-select-dialog-trigger";
import ImageEdit from "@/components/image-edit";
import MinusIcon from "@/assets/icons/minus.svg";
import { useFormContext, Controller } from "react-hook-form";
import type { ProfileFormData } from "@/stores/profile-store";
import ErrorMessage from "@/components/error-message";
import { BREEDER_PROFILE_ERROR } from "@/constants/errors/breeder-profile-error";

export default function ProfileBasicInfo({
  form,
}: {
  form: ReturnType<typeof useFormContext<ProfileFormData>>;
}) {
  const [animal] = useState<"dog" | "cat">("dog");
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const { control, watch, setValue, formState } = form;
  const { errors } = formState;

  const breeds = watch("breeds");
  const location = watch("location");
  const isCounselMode = watch("isCounselMode");
  const descriptionValue = watch("description");
  return (
    <div className="flex flex-col gap-8 items-start w-full">
      <div className="flex flex-col gap-3 items-center w-full">
        {/* 프로필 이미지 */}
        <div className="bg-white flex flex-col gap-0.5 items-center justify-center rounded-lg size-20 cursor-pointer transition-colors group">
          <Camera className="size-7 group-hover:[&_path]:fill-[#4F3B2E]" />
        </div>
        <div className="flex flex-col gap-[10px] w-full">
          <Controller
            name="breederName"
            control={control}
            rules={{
              required: BREEDER_PROFILE_ERROR.NAME_REQUIRED,
            }}
            render={({ field }) => (
              <Input placeholder="브리더명(상호명)" {...field} />
            )}
          />
          {errors.breederName && (
            <ErrorMessage message={errors.breederName.message as string} />
          )}
        </div>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              placeholder="소개"
              maxLength={1500}
              showLength={
                isDescriptionFocused || (descriptionValue || "").length > 0
              }
              currentLength={String(descriptionValue || "").length}
              {...field}
              onFocus={() => {
                setIsDescriptionFocused(true);
              }}
              onBlur={() => {
                setIsDescriptionFocused(false);
                field.onBlur();
              }}
            />
          )}
        />
        {/* 위치 선택 */}
        <Controller
          name="location"
          control={control}
          render={() => (
            <LocationSelectDialogTrigger
              onSubmitLocation={(value: string | null) => {
                setValue("location", value);
              }}
              asChild
            >
              <Button
                variant="input"
                size={undefined}
                className="!px-[var(--space-16)] !py-[var(--space-12)] group"
              >
                {location ? (
                  <span className="text-[#4F3B2E]">{location}</span>
                ) : (
                  <span>지역</span>
                )}
                <Arrow className="size-5 group-hover:[&_path]:fill-[#4F3B2E]" />
              </Button>
            </LocationSelectDialogTrigger>
          )}
        />
        {/* {!breederLocation && <ErrorMessage message={messages[0].text} />} */}

        {/* 품종 선택 */}
        <div className="space-y-2.5 w-full">
          <Controller
            name="breeds"
            control={control}
            rules={{
              validate: (value) => {
                if (!value || value.length === 0) {
                  return BREEDER_PROFILE_ERROR.BREEDS_REQUIRED;
                }
                return true;
              },
            }}
            render={() => (
              <BreedsSelectDialogTrigger
                animal={animal!}
                onSubmitBreeds={(newBreeds) => {
                  setValue("breeds", newBreeds, { shouldValidate: true });
                }}
                asChild
              >
                <Button
                  variant="input"
                  size={undefined}
                  className="!px-[var(--space-16)] !py-[var(--space-12)] group"
                >
                  <div className="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap">
                    {breeds.length > 0 ? (
                      <span className="text-[#4F3B2E]">{breeds.join("/")}</span>
                    ) : (
                      <span>품종</span>
                    )}
                  </div>
                  <Arrow className="size-5 group-hover:[&_path]:fill-[#4F3B2E]" />
                </Button>
              </BreedsSelectDialogTrigger>
            )}
          />
          {errors.breeds && (
            <ErrorMessage message={errors.breeds.message as string} />
          )}
          <div className="text-caption-s text-grayscale-gray5 font-medium">
            최대 다섯 가지 선택할 수 있어요
          </div>
        </div>
      </div>
      {/* 대표 사진 */}
      <div className="flex flex-col gap-3 items-start w-full">
        <div className="flex flex-col font-semibold justify-center min-w-full relative shrink-0 text-grayscale-gray6 text-body-xs w-min">
          <p className="leading-body-xs">대표 사진</p>
        </div>
        <Controller
          name="representativePhotos"
          control={control}
          render={() => (
            <ImageEdit
              maxCount={3}
              onFileChange={(files) => {
                setValue("representativePhotos", files);
              }}
            />
          )}
        />
        {/* </div> */}
      </div>
      {/* 입양 비용 범위 */}
      <div className="flex flex-col gap-3 items-start w-full">
        <div className="flex flex-col font-semibold justify-center min-w-full relative shrink-0 text-grayscale-gray6 text-body-xs w-min">
          <p className="leading-body-xs">입양 비용 범위</p>
        </div>
        <div className="flex flex-col gap-[10px] w-full">
          <div className="flex gap-3 items-center relative w-full flex-nowrap">
            <Controller
              name="minPrice"
              control={control}
              rules={{
                validate: (value) => {
                  if (!isCounselMode && (!value || value.trim() === "")) {
                    return BREEDER_PROFILE_ERROR.PRICE_REQUIRED;
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <PriceInput
                  placeholder={isCounselMode ? "상담 후 공개" : "0"}
                  className="grow"
                  disabled={isCounselMode}
                  value={isCounselMode ? "" : field.value}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                />
              )}
            />
            <div className="overflow-hidden relative shrink-0 size-4">
              <MinusIcon className="size-4" />
            </div>
            <Controller
              name="maxPrice"
              control={control}
              rules={{
                validate: (value) => {
                  if (!isCounselMode && (!value || value.trim() === "")) {
                    return BREEDER_PROFILE_ERROR.PRICE_REQUIRED;
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <PriceInput
                  placeholder={isCounselMode ? "상담 후 공개" : "0"}
                  className="grow"
                  disabled={isCounselMode}
                  value={isCounselMode ? "" : field.value}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                />
              )}
            />
            <button
              onClick={() => {
                if (!isCounselMode) {
                  // 상담 후 공개 모드로 전환 시 값 초기화
                  setValue("minPrice", "", { shouldValidate: true });
                  setValue("maxPrice", "", { shouldValidate: true });
                }
                setValue("isCounselMode", !isCounselMode, {
                  shouldValidate: true,
                });
              }}
              className="button-after-counsel shrink-0 whitespace-nowrap"
            >
              상담 후 공개하기
            </button>
          </div>
          {(errors.minPrice || errors.maxPrice) && (
            <ErrorMessage message={BREEDER_PROFILE_ERROR.PRICE_REQUIRED} />
          )}
        </div>
      </div>

      {/* <div className="flex flex-col gap-3 items-start w-full">
        <div className="flex flex-col font-semibold justify-center relative shrink-0 text-grayscale-gray6 text-body-xs w-full">
          <p className="leading-body-xs">입양 비용 범위</p>
        </div>
        <div className="flex gap-3 items-center justify-center relative shrink-0 w-full">
          <div className="flex flex-col gap-2.5 grow items-start min-h-px min-w-px relative shrink-0">
            <div className="bg-white flex h-12 items-center overflow-hidden rounded-lg w-full">
              <div className="flex gap-2.5 grow items-center justify-center min-h-px min-w-px pl-4 pr-3 py-3 relative shrink-0">
                <div className="flex flex-col font-medium grow justify-center min-h-px min-w-px relative shrink-0 text-grayscale-gray5 text-body-s">
                  <p className="leading-body-s">0</p>
                </div>
              </div>
              <div className="bg-white flex gap-2.5 h-12 items-center pl-1 pr-3.5 py-0 relative rounded-br-lg rounded-tr-lg shrink-0">
                <div className="flex flex-col font-medium justify-center relative shrink-0 text-grayscale-black text-body-s text-nowrap">
                  <p className="leading-body-s whitespace-pre">원</p>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden relative shrink-0 size-4">
            <div className="absolute bg-grayscale-gray6 h-0.5 left-0.75 top-1.5 w-2.5" />
          </div>
          <div className="bg-white flex grow h-12 items-center min-h-px min-w-px overflow-hidden relative rounded-lg shrink-0">
            <div className="flex gap-2.5 grow items-center justify-center min-h-px min-w-px pl-4 pr-3 py-3 relative shrink-0">
              <div className="flex flex-col font-medium grow justify-center min-h-px min-w-px relative shrink-0 text-grayscale-gray5 text-body-s">
                <p className="leading-body-s">0</p>
              </div>
            </div>
            <div className="bg-white flex gap-2.5 h-12 items-center pl-1 pr-3.5 py-0 relative rounded-br-lg rounded-tr-lg shrink-0">
              <div className="flex flex-col font-medium justify-center relative shrink-0 text-grayscale-black text-body-s text-nowrap">
                <p className="leading-body-s whitespace-pre">원</p>
              </div>
            </div>
          </div>
          <Button className="bg-tertiary-700 flex h-12 items-center justify-center min-w-20 px-4 py-3 relative rounded-lg shrink-0">
            <p className="font-semibold grow leading-body-s min-h-px min-w-px relative shrink-0 text-grayscale-gray6 text-body-s text-center">
              상담 후 공개하기
            </p>
          </Button>
        </div>
      </div>
    </div> */}
    </div>
  );
}
