"use client";

import Apple from "@/assets/logo/apple";
import Google from "@/assets/logo/google";
import Kakao from "@/assets/logo/kakao";
import Naver from "@/assets/logo/naver";
import SocialLoginButton from "./social-login-button";
import SocialLoginIcon from "./social-login-icon";

export default function SocialLoginList() {
  const socialLoginInfo = [
    {
      name: "카카오로 시작하기",
      icon: Kakao,
      className: "bg-[#FEE500] text-grayscale-black! hover:bg-[#FEE500]/80",
      onClick: () => {},
    },
    {
      name: "네이버로 시작하기",
      icon: Naver,
      className: "bg-[#03C75A] text-grayscale-white! hover:bg-[#03C75A]/80",
      onClick: () => {},
    },
    {
      name: "구글로 시작하기",
      icon: Google,
      className:
        "bg-tertiary-500 text-grayscale-black! hover:bg-tertiary-500/80",
      onClick: () => {},
    },

    {
      name: "애플로 시작하기",
      icon: Apple,
      className:
        "bg-grayscale-black text-grayscale-white! hover:bg-grayscale-black/80",
      onClick: () => {},
    },
  ];
  return (
    <div className="space-y-3 w-full col-span-4 col-start-2">
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
