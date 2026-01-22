'use client';
import Container from '@/components/ui/container';
import HomeBanner from './_components/home-banner';
import AnimalCategoryButtons from './_components/animal-category-buttons';
import HomeBreederGrid from './_components/home-breeder-grid';
import FAQ from '@/app/(main)/_components/faq';
import ServiceIntroBanner from './_components/service-intro-banner';
import {
  INTRODUCTION_TITLE_ADOPTER,
  INTRODUCTION_TITLE_BREEDER,
  INTRODUCTION_INTRO_ADOPTER,
  INTRODUCTION_INTRO_BREEDER,
  INTRODUCTION_SECTIONS_ADOPTER,
  INTRODUCTION_SECTIONS_BREEDER,
  IntroductionContentItem,
} from '@/constants/introduction';
import { useAuthStore } from '@/stores/auth-store';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const { user } = useAuthStore();
  const userRole = user?.role || 'adopter';

  const title = userRole === 'breeder' ? INTRODUCTION_TITLE_BREEDER : INTRODUCTION_TITLE_ADOPTER;
  const intro = userRole === 'breeder' ? INTRODUCTION_INTRO_BREEDER : INTRODUCTION_INTRO_ADOPTER;
  const sections = userRole === 'breeder' ? INTRODUCTION_SECTIONS_BREEDER : INTRODUCTION_SECTIONS_ADOPTER;

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

            {/* 테스트: Introduction 섹션 */}
            <div className="flex flex-col gap-7 bg-white rounded-2xl p-6 md:p-10">
              <div className="flex flex-col gap-6">
                <div className="text-[#4F3B2E] text-heading-3 font-semibold">{title}</div>
              </div>

              <div className="flex flex-col gap-7">
                <p className="text-body-xs font-normal text-grayscale-gray6 leading-[1.43] whitespace-pre-line">
                  {intro}
                </p>

                <Separator className="bg-grayscale-gray2" />

                <div className="flex flex-col gap-7">
                  {sections.map((section, index) => (
                    <div key={section.heading || index} className="flex flex-col">
                      {section.heading && (
                        <p className="text-grayscale-gray6 mb-2 text-body-m font-semibold">{section.heading}</p>
                      )}
                      <div className="flex flex-col">
                        {section.contents.map((item: IntroductionContentItem) => {
                          let indentClass = '';
                          if (item.indentLevel !== undefined) {
                            if (item.indentLevel === -1) {
                              indentClass = 'pl-1';
                            } else if (item.indentLevel === 0) {
                              indentClass = 'pl-1.5';
                            } else if (item.indentLevel === 1) {
                              indentClass = 'pl-4';
                            } else if (item.indentLevel === 2) {
                              indentClass = 'pl-6';
                            } else if (item.indentLevel === 3) {
                              indentClass = 'pl-10';
                            } else if (item.indentLevel === 4) {
                              indentClass = 'pl-14';
                            }
                          }
                          return (
                            <p
                              key={`${section.heading}-${item.text.slice(0, 20)}`}
                              className={`text-grayscale-gray6 whitespace-pre-line text-body-s font-normal ${indentClass}`}
                            >
                              {item.text}
                            </p>
                          );
                        })}
                      </div>
                      {index < sections.length - 1 && <Separator className="bg-grayscale-gray2 mt-7" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
