"use client";

import BreederProfile from "@/app/(main)/explore/breeder/[id]/_components/breeder-profile";
import { Separator } from "@/components/ui/separator";
import BreederDescription from "./_components/breeder-description";
import BreedingAnimals from "./_components/breeding-animals";
import EnvPhotos from "./_components/env-photos";
import Parents from "./_components/parents";
import Reviews from "./_components/reviews";
import Header from "../_components/header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCounselFormStore } from "@/stores/counsel-form-store";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { BREEDER_DETAIL_MOCK } from "@/app/(main)/explore/_mocks/explore-mock-data";

export default function Page() {
  const breederNickname = BREEDER_DETAIL_MOCK.nickname;
  const router = useRouter();
  const { clearCounselFormData } = useCounselFormStore();
  const isLg = useBreakpoint("lg");

  const handleCounselClick = () => {
    clearCounselFormData();
    router.push("/counselform");
  };

  return (
    <>
      <Header breederNickname={breederNickname} />
      <div className="pt-4 lg:flex lg:gap-24.5 space-y-10 md:space-y-15 pb-10 md:pb-15 lg:lg-80">
        <div>
          <BreederProfile data={BREEDER_DETAIL_MOCK.profile} />
        </div>
        <div className="space-y-12 mt-10 md:mt-0">
          <EnvPhotos photos={BREEDER_DETAIL_MOCK.envPhotos} />
          <Separator className="my-12" />

          <BreederDescription data={BREEDER_DETAIL_MOCK.description} />
          <Separator className="my-12" />
          <BreedingAnimals data={BREEDER_DETAIL_MOCK.breedingAnimals} />
          <Separator className="my-12" />
          <Parents data={BREEDER_DETAIL_MOCK.parents} />

          <Separator className="my-12" />
          <Reviews data={BREEDER_DETAIL_MOCK.reviews} />
        </div>
      </div>
      {!isLg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2  w-full max-w-[22.0625rem]">
          <Button
            variant="counsel"
            className="w-full h-12 rounded-lg text-body-s font-semibold text-primary-500"
            type="button"
            onClick={handleCounselClick}
          >
            상담 신청하기
          </Button>
        </div>
      )}
    </>
  );
}
