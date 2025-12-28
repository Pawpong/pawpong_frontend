'use client';
import Close from '@/assets/icons/close-primary.svg';
import Logo from '@/assets/logo/logo';
import { Button } from '@/components/ui/button';
import ExitConfirmDialog from '@/components/exit-confirmation-dialog';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  return (
    <div className="flex justify-between h-16 items-center pl-[1.125rem] pr-5 md:pl-10 md:pr-[2.375rem] lg:pl-12 lg:pr-12 sticky top-0">
      <ExitConfirmDialog hasData={true} onConfirm={() => router.push('/')}>
        <Button variant={'ghost'} className="w-20 cursor-pointer">
          <Logo className="text-primary-500 h-6 shrink-0" />
        </Button>
      </ExitConfirmDialog>
      <ExitConfirmDialog hasData={true} onConfirm={() => router.push('/')}>
        <Button size="icon" variant={'ghost'} className="text-primary-500 size-6 cursor-pointer">
          <Close />
        </Button>
      </ExitConfirmDialog>
    </div>
  );
}
