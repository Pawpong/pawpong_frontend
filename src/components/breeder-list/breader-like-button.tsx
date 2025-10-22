"use client";

import Heart from "@/assets/icons/heart.svg";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import HeartFill from "@/assets/icons/heart-fill.svg";
import { useState } from "react";

export default function BreederLikeButton({
  className,
  ...props
}: { className?: string } & React.ComponentProps<"button">) {
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = () => {
    setIsLiked(!isLiked);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("text-grayscale-white size-8 ", className)}
      onClick={handleClick}
      {...props}
    >
      {isLiked ? (
        <HeartFill className="size-8 " />
      ) : (
        <Heart className="size-8 " />
      )}
    </Button>
  );
}
