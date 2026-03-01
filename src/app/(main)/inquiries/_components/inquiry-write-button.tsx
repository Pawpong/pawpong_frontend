'use client';

import Link from 'next/link';
import PencilPixcel from '@/assets/icons/pencil-pixcel.svg';
import { Button } from '@/components/ui/button';

interface InquiryWriteButtonProps {
  variant?: 'secondary' | 'tertiary';
}

export default function InquiryWriteButton({ variant = 'tertiary' }: InquiryWriteButtonProps) {
  return (
    <Link href="/inquiries/write">
      <Button variant={variant} size="sm" className="h-9 pl-4 pr-3 gap-1 text-body-xs">
        공통 질문 작성
        <PencilPixcel className="size-5 shrink-0" />
      </Button>
    </Link>
  );
}
