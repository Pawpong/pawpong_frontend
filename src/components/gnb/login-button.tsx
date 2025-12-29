import Link from 'next/link';
import { Button } from '../ui/button';

export default function LoginButton() {
  return (
    <Link href="/login">
      <Button variant="tertiary" className="text-grayscale-gray6 text-body-xs font-normal hover:bg-secondary-600">
        로그인
      </Button>
    </Link>
  );
}
