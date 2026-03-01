'use client';

import { useSearchParams } from 'next/navigation';
import Container from '@/components/ui/container';
import MyInquiryList from './_components/my-inquiry-list';
import BreederAnswerList from './_components/breeder-answer-list';
import DefaultInquiryTab from './_components/default-inquiry-tab';

export default function InquiriesPage() {
  const searchParams = useSearchParams();

  const tab = searchParams.get('tab');
  const isMyTab = tab === 'my';
  const isBreederTab = tab === 'breeder';

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
