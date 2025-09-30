import Logo from "@/assets/logo/logo";
import SocialLoginList from "@/components/social-login/social-login-list";
import Link from "next/link";

export default function LoginSection() {
  return (
    <div className="flex flex-col justify-between pb-16 pt-16 h-full">
      <div className="gap-3 flex flex-col items-center">
        <Logo className=" text-secondary-600 h-9 w-auto" />

        <div className="text-body-m font-medium text-tertiary-600">
          윤리적인 브리더와 입양자를 연결해요
        </div>
      </div>

      <div className="grid grid-cols-6 gap-x-gutter space-y-15 md:space-y-20">
        <SocialLoginList />
        <div className="col-span-6 text-center">
          <Link
            href="/"
            className="text-grayscale-gray5 underline underline-offset-2 text-[calc(--spacing(3.5))]"
          >
            문의하기
          </Link>
        </div>
      </div>
    </div>
  );
}
