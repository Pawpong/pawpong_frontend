'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ArrowRight from '@/assets/icons/arrow-right';
import Paw from '@/assets/icons/paw';
import HeartBlackFill from '@/assets/icons/heart-black-fill.svg';
import Siren from '@/assets/icons/siren';
import Pencil from '@/assets/icons/pixel-pencil.svg';
import { Button } from '@/components/ui/button';
import ReportDialog from '@/components/report-dialog/report-dialog';
import { useToggleFavorite, useFavorites } from '@/app/(main)/saved/_hooks/use-favorites';
import { useAuthStore } from '@/stores/auth-store';
import type { FavoriteItemDto } from '@/lib/adopter';

interface HeaderProps {
  breederNickname: string;
  breederId: string;
  hideActions?: boolean;
}

export default function Header({ breederNickname, breederId, hideActions = false }: HeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { toggle, isLoading } = useToggleFavorite();
  const { data: favoritesData } = useFavorites(1, 1000, isAuthenticated); // 로그인 시에만 조회
  const [isLiked, setIsLiked] = useState(false);

  // 브리더 본인인지 확인
  const isOwnProfile = user?.role === 'breeder' && user?.userId === breederId;

  // 즐겨찾기 목록에서 현재 브리더가 포함되어 있는지 확인
  useEffect(() => {
    if (favoritesData?.items && !isOwnProfile) {
      const isFavorited = favoritesData.items.some((item: FavoriteItemDto) => item.breederId === breederId);
      setIsLiked(isFavorited);
    }
  }, [favoritesData, breederId, isOwnProfile]);

  const handleBack = () => {
    router.back();
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    toggle(breederId, isLiked);
  };

  const handleEditClick = () => {
    router.push('/profile');
  };

  return (
    <>
      <div className="flex items-center justify-between text-grayscale-gray6 py-6">
        <Button variant="secondary" size="icon" className="size-9" onClick={handleBack}>
          <ArrowRight className="size-7" />
        </Button>
        {!hideActions && (
          <div className="flex gap-3">
            {isOwnProfile ? (
              <Button variant="tertiary" size="icon" className="size-9" onClick={handleEditClick}>
                <Pencil className="size-7" />
              </Button>
            ) : (
              <>
                <Button variant="secondary" size="icon" className="size-9" onClick={() => setIsReportDialogOpen(true)}>
                  <Siren className="size-7" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-9"
                  onClick={handleLikeClick}
                  disabled={isLoading}
                >
                  {isLiked ? <HeartBlackFill className="size-7" /> : <Paw className="size-7" />}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      {!isOwnProfile && (
        <ReportDialog
          open={isReportDialogOpen}
          onOpenChange={setIsReportDialogOpen}
          type="breeder"
          breederNickname={breederNickname}
          breederId={breederId}
        />
      )}
    </>
  );
}
