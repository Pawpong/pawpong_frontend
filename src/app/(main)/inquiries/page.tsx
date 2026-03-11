'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Container from '@/components/ui/container';
import MyInquiryList from './_components/my-inquiry-list';
import BreederAnswerList from './_components/breeder-answer-list';
import DefaultInquiryTab from './_components/default-inquiry-tab';
import { useAuthStore } from '@/stores/auth-store';

export default function InquiriesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const tab = searchParams.get('tab');
  const isBreederUser = user?.role === 'breeder';

  const isMyParam = tab === 'my';
  const isBreederParam = tab === 'breeder';
  const isProtectedTab = isMyParam || isBreederParam;

  // 브리더는 tab=my 로 들어와도 내 답변 탭으로 취급
  const isMyTab = !isBreederUser && isMyParam;
  const isBreederTab = isBreederUser ? isMyParam || isBreederParam : isBreederParam;

  useEffect(() => {
    if (!isAuthenticated && isProtectedTab) {
      const returnUrl = `/inquiries${isMyParam ? '?tab=my' : '?tab=breeder'}`;
      router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [isAuthenticated, isProtectedTab, isMyParam, router]);

  if (!isAuthenticated && isProtectedTab) {
    return null;
  }

  if (isMyTab) {
    return (
      <Container className="pb-20">
        <div className="flex flex-col">
          <div className="pt-6 md:pt-7 lg:pt-10">
            <h2 className="text-heading-3 font-semibold text-primary-500">내 질문</h2>
          </div>
          <MyInquiryList />
        </div>
      </Container>
    );
  }

  if (isBreederTab) {
    return (
      <Container className="pb-20">
        <div className="flex flex-col">
          <div className="pt-6 md:pt-7 lg:pt-10">
            <h2 className="text-heading-3 font-semibold text-primary-500">내 답변</h2>
          </div>
          <BreederAnswerList />
        </div>
      </Container>
    );
  }

  return <DefaultInquiryTab />;
}
