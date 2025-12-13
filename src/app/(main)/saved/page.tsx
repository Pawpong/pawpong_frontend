'use client';

import SavedList from '@/app/(main)/saved/_components/saved-list';
import Container from '@/components/ui/container';
import { useAuthGuard } from '@/hooks/use-auth-guard';

const SavedPage = () => {
  const { isLoading: isAuthLoading } = useAuthGuard();

  if (isAuthLoading) {
    return (
      <Container>
        <div className="flex-1 @container">
          <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">찜한 브리더</div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-grayscale-gray5">로딩 중...</div>
          </div>
        </div>
      </Container>
    );
  }

  return <SavedList />;
};

export default SavedPage;
