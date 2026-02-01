import Alarm from '@/assets/icons/alarm';

export default function NotificationEmptyState() {
  return (
    <div className="flex flex-col items-center py-[120px]">
      <div className="flex flex-col items-center gap-7">
        <Alarm className="w-[2.70831rem] h-[2.54938rem] text-grayscale-gray4" />
        <p className="text-body-l font-semibold text-grayscale-gray5">아직 도착한 알림이 없어요.</p>
      </div>
    </div>
  );
}
