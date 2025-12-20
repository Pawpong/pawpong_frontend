'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Container from '@/components/ui/container';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import LoginSection from './_components/login-section';
import ProfileBannerCarousel from '@/components/profile-banner/profile-banner-carousel';
import {
  SimpleDialog,
  SimpleDialogContent,
  SimpleDialogHeader,
  SimpleDialogTitle,
  SimpleDialogDescription,
  SimpleDialogFooter,
} from '@/components/ui/simple-dialog';
import { Button } from '@/components/ui/button';

/**
 * 로그인 페이지 내부 컴포넌트
 * useSearchParams를 사용하므로 Suspense 경계 내에 있어야 함
 */
function LoginContent() {
  const isPC = useBreakpoint('lg');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorType, setErrorType] = useState<'deleted' | 'suspended' | 'error'>('error');

  useEffect(() => {
    const error = searchParams.get('error');
    const type = searchParams.get('type');

    if (error) {
      console.log('[Login Page] 에러 감지:', error, '타입:', type);
      if (type === 'deleted_account') {
        setErrorType('deleted');
      } else if (type === 'suspended_account') {
        setErrorType('suspended');
      } else {
        setErrorType('error');
      }
      setShowErrorModal(true);

      // 에러 파라미터 제거 (URL 정리)
      router.replace('/login');
    }
  }, [searchParams, router]);

  const handleModalClose = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <Container className="grid grid-cols-1 lg:grid-cols-2 gap-padding min-h-[calc(100vh-(--spacing(16)))]">
        {/* 왼쪽 배너 영역 */}
        {isPC && (
          <div className="h-full w-full pt-4 pb-padding ">
            <div className="relative pl-12 pb-10 h-full">
              <ProfileBannerCarousel />
            </div>
          </div>
        )}

        {/* 오른쪽 콘텐츠 */}
        <div className="flex items-center">
          <LoginSection />
        </div>
      </Container>

      {/* 로그인 에러 모달 */}
      <SimpleDialog open={showErrorModal} onOpenChange={handleModalClose}>
        <SimpleDialogContent>
          <SimpleDialogHeader>
            <SimpleDialogTitle className="text-primary">
              {errorType === 'deleted' && '탈퇴한 계정이에요'}
              {errorType === 'suspended' && '정지된 계정이에요'}
              {errorType === 'error' && '로그인에 실패했어요'}
            </SimpleDialogTitle>
            <SimpleDialogDescription className="text-grayscale-gray5">
              {errorType === 'deleted' && '이미 탈퇴 처리된 계정이에요.\n다른 계정으로 로그인해 주세요.'}
              {errorType === 'suspended' && '계정이 정지되었습니다.\n자세한 내용은 이메일을 확인해주세요.'}
              {errorType === 'error' && '로그인 중 문제가 발생했어요.\n잠시 후 다시 시도해 주세요.'}
            </SimpleDialogDescription>
          </SimpleDialogHeader>
          <SimpleDialogFooter className="grid-cols-1">
            <Button variant="tertiary" className="w-full" onClick={handleModalClose}>
              확인
            </Button>
          </SimpleDialogFooter>
        </SimpleDialogContent>
      </SimpleDialog>
    </>
  );
}

/**
 * 로그인 페이지
 * useSearchParams 사용을 위해 Suspense 경계로 감쌈
 */
export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <LoginContent />
    </Suspense>
  );
}
