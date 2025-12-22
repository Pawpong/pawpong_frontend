'use client';

import Logo from '@/assets/logo/logo';
import { Button } from '../ui/button';
import Link from 'next/link';
import NoticeButton from './notice-button';
import Close from '@/assets/icons/close';
import { SheetClose } from '../ui/sheet';

export default function MobileNavHeader() {
  return (
    <div className="flex items-center justify-between h-16 px-5 pr-[18px] py-3 shrink-0">
      <SheetClose asChild>
        <Link href="/">
          <Button variant={'ghost'} className="py-2 -mx-3 -my-2 h-auto has-[>svg]:px-2">
            <Logo className="w-20 h-auto text-primary" />
          </Button>
        </Link>
      </SheetClose>
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
