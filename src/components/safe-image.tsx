'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { isVideoUrl } from '@/utils/video-thumbnail';

/**
 * HEIC URL인지 확인
 * 이미 S3에 저장된 .heic 파일은 브라우저가 렌더링 불가
 */
function isHeicUrl(url: string): boolean {
  return /\.(heic|heif)(\?|$)/i.test(url);
}

// HEIC/깨진 이미지용 placeholder SVG
const IMAGE_PLACEHOLDER_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#F3F4F6"/>
  <rect x="140" y="140" width="120" height="90" rx="8" fill="#D1D5DB"/>
  <circle cx="200" cy="185" r="20" fill="#9CA3AF"/>
  <circle cx="200" cy="185" r="12" fill="#F3F4F6"/>
  <text x="200" y="260" font-size="18" text-anchor="middle" fill="#9CA3AF" font-family="sans-serif">이미지 로드 실패</text>
</svg>
`)}`;

/**
 * Next.js Image 래퍼 - HEIC URL 감지, 빈 src 방어, 동영상 URL 폴백 및 onError fallback 제공
 * S3에 이미 저장된 HEIC 파일이나 깨진 이미지에 대한 방어 처리
 */
export default function SafeImage({ src, onError, ...props }: ImageProps) {
  const [hasError, setHasError] = useState(false);

  const srcStr = typeof src === 'string' ? src : '';

  // 빈 src, HEIC URL, 또는 에러 발생 시 placeholder
  if (hasError || !srcStr || isHeicUrl(srcStr)) {
    return (
      <Image {...props} src={IMAGE_PLACEHOLDER_SVG} alt={props.alt || '이미지를 표시할 수 없습니다'} unoptimized />
    );
  }

  // 동영상 URL이 SafeImage에 도달한 경우 video 엘리먼트로 렌더링
  if (isVideoUrl(srcStr)) {
    const videoStyle: React.CSSProperties = props.fill
      ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }
      : {};

    return (
      <video
        ref={(el) => {
          if (el) {
            el.muted = true;
            el.play().catch(() => {});
          }
        }}
        src={srcStr}
        className={typeof props.className === 'string' ? props.className : undefined}
        style={videoStyle}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }

  return (
    <Image
      {...props}
      src={src}
      onError={(e) => {
        setHasError(true);
        onError?.(e);
      }}
    />
  );
}
