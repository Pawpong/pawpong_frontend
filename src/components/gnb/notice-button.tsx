import Alarm from '@/assets/icons/alarm.svg';
import { Button } from '../ui/button';
export default function NoticeButton() {
  return (
    <Button variant="ghost" size="icon" className="size-9 -m-1.5">
      <div className="flex items-center justify-center size-6">
        <Alarm />
      </div>
    </Button>
  );
}
