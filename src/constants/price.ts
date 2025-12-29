/**
 * 가격 표시 타입 열거형
 * 백엔드의 PriceDisplayType enum과 동기화되어야 함
 */
export enum PriceDisplayType {
  NOT_SET = 'not_set', // 가격 미설정 (min: -1, max: -1)
  CONSULTATION = 'consultation', // 상담 후 공개 (min: 0, max: 0)
  RANGE = 'range', // 가격 범위 표시 (min > 0, max > 0)
}

/**
 * 가격 범위 인터페이스
 */
export interface PriceRange {
  min: number;
  max: number;
  display: PriceDisplayType;
}

/**
 * 가격 범위를 사용자에게 보여줄 형식으로 포맷팅
 */
export function formatPriceRange(priceRange?: PriceRange | null): string {
  if (!priceRange) {
    return '가격 정보 없음';
  }

  switch (priceRange.display) {
    case PriceDisplayType.NOT_SET:
      return '가격 미설정';
    case PriceDisplayType.CONSULTATION:
      return '상담 후 공개';
    case PriceDisplayType.RANGE:
      if (priceRange.min > 0 && priceRange.max > 0) {
        const minFormatted = (priceRange.min / 10000).toFixed(0);
        const maxFormatted = (priceRange.max / 10000).toFixed(0);
        return `${minFormatted}만원 ~ ${maxFormatted}만원`;
      }
      return '상담 후 공개';
    default:
      return '가격 정보 없음';
  }
}
