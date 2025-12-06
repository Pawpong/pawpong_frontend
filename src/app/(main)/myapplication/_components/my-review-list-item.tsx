"use client";

import ProfileImageWithBadge from "@/components/breeder/profile-image-with-badge";
import BreederInfo from "@/components/breeder/breeder-info";
import { Button } from "@/components/ui/button";
import RightArrow from "@/assets/icons/right-arrow.svg";
import Link from "next/link";

interface MyReviewListItemProps {
  applicationId: string | null;
  breederId: string;
  breederName: string;
  breederLevel: "elite" | "new";
  applicationDate: string;
  profileImage: string;
  animalType: "cat" | "dog";
  reviewType: "상담 후기" | "입양 후기";
  reviewContent: string;
  reviewDate: string;
}

export default function MyReviewListItem({
  applicationId,
  breederId,
  breederName,
  breederLevel,
  applicationDate,
  profileImage,
  animalType,
  reviewType,
  reviewContent,
  reviewDate,
}: MyReviewListItemProps) {
  return (
    <div className="flex flex-col gap-4 items-start w-full">
      {/* 브리더 정보 */}
      <div className="flex gap-6 items-center w-full">
        <div className="flex gap-5 items-center grow">
          <ProfileImageWithBadge
            src={profileImage}
            alt={breederName}
            animalType={animalType}
            size={68}
          />
          <div className="flex flex-col gap-2 items-start justify-center">
            <BreederInfo
              breederName={breederName}
              breederLevel={breederLevel}
              applicationDate={applicationDate}
              className="gap-0"
              hideDate={true}
            />

            <Link href={`/explore/breeder/${breederId}`}>
              <Button className="gap-1 text-grayscale-gray5 text-body-xs h-auto p-0 has-[>svg]:px-0 hover:bg-transparent">
                <span>보기</span>
                <RightArrow className="size-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 후기 내용 */}
      <div className="flex flex-col gap-2 items-start w-full">
        <p className="text-body-m font-medium text-primary w-full">
          {reviewContent}
        </p>
        <div className="flex gap-2 items-center">
          <p className="text-body-s font-normal text-grayscale-gray5">
            {reviewType}・{reviewDate}
          </p>
        </div>
      </div>
    </div>
  );
}
