import LogoButton from './logo-button';
import NoticeButton from './notice-button';
import Close from '@/assets/icons/close';
import { SheetClose } from '../ui/sheet';

export default function MobileNavHeader() {
  return (
    <div className="flex items-center justify-between h-16 px-5 pr-[18px] py-3 shrink-0">
      <LogoButton />
      <div className="flex gap-4 items-center">
        <NoticeButton />
        <SheetClose asChild>
          <button className="flex items-center justify-center size-6">
            <Close className="size-5" />
          </button>
        </SheetClose>
      </div>
    </div>
  );
}
