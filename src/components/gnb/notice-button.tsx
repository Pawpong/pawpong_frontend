import Alarm from "@/assets/icons/alarm";
import { Button } from "../ui/button";
export default function NoticeButton() {
  return (
    <Button variant="ghost" size="icon" className="size-9 -m-1.5">
      <div className="flex items-center justify-center size-6">
        <Alarm className="size-5" />
      </div>
    </Button>
  );
}
