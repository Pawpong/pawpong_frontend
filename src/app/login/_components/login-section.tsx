import Logo from '@/assets/logo/logo';
import SocialLoginList from '@/components/social-login/social-login-list';
import Link from 'next/link';

export default function LoginSection() {
  return (
    <div className="flex flex-col items-center h-full gap-30 md:gap-40 lg:gap-40 w-full">
      <div className="gap-3 flex flex-col items-center mt-[6rem]">
        <Logo className=" text-secondary-600 h-12 w-auto" />

        <div className="text-body-m font-medium text-tertiary-600">전문적인 브리더와 입양자를 연결해요</div>
      </div>

      <div className="flex flex-col items-center gap-[3.75rem] md:gap-[6.25rem] lg:gap-[7.5rem] w-full max-w-md">
        <SocialLoginList />
        <div className="text-center">
          <Link
            href="/"
            className="text-secondary-700 hover:text-secondary-800 underline underline-offset-2 text-[calc(--spacing(3.5))]"
          >
            문의하기
          </Link>
        </div>
      </div>
    </div>
  );
}
