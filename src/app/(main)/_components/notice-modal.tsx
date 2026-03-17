'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const STORAGE_KEY = 'notice-modal-hidden-date';
const INSTAGRAM_POST_URL = 'https://www.instagram.com/p/DVtGIoXkdTQ/';

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

export default function NoticeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hiddenDate = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();
    if (hiddenDate !== today) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => setOpen(false);

  const handleHideToday = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toDateString());
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div
        className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col w-[min(80vw,540px)] max-h-[90dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto">
          <blockquote
            className="instagram-media min-w-0 w-full m-0"
            data-instgrm-permalink={INSTAGRAM_POST_URL}
            data-instgrm-version="14"
          />
        </div>

        <div className="flex shrink-0 border-t border-[#E1E1E1]">
          <button
            type="button"
            onClick={handleHideToday}
            className="flex-1 py-3.5 text-body-s font-medium text-grayscale-gray5 hover:bg-gray-50 transition-colors"
          >
            오늘 하루 보지 않기
          </button>
          <div className="w-px bg-[#E1E1E1]" />
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-3.5 text-body-s font-medium text-primary-500 hover:bg-gray-50 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>

      {open && (
        <Script
          src="https://www.instagram.com/embed.js"
          strategy="lazyOnload"
          onLoad={() => window.instgrm?.Embeds.process()}
        />
      )}
    </div>
  );
}
