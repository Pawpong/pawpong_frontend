'use client';

import Heart from '@/assets/icons/heart.svg';
import HeartBlack from '@/assets/icons/heart-black.svg';
import HeartBlackFill from '@/assets/icons/heart-black-fill.svg';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import HeartFill from '@/assets/icons/heart-fill.svg';
import { useToggleFavorite } from '@/app/(main)/saved/_hooks/use-favorites';
import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // 낙관적 업데이트 (Optimistic UI)
    setIsLiked(!isLiked);

    // API 호출
    toggle(breederId, isLiked);
  };

  // 찜하기 상태에 따라 아이콘 선택
  const HeartIcon = isLiked ? (hasImage ? HeartFill : HeartBlackFill) : hasImage ? Heart : HeartBlack;

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
