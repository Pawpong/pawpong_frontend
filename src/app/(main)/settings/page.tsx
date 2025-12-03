"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import SocialLoginSection from "./_components/social-login-section";
import NicknameSection from "./_components/nickname-section";
import EmailSettingsSection from "./_components/email-settings-section";
import WithdrawSection from "./_components/withdraw-section";
import WithdrawDialog from "./_components/withdraw-dialog";
import {
  getAdopterProfile,
  updateAdopterProfile,
  deleteAccount,
  WithdrawReason,
} from "@/lib/adopter";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [marketingAgreed, setMarketingAgreed] = useState(true);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState<"kakao" | "google" | "naver">("kakao");
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // 프로필 정보 로드
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getAdopterProfile();
        setNickname(profile.name || profile.nickname);
        setEmail(profile.email);
        setMarketingAgreed(profile.marketingAgreed);
        // provider 정보가 있다면 설정 (백엔드 응답에 따라 조정 필요)
      } catch (error) {
        toast({
          title: "프로필 로드 실패",
          description: "프로필 정보를 불러올 수 없습니다.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [toast]);

  const handleNicknameEdit = async (newNickname: string) => {
    try {
      await updateAdopterProfile({ name: newNickname });
      setNickname(newNickname);
      toast({
        title: "닉네임 변경 완료",
        description: "닉네임이 성공적으로 변경되었습니다.",
      });
    } catch (error) {
      toast({
        title: "닉네임 변경 실패",
        description: error instanceof Error ? error.message : "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = () => {
    setWithdrawDialogOpen(true);
  };

  const handleWithdrawConfirm = async (reason: string, otherReason?: string) => {
    try {
      // 회원 탈퇴 API 호출
      await deleteAccount({
        reason: reason as WithdrawReason,
        otherReason,
      });

      toast({
        title: "회원 탈퇴 완료",
        description: "그동안 이용해 주셔서 감사합니다.",
      });

      // 탈퇴 성공 시 로그인 페이지로 리다이렉트
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      toast({
        title: "탈퇴 처리 실패",
        description: error instanceof Error ? error.message : "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-body-s text-grayscale-gray5">로딩 중...</p>
      </div>
    );
  }

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
          <SocialLoginSection email={email} provider={provider} />
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

      {/* 탈퇴 다이얼로그 */}
      <WithdrawDialog
        open={withdrawDialogOpen}
        onOpenChange={setWithdrawDialogOpen}
        onConfirm={handleWithdrawConfirm}
      />
    </div>
  );
}
