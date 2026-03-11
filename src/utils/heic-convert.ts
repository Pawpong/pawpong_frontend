/**
 * HEIC/HEIF 이미지를 브라우저에서 미리보기 가능한 Blob URL로 변환하는 유틸리티
 *
 * 배경:
 * - 브라우저(Chrome/Firefox 등)는 HEIC 포맷을 네이티브 렌더링 불가 → 미리보기 깨짐
 * - 실제 업로드 시 백엔드(heic-convert)가 JPEG으로 변환하므로 업로드 자체는 문제 없음
 * - 클라이언트에서 heic-to(libheif 1.21.2)로 변환하여 미리보기 제공
 *
 * heic-to/next: Next.js 환경에 최적화된 엔트리포인트 사용
 */

// HEIC placeholder: 변환 실패 시 표시되는 SVG
export const HEIC_PLACEHOLDER_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="80" height="80" rx="8" fill="#F3F4F6"/>
  <rect x="22" y="28" width="36" height="28" rx="3" fill="#D1D5DB"/>
  <circle cx="40" cy="42" r="7" fill="#9CA3AF"/>
  <circle cx="40" cy="42" r="4" fill="#F3F4F6"/>
  <text x="40" y="68" font-size="8" text-anchor="middle" fill="#6B7280" font-family="sans-serif">HEIC</text>
</svg>
`)}`;

/** HEIC/HEIF 파일 여부를 mimetype + 확장자로 빠르게 판별 (동기) */
export function isHeicFile(file: File): boolean {
  return file.type === 'image/heic' || file.type === 'image/heif' || /\.(heic|heif)$/i.test(file.name);
}

/**
 * heic-to 모듈을 동적 import (Next.js 전용 엔트리포인트)
 * SSR에서 로드되지 않도록 dynamic import 사용
 */
async function loadHeicTo() {
  const { heicTo } = await import('heic-to/next');
  return heicTo;
}

/** 변환 결과 타입: 성공 시 preview URL, 실패 시 placeholder + 에러 메시지 */
export type HeicConvertResult = {
  preview: string;
  converted: boolean;
  error?: string;
};

/**
 * HEIC 파일을 JPEG Blob URL로 변환 (image-edit.tsx 사진 목록용)
 * - HEIC/HEIF: heic-to로 JPEG 변환 후 Blob URL 반환
 * - 변환 실패: placeholder SVG + error 메시지 반환
 * - 그 외: URL.createObjectURL 직접 반환
 */
export async function getImagePreview(file: File): Promise<HeicConvertResult> {
  if (!isHeicFile(file)) {
    return { preview: URL.createObjectURL(file), converted: false };
  }

  try {
    const heicTo = await loadHeicTo();
    const jpegBlob = await heicTo({
      blob: file,
      type: 'image/jpeg',
      quality: 0.85,
    });
    return { preview: URL.createObjectURL(jpegBlob), converted: true };
  } catch (err) {
    console.warn('[heic-convert] getImagePreview 변환 실패:', err);
    return {
      preview: HEIC_PLACEHOLDER_SVG,
      converted: false,
      error: 'HEIC 이미지 미리보기 변환에 실패했습니다. 저장 시 자동으로 JPEG로 변환됩니다.',
    };
  }
}

/**
 * HEIC 파일을 Data URL로 변환 (profile-basic-info.tsx 프로필 이미지용)
 * - HEIC/HEIF: heic-to로 JPEG Blob 변환 → FileReader로 Data URL 생성
 * - 변환 실패: placeholder SVG + error 메시지 반환
 * - 그 외: FileReader.readAsDataURL 방식
 */
export async function getImageDataUrl(file: File): Promise<HeicConvertResult> {
  if (!isHeicFile(file)) {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) resolve(event.target.result as string);
        else reject(new Error('FileReader 결과가 없습니다.'));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    return { preview: dataUrl, converted: false };
  }

  try {
    const heicTo = await loadHeicTo();
    const jpegBlob = await heicTo({
      blob: file,
      type: 'image/jpeg',
      quality: 0.85,
    });

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) resolve(event.target.result as string);
        else reject(new Error('FileReader 결과가 없습니다.'));
      };
      reader.onerror = reject;
      reader.readAsDataURL(jpegBlob);
    });
    return { preview: dataUrl, converted: true };
  } catch (err) {
    console.warn('[heic-convert] getImageDataUrl 변환 실패:', err);
    return {
      preview: HEIC_PLACEHOLDER_SVG,
      converted: false,
      error: 'HEIC 이미지 미리보기 변환에 실패했습니다. 저장 시 자동으로 JPEG로 변환됩니다.',
    };
  }
}
