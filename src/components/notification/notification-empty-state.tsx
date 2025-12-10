"use client";

export default function NotificationEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 mb-4 flex items-center justify-center bg-grayscale-gray1 rounded-full">
        <span className="text-3xl">🔔</span>
      </div>
      <p className="text-body-m font-medium text-primary mb-1">
        알림이 없습니다
      </p>
      <p className="text-body-s text-grayscale-gray5 text-center">
        새로운 알림이 도착하면 여기에 표시됩니다
      </p>
    </div>
  );
}
