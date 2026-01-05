'use client';

import Image from 'next/image';
import AdBadge from '@/components/ad-badge';
import Breeder from '@/components/breeder-list/breeder';
import BreederProfile from '@/components/breeder-list/breeder-profile';
import adImage from '@/assets/images/ad.png';

export default function ExploreBreederAd() {
  return (
    <Breeder>
      <BreederProfile>
        <div className="flex flex-col gap-3">
          <p className="text-heading-3 font-semibold text-primary-500">
            광고 텍스트 최대 두 줄 노출 가능 / 광고 텍스트 최대 두 줄 노출 가능 / 광고 텍스트 최대 두 줄 노출 가능 /
            광고 텍스트
          </p>
          <p className="text-body-s text-grayscale-gray5 ">
            서브 텍스트 최대 한 줄 / 서브 텍스트 최대 한 줄 / 서브 텍스트 최대 한 줄 / 서브 텍스트
          </p>
          <div className="mt-2">
            <AdBadge />
          </div>
        </div>
      </BreederProfile>
      <div className="relative">
        <div className="relative w-full h-[224px] @xl:w-auto @xl:h-56 @xl:aspect-square @4xl:aspect-[432/224] overflow-hidden rounded-lg">
          <Image src={adImage} alt="광고 이미지" fill className="object-cover" unoptimized />
        </div>
      </div>
    </Breeder>
  );
}
