/**
 * 동영상 파일에서 첫 프레임을 썸네일로 추출하는 유틸리티
 */

// 동영상 MIME 타입 목록
const VIDEO_MIME_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];

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
 */
export function extractVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      // 첫 프레임으로 이동
      video.currentTime = 0;
    };

    video.onseeked = () => {
      // 캔버스 크기를 동영상 크기에 맞춤
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 첫 프레임을 캔버스에 그림
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Data URL로 변환
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);

      // 메모리 정리
      URL.revokeObjectURL(video.src);

      resolve(thumbnailUrl);
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('동영상 썸네일 추출에 실패했습니다.'));
    };

    // 동영상 소스 설정
    video.src = URL.createObjectURL(file);
  });
}

/**
 * 동영상 URL에서 첫 프레임을 추출하여 썸네일 Data URL 반환
 */
export function extractVideoThumbnailFromUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    video.onloadeddata = () => {
      video.currentTime = 0;
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
      resolve(thumbnailUrl);
    };

    video.onerror = () => {
      // 썸네일 추출 실패 시 원본 URL 반환
      resolve(url);
    };

    video.src = url;
  });
}
