import Cat from '@/assets/icons/cat';
import Dog from '@/assets/icons/dog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface BreederAvatarProps {
  src?: string | null;
  animal?: 'cat' | 'dog';
}

export default function BreederAvatar({ src, animal = 'dog' }: BreederAvatarProps) {
  return (
    <Avatar className="size-12">
      {src && <AvatarImage src={src} />}
      <AvatarFallback>
        {animal === 'cat' ? (
          <Cat className="w-[6.1875rem] h-[6.1875rem] md:w-[7.5rem] md:h-[7.5rem] lg:size-9 text-grayscale-gray5" />
        ) : (
          <Dog className="w-[6.1875rem] h-[6.1875rem] md:w-[7.5rem] md:h-[7.5rem] lg:size-9 text-grayscale-gray5" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
