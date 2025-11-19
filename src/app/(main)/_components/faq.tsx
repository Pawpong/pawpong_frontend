import { generalUserFAQ } from "@/constants/faq";
import ArrowRight from "@/assets/icons/arrow-right";
import Link from "next/link";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import BreederProfileSectionHeader from "@/components/breeder-profile/breeder-profile-section-header";
import BreederProfileSectionTitle from "@/components/breeder-profile/breeder-profile-section-title";
import BreederProfileSectionMore from "@/components/breeder-profile/breeder-profile-section-more";

const FAQ = () => {
  const isMd = useBreakpoint("md");
  const leftColumn = generalUserFAQ.slice(
    0,
    Math.ceil(generalUserFAQ.length / 2)
  );
  const rightColumn = generalUserFAQ.slice(
    Math.ceil(generalUserFAQ.length / 2)
  );

  return (
    <div className="flex flex-col gap-7">
      <BreederProfileSectionHeader>
        <BreederProfileSectionTitle>자주 묻는 질문</BreederProfileSectionTitle>
        <BreederProfileSectionMore />
      </BreederProfileSectionHeader>
      {/* 모바일: 모든 질문을 하나의 열로 */}
      {!isMd && (
        <div className="flex flex-col">
          {generalUserFAQ.map((item, index) => (
            <div key={index}>
              <div className="h-px bg-[#e4e7ec] w-full" />
              <div className="py-5">
                <p className="text-body-m font-medium text-primary-500">
                  {item.question}
                </p>
              </div>
            </div>
          ))}
          <div className="h-px bg-[#e4e7ec] w-full" />
        </div>
      )}

      {/* 데스크탑/패드: 2열 그리드 */}
      {isMd && (
        <div className="grid md:grid-cols-2 gap-x-6">
          {/* 왼쪽 열 */}
          <div className="flex flex-col">
            {leftColumn.map((item, index) => (
              <div key={index}>
                <div className="h-px bg-[#e4e7ec] w-full" />
                <div className="py-5">
                  <p className="text-body-m font-medium text-primary">
                    {item.question}
                  </p>
                </div>
              </div>
            ))}
            <div className="h-px bg-[#e4e7ec] w-full" />
          </div>

          {/* 오른쪽 열 */}
          <div className="flex flex-col">
            {rightColumn.map((item, index) => (
              <div key={index}>
                <div className="h-px bg-[#e4e7ec] w-full" />
                <div className="py-5">
                  <p className="text-body-m font-medium text-primary">
                    {item.question}
                  </p>
                </div>
              </div>
            ))}
            <div className="h-px bg-[#e4e7ec] w-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
