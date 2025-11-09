"use client";

import ProfileImageWithBadge from "@/components/breeder/profile-image-with-badge";
import BreederInfo from "@/components/breeder/breeder-info";
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
      <ProfileImageWithBadge
        src={profileImage}
        alt={breederName}
        animalType={animalType}
        size={68}
      />

      {/* 브리더 정보 + 날짜/버튼 영역 */}
      <div className="flex-1 flex flex-col gap-2 md:gap-3">
        <BreederInfo breederName={breederName} breederLevel={breederLevel} />
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
