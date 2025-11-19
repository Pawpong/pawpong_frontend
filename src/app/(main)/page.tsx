"use client";
import Container from "@/components/ui/container";
import HomeBanner from "./_components/home-banner";
import AnimalCategoryButtons from "./_components/animal-category-buttons";
import HomeBreederGrid from "./_components/home-breeder-grid";
import FAQ from "@/app/(main)/_components/faq";
import ServiceIntroBanner from "./_components/service-intro-banner";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <HomeBanner />
      <Container>
        {/* 패드: 서비스 소개 배너 (히어로 배너 바로 아래) */}
        <div className="lg:hidden pt-[3.75rem]">
          <ServiceIntroBanner />
        </div>

        <div className="flex mt-3 lg:mt-20 lg:gap-8">
          {/* 왼쪽 영역: 모든 콘텐츠 */}
          <div className="flex flex-col gap-12 md:gap-15 flex-1">
            {/* 고양이/강아지 카테고리 버튼 (데스크탑/패드에서만 표시) */}

            <AnimalCategoryButtons />

            {/* 자주 묻는 질문 (데스크탑/패드에서만 표시) */}

            <FAQ />

            {/* 분양 중인 아이들 그리드 */}
            <HomeBreederGrid />
          </div>
          {/* 오른쪽 영역: 서비스 소개 배너 (데스크탑에서만 표시) */}
          <div className="hidden lg:block w-[318px] shrink-0">
            <ServiceIntroBanner />
          </div>
        </div>
      </Container>
    </>
  );
}
