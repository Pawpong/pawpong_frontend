import Close from '@/assets/icons/close-blue.svg';
import Logo from '@/assets/logo/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Header() {
  return (
    <div className="flex justify-between h-16 items-center pl-[1.125rem] pr-5 md:pl-10 md:pr-[2.375rem] lg:pl-12 lg:pr-12 sticky top-0">
      <Link href="/">
        <Button variant={'ghost'} className="w-20">
          <Logo className="text-secondary-600 h-6 shrink-0" />
        </Button>
      </Link>
      <Link href="/">
        <Button size="icon" variant={'ghost'} className="text-secondary size-6  cursor-pointer">
          <Close />
        </Button>
      </Link>
    </div>
  );
}
