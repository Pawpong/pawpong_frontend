'use client';

import { useParams, useRouter } from 'next/navigation';
import Container from '@/components/ui/container';
import { useAuthStore } from '@/stores/auth-store';
import { useInquiryDetail } from '../_hooks/use-inquiry-detail';
import { LoadingText } from '@/components/loading-state';
import InquiryDetailContent from './_components/inquiry-detail-content';
import InquiryAnswerWriteButton from './_components/inquiry-answer-write-button';

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const id = typeof params?.id === 'string' ? params.id : null;
  const { data: inquiry, isLoading, isError } = useInquiryDetail(id);

  const handleEdit = () => {
    if (id) router.push(`/inquiries/${id}/edit`);
  };
  const handleDelete = () => {
    if (id && typeof window !== 'undefined' && window.confirm('이 질문을 삭제할까요?')) {
      // TODO: 삭제 API 연동 후 목록으로 이동
      router.push('/inquiries');
    }
  };

  const handleWriteAnswer = () => {
    if (id) router.push(`/inquiries/${id}/answer`);
  };

  if (isLoading) {
    return (
      <Container className="py-6">
        <div className="flex justify-center py-12">
          <LoadingText className="text-body-m text-grayscale-gray5" />
        </div>
      </Container>
    );
  }

  if (isError || !inquiry) {
    return (
      <Container className="py-6">
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <p className="text-body-m text-grayscale-gray5">질문을 찾을 수 없어요.</p>
          <a href="/inquiries" className="text-body-m font-medium text-primary-500 underline">
            질문 목록으로
          </a>
        </div>
      </Container>
    );
  }

  const isBreeder = user?.role === 'breeder';
  const isActiveBreeder = user?.role === 'breeder' && user?.verificationStatus === 'approved';
  const hasAnswered = inquiry.currentUserHasAnswered ?? false;

  return (
    <Container className="pb-20">
      <InquiryDetailContent
        inquiry={inquiry}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isBreeder={isBreeder}
        isActiveBreeder={isActiveBreeder}
        hasAnswered={hasAnswered}
        onWriteAnswer={handleWriteAnswer}
      />
      {isBreeder && (
        <div className="sticky bottom-6 flex w-full justify-center px-8 md:bottom-10 md:px-4 lg:px-0.5">
          <InquiryAnswerWriteButton
            isActive={isActiveBreeder}
            hasAnswered={hasAnswered}
            onWriteAnswer={handleWriteAnswer}
          />
        </div>
      )}
    </Container>
  );
}
