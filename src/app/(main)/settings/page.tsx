'use client';

import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import SocialLoginSection from './_components/social-login-section';
import NicknameSection from './_components/nickname-section';
import EmailSettingsSection from './_components/email-settings-section';
import WithdrawSection from './_components/withdraw-section';
import WithdrawDialog from './_components/withdraw-dialog';
import { getAdopterProfile, updateAdopterProfile, deleteAccount, WithdrawReason } from '@/lib/adopter';
import { getMyBreederProfile } from '@/lib/breeder';
import { deleteBreederAccount, updateBreederProfile } from '@/lib/breeder-management';
import { logout } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useAuthStore } from '@/stores/auth-store';

export default function SettingsPage() {
  const { isLoading: isAuthLoading } = useAuthGuard();
  const { user, clearAuth } = useAuthStore();
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [provider, setProvider] = useState<'local' | 'kakao' | 'google' | 'naver' | 'apple'>('kakao');
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // 프로필 정보 로드
  useEffect(() => {
    // 인증 확인 중이면 프로필 로드 건너뜀
    if (isAuthLoading || !user) return;

    const loadProfile = async () => {
      try {
        if (user.role === 'breeder') {
          // 브리더 프로필 로드
          const profile = await getMyBreederProfile();
          setNickname(profile.breederName);
          setEmail(profile.breederEmail);
          if (profile.authProvider && profile.authProvider !== 'local') {
            setProvider(profile.authProvider);
          }
          if (profile.marketingAgreed !== undefined) {
            setMarketingAgreed(profile.marketingAgreed);
          }
        } else {
          // 입양자 프로필 로드
          const profile = await getAdopterProfile();
          setNickname(profile.nickname);
          setEmail(profile.emailAddress);
          setMarketingAgreed(profile.marketingAgreed);
          if (profile.authProvider && profile.authProvider !== 'local') {
            setProvider(profile.authProvider);
          }
        }
      } catch (error) {
        toast({
          title: '프로필 로드 실패',
          description: '프로필 정보를 불러올 수 없습니다.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [toast, isAuthLoading, user]);

  const handleNicknameEdit = async (newNickname: string) => {
    if (!user) return;

    try {
      if (user.role === 'breeder') {
        // 브리더는 breederName 업데이트 (현재 백엔드 API에서 지원하지 않을 수 있음)
        toast({
          title: '브리더 이름 변경',
          description: '브리더 이름은 관리자에게 문의해주세요.',
        });
        return;
      } else {
        // 입양자 닉네임 업데이트
        await updateAdopterProfile({ name: newNickname });
        setNickname(newNickname);
        toast({
          title: '닉네임 변경 완료',
          description: '닉네임이 성공적으로 변경되었습니다.',
        });
      }
    } catch (error) {
      toast({
        title: '닉네임 변경 실패',
        description: error instanceof Error ? error.message : '다시 시도해주세요.',
      });
    }
  };

  const handleMarketingAgreedChange = async (checked: boolean) => {
    if (!user) return;

    try {
      if (user.role === 'breeder') {
        // 브리더 마케팅 동의 변경
        await updateBreederProfile({ marketingAgreed: checked });
      } else {
        // 입양자 마케팅 동의 변경
        await updateAdopterProfile({ marketingConsent: checked });
      }

      setMarketingAgreed(checked);
      toast({
        title: checked ? '마케팅 수신 동의' : '마케팅 수신 거부',
        description: checked ? '광고성 정보 수신에 동의하셨습니다.' : '광고성 정보 수신을 거부하셨습니다.',
      });
    } catch (error) {
      toast({
        title: '설정 변경 실패',
        description: error instanceof Error ? error.message : '다시 시도해주세요.',
      });
    }
  };

  const handleWithdraw = () => {
    setWithdrawDialogOpen(true);
  };

  const handleWithdrawConfirm = async (reason: string, otherReason?: string) => {
    if (!user) return;

    try {
      if (user.role === 'breeder') {
        // 브리더 회원 탈퇴 API 호출 (탈퇴 사유 포함)
        await deleteBreederAccount({
          reason,
          otherReason,
        });

        toast({
          title: '브리더 계정 탈퇴 완료',
          description: '그동안 이용해 주셔서 감사합니다.',
        });
      } else {
        // 입양자 회원 탈퇴 API 호출 (탈퇴 사유 포함)
        await deleteAccount({
          reason: reason as WithdrawReason,
          otherReason,
        });

        toast({
          title: '회원 탈퇴 완료',
          description: '그동안 이용해 주셔서 감사합니다.',
        });
      }

      // 탈퇴 성공 시 즉시 로그아웃 처리
      await logout();
      clearAuth();

      // 로그인 페이지로 리다이렉트
      window.location.href = '/login';
    } catch (error) {
      toast({
        title: '탈퇴 처리 실패',
        description: error instanceof Error ? error.message : '다시 시도해주세요.',
      });
    }
  };

  if (isAuthLoading || isLoading) {
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
            onMarketingAgreedChange={handleMarketingAgreedChange}
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
        userType={user?.role === 'breeder' ? 'breeder' : 'adopter'}
      />
    </div>
  );
}
