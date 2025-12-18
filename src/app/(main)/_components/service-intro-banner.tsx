import ArrowRight from '@/assets/icons/arrow-right';
import BannerSvg from '@/assets/images/banner-small.svg';
import Banner from '@/assets/images/banner.svg';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';

const ServiceIntroBanner = () => {
  const isMd = useBreakpoint('md');
  const isLg = useBreakpoint('lg');
  const user = useAuthStore((state) => state.user);
  const isBreeder = user?.role === 'breeder';

  // 모바일 (md 미만)
  if (!isMd) {
    return (
      <div className="bg-tertiary-500 rounded-2xl flex flex-col gap-8 h-[25rem] overflow-hidden relative">
        <div className="flex flex-col gap-8 shrink-0 px-7 pt-7">
          <h2 className="text-body-l font-semibold text-primary">
            {isBreeder ? (
              <>
                브리더의 가치와 전문성이 인정받는 공간,
                <br />
                Pawpong
              </>
            ) : (
              <>
                믿을 수 있는 브리더,
                <br />
                포퐁에서 만나요
              </>
            )}
          </h2>
          <Link
            href="/introduction"
            className="bg-tertiary-700 text-grayscale-gray6 flex items-center gap-1 pl-5 pr-3 py-2.5 rounded-full text-body-s font-medium hover:bg-tertiary-800 transition-colors w-fit"
          >
            <span>서비스 소개</span>
            <ArrowRight className="size-7 rotate-180" />
          </Link>
        </div>
        <div className="absolute top-[54%] left-1/2 transform -translate-x-1/2 ">
          <Banner />
        </div>
      </div>
    );
  }

  // 패드 (md 이상, lg 미만)
  if (isMd && !isLg) {
    return (
      <div className="bg-tertiary-500 rounded-2xl flex flex-col h-[17.3125rem] overflow-hidden relative">
        <div className="flex flex-row justify-between items-start shrink-0 px-7 pt-7">
          <h2 className="text-body-l font-semibold text-primary whitespace-nowrap">
            {isBreeder ? (
              <>
                브리더의 가치와 전문성이 인정받는 공간,
                <br />
                Pawpong
              </>
            ) : (
              <>
                믿을 수 있는 브리더,
                <br />
                포퐁에서 만나요
              </>
            )}
          </h2>
          <Link
            href="/introduction"
            className="bg-tertiary-700 text-grayscale-gray6 flex items-center gap-1 pl-5 pr-3 py-2.5 rounded-full text-body-s font-medium hover:bg-tertiary-800 transition-colors w-fit shrink-0"
          >
            <span>서비스 소개</span>
            <ArrowRight className="size-7 rotate-180" />
          </Link>
        </div>
        <div className="absolute top-[34%] left-1/2 transform -translate-x-1/2 ">
          <Banner />
        </div>
      </div>
    );
  }

  // 데스크탑 (lg 이상) - 원래 있던 것
  return (
    <div className="bg-tertiary-500 rounded-2xl flex flex-col gap-8 h-[38.75rem] overflow-hidden">
      {/* 텍스트 및 버튼 영역 */}
      <div className="flex flex-col gap-8 shrink-0 px-7 pt-7">
        <h2 className="text-body-l font-semibold text-primary">
          {isBreeder ? (
            <>
              브리더의 가치와
              <br />
              전문성이 인정받는 공간,
              <br />
              Pawpong
            </>
          ) : (
            <>
              믿을 수 있는 브리더,
              <br />
              포퐁에서 만나요
            </>
          )}
        </h2>
        <Link
          href="/introduction"
          className="bg-tertiary-700 text-grayscale-gray6 flex items-center gap-1 pl-5 pr-3 py-2.5 rounded-full text-body-s font-medium hover:bg-tertiary-800 transition-colors w-fit"
        >
          <span>서비스 소개</span>
          <ArrowRight className="size-7 rotate-180" />
        </Link>
      </div>

      {/* 배너 이미지 */}
      <div className="flex-1 flex items-end justify-center">
        <BannerSvg />
      </div>
    </div>
  );
};

export default ServiceIntroBanner;
