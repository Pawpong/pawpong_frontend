import Logo from "@/assets/logo/logo";
import SocialLoginList from "@/components/social-login/social-login-list";
import Link from "next/link";

export default function LoginSection() {
  return (
    <div className="flex flex-col justify-center h-full gap-30 w-full">
      <div className="gap-3 flex flex-col items-center">
        <Logo className=" text-secondary-600 h-12 w-auto" />

        <div className="text-body-m font-medium text-tertiary-600">
          윤리적인 브리더와 입양자를 연결해요
        </div>
      </div>

      <div className="grid grid-cols-5 gap-x-gutter space-y-15 md:grid-cols-8 lg:grid-cols-6">
        <SocialLoginList />
        <div className="col-span-5 md:col-span-8 ld:col-span-6 md:grid-cols-8 lg:grid-cols-6 text-center">
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
