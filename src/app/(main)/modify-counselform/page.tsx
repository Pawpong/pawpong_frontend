'use client';

import dynamic from 'next/dynamic';
import { LoadingText } from '@/components/dynamic-loading';

const CounselFormContent = dynamic(() => import('./_components/counsel-form-content'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingText />
    </div>
  ),
});

export default function CounselFormPage() {
  return <CounselFormContent />;
}
