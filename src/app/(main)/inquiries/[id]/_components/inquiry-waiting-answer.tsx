'use client';

import EmptyPetState from '@/app/(main)/explore/breeder/[id]/_components/empty-pet-state';

export default function InquiryWaitingAnswer() {
  return (
    <div className="py-10">
      <EmptyPetState message="아직 답변을 기다리고 있어요" />
    </div>
  );
}
