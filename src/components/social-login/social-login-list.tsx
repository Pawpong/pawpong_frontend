"use client";

import Google from "@/assets/logo/google";
import Kakao from "@/assets/logo/kakao";
import Naver from "@/assets/logo/naver";
import SocialLoginButton from "./social-login-button";
import SocialLoginIcon from "./social-login-icon";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function SocialLoginList() {
  const socialLoginInfo = [
    {
      name: "카카오로 시작하기",
      icon: Kakao,
      className: "bg-[#FEE500] text-grayscale-black! hover:bg-[#FEE500]/80",
      onClick: () => {
        window.location.href = `${API_BASE_URL}/api/auth/kakao`;
      },
    },
    {
      name: "네이버로 시작하기",
      icon: Naver,
      className: "bg-[#03C75A] text-grayscale-white! hover:bg-[#03C75A]/80",
      onClick: () => {
        window.location.href = `${API_BASE_URL}/api/auth/naver`;
      },
    },
    {
      name: "구글로 시작하기",
      icon: Google,
      className:
        "bg-tertiary-500 text-grayscale-black! hover:bg-tertiary-500/80",
      onClick: () => {
        window.location.href = `${API_BASE_URL}/api/auth/google`;
      },
    },
  ];
  return (
    <div className="space-y-3 w-full col-span-5 md:col-span-6 md:col-start-2 lg:col-span-4 lg:col-start-2">
      {socialLoginInfo.map(({ name, icon: Icon, className, onClick }) => (
        <SocialLoginButton key={name} className={className} onClick={onClick}>
          <SocialLoginIcon className="size-4">
            <Icon />
          </SocialLoginIcon>

          {name}
        </SocialLoginButton>
      ))}
    </div>
  );
}
