"use client";

import React from "react";
import { cn } from "@/api/utils";

interface NotificationItemProps {
  icon: React.ReactNode;
  content: string;
  date: string;
  onClick?: () => void;
  className?: string;
}

export default function NotificationItem({
  icon,
  content,
  date,
  onClick,
  className,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex flex-row gap-4 p-3 rounded-lg",
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={onClick}
    >
      {/* 아이콘 */}
      <div className="w-[3rem] h-[3rem] bg-primary-500-basic flex items-center justify-center rounded-[0.5rem]">
        {icon}
      </div>
      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <p className="text-body-xs font-medium text-grayscale-gray6 leading-[1.43] break-words whitespace-pre-line">
          {content}
        </p>
        <p className="text-caption font-medium text-grayscale-gray5">{date}</p>
      </div>
    </div>
  );
}
