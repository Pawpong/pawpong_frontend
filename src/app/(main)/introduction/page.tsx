'use client';

import Container from '@/components/ui/container';
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

export default function IntroductionPage() {
  const { user } = useAuthStore();
  const userRole = user?.role || 'adopter';

  const title = userRole === 'breeder' ? INTRODUCTION_TITLE_BREEDER : INTRODUCTION_TITLE_ADOPTER;
  const intro = userRole === 'breeder' ? INTRODUCTION_INTRO_BREEDER : INTRODUCTION_INTRO_ADOPTER;
  const sections = userRole === 'breeder' ? INTRODUCTION_SECTIONS_BREEDER : INTRODUCTION_SECTIONS_ADOPTER;

  return (
    <Container className="pb-20 py-10 px-5 md:px-10">
      <div className="flex-1 @container flex flex-col gap-10 md:items-center">
        <div className="flex flex-col gap-6 max-w-[660px] w-full md:mx-auto">
          <div className="text-[#4F3B2E] text-heading-3 font-semibold">{title}</div>
        </div>

        <div className="flex flex-col gap-7 max-w-[660px] w-full md:mx-auto">
          <p className="text-body-xs font-normal text-grayscale-gray6 leading-[1.43] whitespace-pre-line">{intro}</p>

          <Separator className="bg-grayscale-gray2" />

          <div className="flex flex-col gap-7">
            {sections.map((section, index) => (
              <div key={section.heading} className="flex flex-col">
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
    </Container>
  );
}
