"use client";

import Heart from "@/assets/icons/heart.svg";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import HeartFill from "@/assets/icons/heart-fill.svg";
import { useSavedStore } from "@/stores/saved-store";
import { useEffect, useState } from "react";

interface BreederLikeButtonProps {
  className?: string;
  breederId: string;
}

export default function BreederLikeButton({
  className,
  breederId,
}: BreederLikeButtonProps) {
  const { isSaved, toggleSaved } = useSavedStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isLiked = isHydrated ? isSaved(breederId) : false;

  const handleClick = () => {
    toggleSaved(breederId);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("text-grayscale-white size-8 ", className)}
      onClick={handleClick}
    >
      {isLiked ? (
        <HeartFill className="size-8 " />
      ) : (
        <Heart className="size-8 " />
      )}
    </Button>
  );
}
