'use client';

import { cn } from '@/api/utils';

interface ReviewTabsProps {
  activeTab: '상담 후기' | '입양 후기';
  onChange: (tab: ReviewTabsProps['activeTab']) => void;
}

export default function ReviewTabs({ activeTab, onChange }: ReviewTabsProps) {
  const tabs = ['상담 후기', '입양 후기'] as const;

  return (
    <div className="flex gap-4 items-start">
      {tabs.map((tab) => (
        <button key={tab} onClick={() => onChange(tab)} className="flex flex-col items-start">
          <p
            className={cn('text-body-m font-semibold', activeTab === tab ? 'text-primary-500' : 'text-grayscale-gray5')}
          >
            {tab}
          </p>
          <div className="h-[2px] w-full mt-1.5">
            {activeTab === tab && <div className="bg-primary-500 h-[2px] w-full" />}
          </div>
        </button>
      ))}
    </div>
  );
}
