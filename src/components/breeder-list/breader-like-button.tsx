'use client';

import Heart from '@/assets/icons/heart.svg';
// import HeartBlack from '@/assets/icons/heart-black.svg';
// import HeartBlackFill from '@/assets/icons/heart-black-fill.svg';
import HeartGray from '@/assets/icons/heart-gray-no-fill.svg';
import HeartGrayFill from '@/assets/icons/heart-gray-fill.svg';
import { cn } from '@/api/utils';
import { Button } from '../ui/button';
import HeartFill from '@/assets/icons/heart-fill.svg';
import { useToggleFavorite } from '@/app/(main)/saved/_hooks/use-favorites';
import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useAnalytics } from '@/hooks/use-analytics';

interface BreederLikeButtonProps {
  className?: string;
  breederId: string;
  initialIsFavorited?: boolean;
  hasImage?: boolean;
}

export default function BreederLikeButton({
  className,
  breederId,
  initialIsFavorited = false,
  hasImage = true,
}: BreederLikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsFavorited);
  const { toggle, isLoading } = useToggleFavorite();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { trackAddFavorite, trackRemoveFavorite } = useAnalytics();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // 낙관적 업데이트 (Optimistic UI)
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    // GA4 즐겨찾기 트래킹
    if (newLikedState) {
      trackAddFavorite(breederId);
    } else {
      trackRemoveFavorite(breederId);
    }

    // API 호출
    toggle(breederId, isLiked);
  };

  // 찜하기 상태에 따라 아이콘 선택
  const HeartIcon = isLiked ? (hasImage ? HeartFill : HeartGrayFill) : hasImage ? Heart : HeartGray;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('text-grayscale-white size-8 ', className)}
      onClick={handleClick}
      disabled={isLoading}
    >
      <HeartIcon className="size-8 " />
    </Button>
  );
}
