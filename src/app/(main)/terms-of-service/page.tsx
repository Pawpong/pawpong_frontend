"use client";

import Container from "@/components/ui/container";
import {
  TERMS_OF_SERVICE_INTRO,
  TERMS_OF_SERVICE_SECTIONS,
  TermsContentItem,
} from "./constants";

export default function TermsOfServicePage() {
  return (
    <Container className="pb-20 py-10 px-5 md:px-10">
      <div className="flex-1 @container flex flex-col gap-10 md:items-center">
        <div className="flex flex-col gap-6 max-w-[660px] w-full md:mx-auto">
          <div className="text-[#4F3B2E] text-heading-3 font-semibold">
            서비스 이용약관
          </div>
        </div>

        <div className="flex flex-col gap-5 max-w-[660px] w-full md:mx-auto">
          <p className="text-body-xs font-normal text-grayscale-gray6 leading-[1.43]">
            {TERMS_OF_SERVICE_INTRO}
          </p>

          <div className="flex flex-col gap-5">
            {TERMS_OF_SERVICE_SECTIONS.map((section) => (
              <div key={section.heading} className="flex flex-col">
                <p className="text-body-xs font-normal text-grayscale-gray6 leading-[1.43] mb-2">
                  {section.heading}
                </p>
                <div className="flex flex-col">
                  {section.contents.map((item: TermsContentItem) => {
                    let indentClass = "";
                    if (item.indentLevel !== undefined) {
                      if (item.indentLevel === -1) {
                        indentClass = "pl-1";
                      } else if (item.indentLevel === 0) {
                        indentClass = "pl-1.5";
                      } else if (item.indentLevel === 1) {
                        indentClass = "pl-4";
                      } else if (item.indentLevel === 2) {
                        indentClass = "pl-6";
                      } else if (item.indentLevel === 3) {
                        indentClass = "pl-10";
                      } else if (item.indentLevel === 4) {
                        indentClass = "pl-14";
                      }
                    }
                    return (
                      <p
                        key={`${section.heading}-${item.text.slice(0, 20)}`}
                        className={`text-body-xs font-normal text-grayscale-gray6 leading-[1.43] ${indentClass}`}
                      >
                        {item.text}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
