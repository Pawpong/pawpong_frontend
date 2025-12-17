'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ArrowRight from '@/assets/icons/arrow-right';
import Paw from '@/assets/icons/paw';
import HeartGray from '@/assets/icons/heart-gray-fill.svg';
import Siren from '@/assets/icons/siren';
import { Button } from '@/components/ui/button';
import ReportDialog from '@/components/report-dialog/report-dialog';
import { useToggleFavorite, useFavorites } from '@/app/(main)/saved/_hooks/use-favorites';
import type { FavoriteItemDto } from '@/lib/adopter';

interface HeaderProps {
  breederNickname: string;
  breederId: string;
}

export default function Header({ breederNickname, breederId }: HeaderProps) {
  const router = useRouter();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { toggle, isLoading } = useToggleFavorite();
  const { data: favoritesData } = useFavorites(1, 1000); // 즐겨찾기 목록 조회
  const [isLiked, setIsLiked] = useState(false);

  // 즐겨찾기 목록에서 현재 브리더가 포함되어 있는지 확인
  useEffect(() => {
    if (favoritesData?.items) {
      const isFavorited = favoritesData.items.some((item: FavoriteItemDto) => item.breederId === breederId);
      setIsLiked(isFavorited);
    }
  }, [favoritesData, breederId]);

  const handleBack = () => {
    router.back();
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    toggle(breederId, isLiked);
  };

  return (
    <>
      <div className="flex items-center justify-between text-grayscale-gray6 py-6">
        <Button variant="secondary" size="icon" className="size-9" onClick={handleBack}>
          <ArrowRight className="size-7" />
        </Button>
        <div className="flex gap-3">
          <Button variant="secondary" size="icon" className="size-9" onClick={() => setIsReportDialogOpen(true)}>
            <Siren className="size-7" />
          </Button>
          <Button variant="secondary" size="icon" className="size-9" onClick={handleLikeClick} disabled={isLoading}>
            {isLiked ? (
              <HeartGray className="size-7" style={{ shapeRendering: 'crispEdges' }} />
            ) : (
              <Paw className="size-7" />
            )}
          </Button>
        </div>
      </div>
      <ReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        type="breeder"
        breederNickname={breederNickname}
        breederId={breederId}
      />
    </>
  );
}
