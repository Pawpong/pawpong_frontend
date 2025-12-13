import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export default function SocialLoginButton({ className, children, ...props }: React.ComponentProps<'button'>) {
  return (
    <Button className={cn(`h-12 px-4 py-3 justify-between w-full`, className)} {...props}>
      {children}
      <div className="size-4" />
    </Button>
  );
}
