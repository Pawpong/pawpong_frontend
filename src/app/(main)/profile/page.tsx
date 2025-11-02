"use client";
import { Button } from "@/components/ui/button";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useState, useMemo } from "react";
import ProfileBasicInfo from "./_components/profile-basic-info";
import ParentsInfo from "./_components/parents-info";
import BreedingAnimals from "./_components/breeding-animals";
import { useToast } from "@/hooks/use-toast";

interface ParentItem {
  id: string;
  name: string;
  birthDate: string;
  breed: string[];
  gender: "male" | "female" | null;
  imagePreview?: string;
  imageFile?: File;
}

export default function ProfilePage() {
  const isMdUp = useBreakpoint("md");
  const { toast } = useToast();
  const handleEdit = () => {
    toast({
      title: "프로필이 수정되었습니다.",
    });
  };

  const [breeds, setBreeds] = useState<string[]>([]);
  const defaultParentId = useMemo(() => `parent-default-${Date.now()}`, []);
  const [parents, setParents] = useState<ParentItem[]>([
    {
      id: defaultParentId,
      name: "",
      birthDate: "",
      breed: [],
      gender: null,
    },
  ]);

  return (
    <div className="min-h-screen flex w-full flex-col md:flex-row">
      {/* 왼쪽 영역: md 이상에서만 표시 (배경 여백) */}
      {isMdUp && <div className="md:w-1/2" />}

      <div className="w-full md:w-1/2 flex flex-col">
        <div className="flex flex-col gap-8 md:gap-20 items-center pb-20 py-14 md:px-4 px-5 lg:px-0.5 ">
          {/* 프로필 기본 정보 */}
          <ProfileBasicInfo breeds={breeds} setBreeds={setBreeds} />
          {/* 엄마 아빠 정보 */}
          <ParentsInfo
            selectedBreeds={breeds}
            parents={parents}
            setParents={setParents}
          />
          {/* 분양 중인 아이 */}
          <BreedingAnimals selectedBreeds={breeds} parents={parents} />
          {/* 탈퇴하기 링크 */}
          <div className="flex gap-0.5 items-center relative shrink-0">
            <p className="font-normal leading-[1.4] relative shrink-0 text-14 text-grayscale-gray5 text-nowrap tracking-[-0.28px] underline">
              탈퇴하기
            </p>
          </div>
        </div>

        {/* 수정하기 버튼 */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-8 w-full max-w-[424px] md:bottom-10 md:left-3/4 md:-translate-x-1/2 md:w-[424px]">
          <Button
            className="bg-status-disabled flex h-12 items-center justify-center min-w-20 px-4 py-3 rounded-lg w-full md:w-[424px]"
            onClick={handleEdit}
          >
            <p className="font-semibold grow leading-body-s min-h-px min-w-px relative shrink-0 text-grayscale-gray4 text-body-s text-center">
              수정하기
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
}
