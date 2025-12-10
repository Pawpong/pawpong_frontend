"use client";

import React from "react";

interface NotificationItemProps {
  icon: React.ReactNode;
  content: string;
  date: string;
}

export default function NotificationItem({
  icon,
  content,
  date,
}: NotificationItemProps) {
  return (
    <div className="flex gap-3 px-3 py-4 hover:bg-grayscale-gray1 rounded-lg cursor-pointer transition-colors">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-grayscale-gray1 rounded-full">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body-s text-primary whitespace-pre-line leading-relaxed">
          {content}
        </p>
        <p className="text-body-xs text-grayscale-gray5 mt-1">{date}</p>
      </div>
    </div>
  );
}
