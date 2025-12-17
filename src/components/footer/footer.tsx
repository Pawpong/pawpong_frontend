import Link from 'next/link';
import Kakao from '@/assets/icons/kakao';
import InstagramIcon from '@/assets/icons/instagram.svg';

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="px-5 md:px-10 lg:px-12 py-7 lg:py-[28px] pb-9 lg:pb-9">
        {/* 상단: 링크 및 SNS 아이콘 */}
        <div className="flex flex-row justify-between gap-10 md:gap-0 mb-10 lg:mb-10">
          {/* 링크 목록 */}
          <div className="flex flex-col gap-4 md:gap-4">
            <Link
              href="/introduction"
              className="text-[11px] md:text-xs font-semibold text-grayscale-gray5 hover:text-grayscale-gray6 transition-colors"
            >
              서비스 소개
            </Link>
            <Link
              href="/faq"
              className="text-[11px] md:text-xs font-semibold text-grayscale-gray5 hover:text-grayscale-gray6 transition-colors"
            >
              자주 묻는 질문
            </Link>
            <Link
              href="/terms-of-service"
              className="text-[11px] md:text-xs font-semibold text-grayscale-gray5 hover:text-grayscale-gray6 transition-colors"
            >
              이용 약관
            </Link>
            <Link
              href="/terms-of-privacy"
              className="text-[11px] md:text-xs font-semibold text-grayscale-gray5 hover:text-grayscale-gray6 transition-colors"
            >
              개인정보처리방침
            </Link>
          </div>

          {/* SNS 아이콘 */}
          <div className="flex items-start gap-3 md:gap-4 lg:gap-6">
            <a
              href="https://pf.kakao.com/_Wqxekn"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 flex items-center justify-center"
              aria-label="카카오톡 채널"
            >
              <Kakao className="w-6 h-6" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 flex items-center justify-center"
              aria-label="인스타그램"
            >
              <InstagramIcon className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* 하단: 회사 정보 */}
        <div className="flex flex-col gap-4 md:gap-4">
          {/* 데스크탑: 가로 배치 */}
          <div className="hidden lg:flex items-center gap-7">
            <span className="text-xs font-semibold text-grayscale-gray6">포렌즈</span>
            <div className="w-px h-3 bg-[#E1E1E1]" />
            <div className="flex items-center gap-7">
              <div className="flex items-center gap-6">
                <span className="text-xs font-semibold text-grayscale-gray5">대표이사</span>
                <span className="text-xs font-semibold text-grayscale-gray5">양세빈</span>
              </div>
              <div className="w-px h-3 bg-[#E1E1E1]" />
              <div className="flex items-center gap-6">
                <span className="text-xs font-semibold text-grayscale-gray5">이메일</span>
                <span className="text-xs font-semibold text-grayscale-gray5">pawriendsofficial@gmail.com</span>
              </div>
              <div className="w-px h-3 bg-[#E1E1E1]" />
              <div className="flex items-center gap-6">
                <span className="text-xs font-semibold text-grayscale-gray5">사업자등록번호</span>
                <span className="text-xs font-semibold text-grayscale-gray5">407-08-67659</span>
              </div>
              <div className="w-px h-3 bg-[#E1E1E1]" />
              <div className="w-px h-3 bg-[#E1E1E1]" />
              <div className="flex items-center gap-6">
                <span className="text-xs font-semibold text-grayscale-gray5">주소</span>
                <span className="text-xs font-semibold text-grayscale-gray5">
                  서울시 서초구 사임당로8길13, 4층 402호
                </span>
              </div>
            </div>
          </div>

          {/* 패드/모바일: 세로 배치 */}
          <div className="flex flex-col gap-4 lg:hidden">
            <span className="text-[11px] md:text-xs font-semibold text-grayscale-gray6">포렌즈</span>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-6">
                <span className="text-[11px] md:text-xs font-semibold text-grayscale-gray5 w-[86px] md:w-[94px]">
                  대표이사
                </span>
                <span className="text-[11px] md:text-xs font-semibold text-grayscale-gray5">양세빈</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[11px] md:text-xs font-semibold text-grayscale-gray5 w-[86px] md:w-[94px]">
                  이메일
                </span>
                <span className="text-[11px] md:text-xs font-semibold text-grayscale-gray5">
                  pawriendsofficial@gmail.com
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[11px] md:text-xs font-semibold text-grayscale-gray5 w-[86px] md:w-[94px]">
                  사업자등록번호
                </span>
                <span className="text-[11px] md:text-xs font-semibold text-grayscale-gray5">407-08-67659</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[11px] md:text-xs font-semibold text-grayscale-gray5 w-[86px] md:w-[94px]">
                  주소
                </span>
                <span className="text-[11px] md:text-xs font-semibold text-grayscale-gray5">
                  서울시 서초구 사임당로8길13, 4층 402호
                </span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-[11px] md:text-xs font-normal text-grayscale-gray5 mt-0 md:mt-0">
            Copyright © 2025 Pawpong Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
