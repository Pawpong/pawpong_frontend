'use client';

interface NoticeListItemProps {
  title: string;
  date: string;
}

export default function NoticeListItem({ title, date }: NoticeListItemProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-body-m font-medium text-primary-500">{title}</p>
      <p className="text-body-s font-normal text-grayscale-gray5">{date}</p>
    </div>
  );
}
