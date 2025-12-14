import Logo from '@/assets/logo/logo';
import SocialLoginList from '@/components/social-login/social-login-list';
import Link from 'next/link';

export default function LoginSection() {
  return (
    <div className="flex flex-col items-center h-full w-full">
      <div className="gap-3 flex flex-col items-center mt-40">
        <Logo className="text-secondary-600 h-12 w-auto" />
        <div className="text-body-m font-medium text-tertiary-600">전문적인 브리더와 입양자를 연결해요</div>
      </div>

      <div className="flex flex-col items-center gap-[6.25rem] w-full max-w-md mt-[6.25rem]">
        <div className="flex flex-col items-center gap-0 w-full">
          <SocialLoginList />
          <div className="mt-8">
            <Link
              href="https://pf.kakao.com/_xlmxjjn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-700 hover:text-secondary-800 underline text-sm font-normal tracking-[-0.28px] leading-[1.4]"
            >
              문의하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
