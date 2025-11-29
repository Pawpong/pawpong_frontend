"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import SocialLoginSection from "./_components/social-login-section";
import NicknameSection from "./_components/nickname-section";
import EmailSettingsSection from "./_components/email-settings-section";
import WithdrawSection from "./_components/withdraw-section";

export default function SettingsPage() {
  const [marketingAgreed, setMarketingAgreed] = useState(true);
  const [nickname, setNickname] = useState("포포퐁");
  const [email] = useState("example@gmail.com");

  const handleNicknameEdit = (newNickname: string) => {
    // TODO: 실제 API 호출로 닉네임 업데이트
    setNickname(newNickname);
    console.log("닉네임 수정:", newNickname);
  };

  const handleWithdraw = () => {
    // TODO: 탈퇴 로직 구현
    console.log("탈퇴하기");
  };

  return (
    <div className="flex flex-col items-center gap-[200px] px-12 py-10 pb-20 min-h-screen">
      <div className="flex flex-col gap-6 w-full max-w-[660px]">
        {/* 제목 */}
        <div className="flex flex-col gap-6 w-full">
          <h1 className="text-heading-3 font-semibold text-primary">설정</h1>
        </div>

        {/* 설정 섹션들 */}
        <div className="flex flex-col gap-6 w-full">
          {/* 소셜 로그인 */}
          {/* 
            const { data } = await api.get("/api/user/profile");
            <SocialLoginSection 
              email={data.email} 
              provider={data.provider}  // "kakao", "kakao_account", "google" 등 어떤 값이 와도 자동 정규화됨
            />
          */}
          <SocialLoginSection email={email} provider="kakao" />
          <Separator className="bg-grayscale-gray2" />

          {/* 닉네임 */}
          <NicknameSection nickname={nickname} onEdit={handleNicknameEdit} />
          <Separator className="bg-grayscale-gray2" />

          {/* 이메일 수신 설정 */}
          <EmailSettingsSection
            marketingAgreed={marketingAgreed}
            onMarketingAgreedChange={setMarketingAgreed}
          />
        </div>

        {/* 탈퇴하기 섹션 */}
        <div className="mt-[10rem] lg:mt-[12.5rem]">
          <WithdrawSection onWithdraw={handleWithdraw} />
        </div>
      </div>
    </div>
  );
}
