"use client";

import LevelBadge from "@/components/level-badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Pencil from "@/assets/icons/pencil.svg";
import ReviewDialog from "./review-dialog";

interface ApplicationListItemProps {
  breederId: string;
  breederName: string;
  breederLevel: "elite" | "new";
  applicationDate: string;
  profileImage: string;
  animalType: "cat" | "dog";
}

export default function ApplicationListItem({
  breederId,
  breederName,
  breederLevel,
  applicationDate,
  profileImage,
  animalType,
}: ApplicationListItemProps) {
  return (
    <div className="flex gap-5 items-center w-full md:flex-row">
      {/* 프로필 이미지 */}
      <div className="relative shrink-0 size-[68px] rounded-lg overflow-hidden">
        <Image
          src={profileImage}
          alt={breederName}
          width={68}
          height={68}
          className="object-cover w-full h-full"
        />
        {/* 동물 타입 배지 */}
        <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-grayscale-gray1)] flex items-center justify-center py-1.5 px-1.5">
          <p className="text-caption font-medium text-grayscale-gray6 text-center">
            {animalType === "cat" ? "고양이" : "강아지"}
          </p>
        </div>
      </div>

      {/* 브리더 정보 + 날짜/버튼 영역 */}
      <div className="flex-1 flex flex-col gap-2 md:gap-3">
        <div className="flex gap-2 items-center">
          <p className="text-body-l font-semibold text-primary w-[70px]">
            {breederName}
          </p>
          <LevelBadge level={breederLevel} />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-body-s font-normal text-grayscale-gray5 whitespace-nowrap">
            {applicationDate}
          </p>
          {/* 후기 작성 버튼 */}
          <ReviewDialog
            breederId={breederId}
            breederName={breederName}
            breederLevel={breederLevel}
            applicationDate={applicationDate}
            profileImage={profileImage}
            animalType={animalType}
          >
            <Button
              variant="ghost"
              className="bg-[var(--color-tertiary-500)] hover:bg-[var(--color-tertiary-600)] h-8 px-3 py-2 gap-1 rounded-lg shrink-0 md:hidden"
            >
              <span className="text-body-xs font-normal text-grayscale-gray6">
                후기 작성
              </span>
              <Pencil className="size-4" />
            </Button>
          </ReviewDialog>
        </div>
      </div>

      {/* 후기 작성 버튼 (데스크톱) */}
      <ReviewDialog
        breederId={breederId}
        breederName={breederName}
        breederLevel={breederLevel}
        applicationDate={applicationDate}
        profileImage={profileImage}
        animalType={animalType}
      >
        <Button
          variant="ghost"
          className="bg-[var(--color-tertiary-500)] hover:bg-[var(--color-tertiary-600)] h-8 px-3 py-2 gap-1 rounded-lg shrink-0 hidden md:flex"
        >
          <span className="text-body-xs font-normal text-grayscale-gray6">
            후기 작성
          </span>
          <Pencil className="size-4" />
        </Button>
      </ReviewDialog>
    </div>
  );
}
