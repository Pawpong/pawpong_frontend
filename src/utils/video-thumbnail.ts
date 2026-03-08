/**
 * 동영상 파일에서 첫 프레임을 썸네일로 추출하는 유틸리티
 */

// 동영상 MIME 타입 목록
const VIDEO_MIME_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];

// 동영상 썸네일 추출 실패 시 표시할 placeholder SVG
export const VIDEO_PLACEHOLDER_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="80" height="80" rx="8" fill="#F3F4F6"/>
  <rect x="18" y="24" width="44" height="32" rx="4" fill="#D1D5DB"/>
  <polygon points="36,34 36,50 50,42" fill="#9CA3AF"/>
  <text x="40" y="68" font-size="8" text-anchor="middle" fill="#6B7280" font-family="sans-serif">VIDEO</text>
</svg>
`)}`;

/**
 * 파일이 동영상인지 확인
 */
export function isVideoFile(file: File): boolean {
  return VIDEO_MIME_TYPES.includes(file.type) || /\.(mp4|mov|avi|webm)$/i.test(file.name);
}

/**
 * URL이 동영상인지 확인
 */
export function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|avi|webm)(\?|$)/i.test(url);
}

/**
 * 동영상 파일에서 첫 프레임을 추출하여 썸네일 Data URL 반환
 * iOS에서 MOV 파일의 onloadeddata가 안 뜨는 경우를 대비하여 타임아웃 포함
 */
export function extractVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let resolved = false;

    const cleanup = () => {
      if (video.src.startsWith('blob:')) {
        URL.revokeObjectURL(video.src);
      }
    };

    const done = (result: string) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve(result);
    };

    // 5초 타임아웃: iOS에서 MOV onloadeddata가 안 뜨는 경우 대비
    const timeout = setTimeout(() => {
      done(VIDEO_PLACEHOLDER_SVG);
    }, 5000);

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      video.currentTime = 0;
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
      clearTimeout(timeout);
      done(thumbnailUrl);
    };

    video.onerror = () => {
      clearTimeout(timeout);
      done(VIDEO_PLACEHOLDER_SVG);
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * 동영상 URL에서 첫 프레임을 추출하여 썸네일 Data URL 반환
 * CDN에 CORS 헤더가 없을 수 있으므로 crossOrigin 없이 로드 후 tainted canvas 처리
 */
export function extractVideoThumbnailFromUrl(url: string): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let resolved = false;

    const done = (result: string) => {
      if (resolved) return;
      resolved = true;
      resolve(result);
    };

    // 5초 타임아웃
    const timeout = setTimeout(() => {
      done(VIDEO_PLACEHOLDER_SVG);
    }, 5000);

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    // crossOrigin 제거: CDN에 CORS 헤더 없으면 비디오 로드 자체가 실패함

    video.onloadeddata = () => {
      video.currentTime = 0;
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      try {
        // CORS 없이 로드된 비디오는 tainted canvas → toDataURL 에러
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
        clearTimeout(timeout);
        done(thumbnailUrl);
      } catch {
        clearTimeout(timeout);
        done(VIDEO_PLACEHOLDER_SVG);
      }
    };

    video.onerror = () => {
      clearTimeout(timeout);
      done(VIDEO_PLACEHOLDER_SVG);
    };

    video.src = url;
  });
}
