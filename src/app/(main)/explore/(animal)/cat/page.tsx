import { Suspense } from 'react';
import SiteBreederList from '../../_components/site-breeder-list';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">로딩 중...</div>}>
      <SiteBreederList />
    </Suspense>
  );
}
