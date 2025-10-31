"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import { Textarea } from "@/components/ui/textarea";
import DownArrow from "@/assets/icons/down-arro.svg";
// import Camera from "@/assets/icons/camera";
import Camera from "@/assets/icons/camera.svg";
import Arrow from "@/assets/icons/arrow";
import BreedsSelectDialogTrigger from "@/app/signup/_components/breeds-select-dialog-trigger";
import { useState } from "react";
import LocationSelectDialogTrigger from "@/app/signup/_components/location-select-dialog-trigger";
import ImageEdit from "@/components/image-edit";
import ErrorMessage from "@/components/error-message";
import MinusIcon from "@/assets/icons/minus.svg";
export default function ProfileBasicInfo() {
  const messages: Array<{ type: "error"; text: string }> = [
    { type: "error", text: "지역을 선택해 주세요" },
    { type: "error", text: "최대 다섯 가지 선택할 수 있어요" },
    {
      type: "error",
      text: "품종을 선택해 주세요",
    },
  ];
  const [animal] = useState<"dog" | "cat">("dog");
  const [breeds, setBreeds] = useState<string[]>([]);
  const [breederLocation, setBreederLocation] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-8 items-start w-full">
      <div className="flex flex-col gap-3 items-center w-full">
        {/* 프로필 이미지 */}
        <div className="bg-white flex flex-col gap-0.5 items-center justify-center rounded-lg size-20 cursor-pointer transition-colors group">
          <Camera className="size-7 group-hover:[&_path]:fill-[#4F3B2E]" />
        </div>
        <Input placeholder="브리더명(상호명)" />
        <Textarea placeholder="소개" maxLength={1500} showLength={true} />
        {/* 위치 선택 */}
        <LocationSelectDialogTrigger
          onSubmitLocation={(value: string | null) => {
            setBreederLocation(value);
          }}
          asChild
        >
          <Button variant="input" className="py-3 px-4 pr-3.5">
            {breederLocation ? (
              <span className="text-[#4F3B2E]">{breederLocation}</span>
            ) : (
              <span>지역</span>
            )}
            {breederLocation && (
              <DownArrow className="[&_path]:fill-[#4F3B2E]" />
            )}
            {!breederLocation && <DownArrow />}
          </Button>
        </LocationSelectDialogTrigger>
        {/* {!breederLocation && <ErrorMessage message={messages[0].text} />} */}

        {/* 품종 선택 */}
        <div className="space-y-2.5 w-full">
          <BreedsSelectDialogTrigger
            animal={animal!}
            onSubmitBreeds={setBreeds}
            asChild
          >
            <Button variant="input" className="py-3 px-4 pr-3.5 ">
              <div className="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap">
                {breeds.length > 0 ? (
                  <span className="text-[#4F3B2E]">{breeds.join("/")}</span>
                ) : (
                  <span>품종</span>
                )}
              </div>
              <Arrow className="size-5 text-[#4F3B2E]" />
            </Button>
          </BreedsSelectDialogTrigger>
          {/* {breeds.length === 0 && <ErrorMessage message={messages[2].text} />} */}
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
        <ImageEdit maxCount={3} />
        {/* </div> */}
      </div>
      {/* 입양 비용 범위 */}
      <div className="flex flex-col gap-3 items-start w-full">
        <div className="flex flex-col font-semibold justify-center min-w-full relative shrink-0 text-grayscale-gray6 text-body-xs w-min">
          <p className="leading-body-xs">입양 비용 범위</p>
        </div>
        <div className="flex gap-3 items-center relative w-full flex-nowrap">
          <PriceInput placeholder="0" className="grow" />
          <div className="overflow-hidden relative shrink-0 size-4">
            <MinusIcon className="size-4" />
          </div>
          <PriceInput placeholder="0" className="grow" />
          <button className="button-after-counsel  shrink-0 whitespace-nowrap">
            상담 후 공개하기
          </button>
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
