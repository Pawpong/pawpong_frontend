'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCounselFormStore } from '@/stores/counsel-form-store';
import { useAuthStore } from '@/stores/auth-store';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import Cat from '@/assets/icons/cat';
import Dog from '@/assets/icons/dog';
import { Lock } from 'lucide-react';
import type { Animal } from '@/stores/signup-form-store';

export default function BreederProfile({
  data: { avatarUrl, nickname, level, location, priceRange, breeds, animal },
  breederId,
  isOwnProfile = false,
}: {
  data: {
    avatarUrl: string;
    nickname: string;
    level: 'new' | 'elite';
    location: string;
    priceRange: string | null;
    breeds: string[];
    animal: Animal;
  };
  breederId: string;
  isOwnProfile?: boolean;
}) {
  const router = useRouter();
  const { clearCounselFormData } = useCounselFormStore();
  const isLg = useBreakpoint('lg');

  const { isAuthenticated, user } = useAuthStore();
  const isBreeder = user?.role === 'breeder';

  const handleCounselClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    clearCounselFormData();
    router.push(`/counselform?breederId=${breederId}`);
  };

  const IconComponent = animal === 'cat' ? Cat : Dog;

  return (
    <div className="flex flex-col gap-4 lg:w-51">
      <div className="flex gap-4 lg:flex-col lg:gap-8">
        <div className="w-[8.25rem] h-[8.25rem] md:w-[10rem] md:h-[10rem] lg:w-[12.75rem] lg:h-[12.75rem] rounded-lg overflow-hidden shrink-0 bg-grayscale-gray1 flex items-center justify-center">
          {avatarUrl && avatarUrl !== '/profile-empty.svg' ? (
            <Image
              src={avatarUrl}
              alt={nickname}
              width={204}
              height={204}
              className="object-cover w-full h-full rounded-[0.452rem]"
              unoptimized={avatarUrl.startsWith('http')}
            />
          ) : (
            <IconComponent className="w-[6.1875rem] h-[6.1875rem] md:w-[7.5rem] md:h-[7.5rem] lg:w-[9.5625rem] lg:h-[9.5625rem] text-grayscale-gray5" />
          )}
        </div>
        <div className="flex-1 space-y-4 flex flex-col md:justify-between">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-heading-3 text-primary-500 font-semibold">{nickname}</span>
          </div>
          <div className="space-y-3">
            <div className="text-body-s mb-2 text-grayscale-gray5">
              <div>{location}</div>
              <div>
                {priceRange !== null ? (
                  priceRange
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    로그인 후 비용 확인 가능
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {breeds.map((breed) => (
                <div
                  key={breed}
                  className="bg-tertiary-500 py-1.5 px-2.5 rounded-[--spacing(1)] text-medium text-body-xs text-primary-500"
                >
                  {breed}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 데스크탑(lg)에서만 버튼 표시 */}
        {isLg && (
          <Button
            variant="tertiary"
            className="w-full h-12 text-body-s font-semibold text-primary-500"
            type="button"
            onClick={handleCounselClick}
            disabled={isOwnProfile || isBreeder}
          >
            입양 신청하기
          </Button>
        )}
      </div>
    </div>
  );
}
