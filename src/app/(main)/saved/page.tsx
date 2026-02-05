'use client';

import SavedList from '@/app/(main)/saved/_components/saved-list';
import Container from '@/components/ui/container';
import { useAuthGuard } from '@/hooks/use-auth-guard';

const SavedPage = () => {
  useAuthGuard(); // 인증 체크만 수행

  return <SavedList />;
};

export default SavedPage;
