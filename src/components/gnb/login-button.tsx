import Link from 'next/link';
import { Button } from '../ui/button';

export default function LoginButton() {
  return (
    <Link href="/login">
      <Button
        variant="tertiary"
        className="h-8 py-[var(--space-8)] px-[var(--space-12)] gap-[var(--space-4)] text-grayscale-gray6 text-body-xs font-normal hover:bg-secondary-600"
      >
        로그인
      </Button>
    </Link>
  );
}
