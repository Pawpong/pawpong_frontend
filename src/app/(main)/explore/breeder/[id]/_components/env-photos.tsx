'use client';

import Image from 'next/image';
import { isVideoUrl } from '@/utils/video-thumbnail';

export default function EnvPhotos({ photos }: { photos: string[] }) {
  return (
    <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-gutter">
      {photos.map((photo, index) => {
        const isVideo = isVideoUrl(photo);
        return (
          <div
            key={index}
            className="relative w-full max-w-[22.0625rem] aspect-square md:max-w-[13.66669rem] lg:max-w-none rounded-[--spacing(4)] overflow-hidden"
          >
            {isVideo ? (
              <video
                src={photo}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <Image
                src={photo}
                alt={`Environment Photo ${index + 1}`}
                width={400}
                height={400}
                className="object-cover w-full h-full rounded-lg"
                unoptimized={photo.startsWith('http')}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
