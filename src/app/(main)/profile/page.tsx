import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import ProfileBasicInfo from "./_components/profile-basic-info";
import ParentsInfo from "./_components/parents-info";
import BreedingAnimals from "./_components/breeding-animals";

export default function ProfilePage() {
  return (
    <div className="bg-tertiary-500 min-h-screen flex">
      {/* 왼쪽 절반 - 빈 영역 */}
      <div className="w-1/2"></div>

      {/* 오른쪽 절반 - 콘텐츠 영역 */}
      <div className="w-1/2 flex flex-col">
        <div className="flex flex-col gap-8 md:gap-20 items-center pb-20 py-14 px-8">
          {/* 프로필 기본 정보 */}
          <ProfileBasicInfo />

          {/* 엄마 아빠 정보 */}
          <ParentsInfo />

          {/* 분양 중인 아이 */}
          <BreedingAnimals />

          {/* 탈퇴하기 링크 */}
          <div className="flex gap-0.5 items-center relative shrink-0">
            <p className="font-normal leading-[1.4] relative shrink-0 text-14 text-grayscale-gray5 text-nowrap tracking-[-0.28px] underline">
              탈퇴하기
            </p>
          </div>
        </div>

        {/* 수정하기 버튼 - 오른쪽 절반 내에서 중앙 정렬 */}
        <div className="fixed bottom-8 left-3/4 transform -translate-x-1/2">
          <Button className="bg-status-disabled flex h-12 items-center justify-center min-w-20 px-4 py-3 rounded-lg w-[424px]">
            <p className="font-semibold grow leading-body-s min-h-px min-w-px relative shrink-0 text-grayscale-gray4 text-body-s text-center">
              수정하기
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
}
