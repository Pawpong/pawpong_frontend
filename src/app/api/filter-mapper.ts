import { SearchBreederParams } from './breeder';

/**
 * 필터 레이블을 백엔드 API 파라미터로 변환하는 매퍼
 */

// 브리더 레벨 매핑
const BREEDER_LEVEL_MAP: Record<string, 'elite' | 'new'> = {
  엘리트: 'elite',
  뉴: 'new',
};

// 강아지 크기 매핑
const DOG_SIZE_MAP: Record<string, 'small' | 'medium' | 'large'> = {
  소형견: 'small',
  중형견: 'medium',
  대형견: 'large',
};

// 고양이 털 길이 매핑
const CAT_FUR_LENGTH_MAP: Record<string, 'short' | 'long'> = {
  단모: 'short',
  장모: 'long',
};

// 한국의 시/도 목록 (지역 필터 식별용)
const KOREA_PROVINCES = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원도',
  '충청북도',
  '충청남도',
  '전라북도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
];

/**
 * 활성화된 필터를 백엔드 API 파라미터로 변환
 * @param activeFilters - 활성화된 필터 레이블 배열 (예: ["엘리트", "입양 가능", "경기도 수원시"])
 * @param petType - 동물 타입 ("cat" | "dog")
 * @returns SearchBreederParams - 백엔드 API 파라미터
 */
export function mapFiltersToParams(activeFilters: string[], petType: 'cat' | 'dog'): Partial<SearchBreederParams> {
  const params: Partial<SearchBreederParams> = {};

  // 브리더 레벨 필터
  const breederLevels = activeFilters
    .filter((filter) => filter in BREEDER_LEVEL_MAP)
    .map((filter) => BREEDER_LEVEL_MAP[filter]);

  if (breederLevels.length > 0) {
    params.breederLevel = breederLevels;
  }

  // 입양 가능 여부 필터
  if (activeFilters.includes('입양 가능')) {
    params.isAdoptionAvailable = true;
  }

  // 강아지 크기 필터 (petType이 dog인 경우만)
  if (petType === 'dog') {
    const dogSizes = activeFilters.filter((filter) => filter in DOG_SIZE_MAP).map((filter) => DOG_SIZE_MAP[filter]);

    if (dogSizes.length > 0) {
      params.dogSize = dogSizes;
    }
  }

  // 고양이 털 길이 필터 (petType이 cat인 경우만)
  if (petType === 'cat') {
    const catFurLengths = activeFilters
      .filter((filter) => filter in CAT_FUR_LENGTH_MAP)
      .map((filter) => CAT_FUR_LENGTH_MAP[filter]);

    if (catFurLengths.length > 0) {
      params.catFurLength = catFurLengths;
    }
  }

  // 알려진 필터들 (품종이나 지역 필터가 아닌 것들)
  const knownFilters = new Set([
    ...Object.keys(BREEDER_LEVEL_MAP),
    ...Object.keys(DOG_SIZE_MAP),
    ...Object.keys(CAT_FUR_LENGTH_MAP),
    '입양 가능',
    ...KOREA_PROVINCES, // 시/도도 알려진 필터로 추가
  ]);

  // 지역 필터 처리
  const provinces: string[] = [];
  const cities: string[] = [];

  activeFilters.forEach((filter) => {
    // 시/도 단독 선택 (예: "부산광역시")
    if (KOREA_PROVINCES.includes(filter)) {
      if (!provinces.includes(filter)) {
        provinces.push(filter);
      }
    }
    // 시/도 + 시/군/구 조합 (예: "부산광역시 해운대구")
    // 반드시 KOREA_PROVINCES로 시작해야 지역으로 인식
    else if (filter.includes(' ')) {
      const hasProvincePrefix = KOREA_PROVINCES.some((province) => filter.startsWith(province + ' '));
      if (hasProvincePrefix) {
        const parts = filter.split(' ');
        if (parts.length === 2) {
          const [province, city] = parts;
          if (!provinces.includes(province)) {
            provinces.push(province);
          }
          if (!cities.includes(city)) {
            cities.push(city);
          }
        }
      }
    }
  });

  if (provinces.length > 0) {
    params.province = provinces;
  }
  if (cities.length > 0) {
    params.city = cities;
  }

  // 품종 필터 (브리더 레벨, 크기, 털 길이, 입양 가능, 지역이 아닌 나머지)
  const breeds = activeFilters.filter((filter) => {
    // 알려진 필터가 아니고
    if (knownFilters.has(filter)) return false;
    // 지역 필터가 아니면 품종으로 간주
    const isProvince = KOREA_PROVINCES.includes(filter);
    const isProvinceCity = KOREA_PROVINCES.some((province) => filter.startsWith(province + ' '));
    if (isProvince || isProvinceCity) return false;
    // 나머지는 모두 품종으로 간주 (공백 포함 품종도 허용)
    return true;
  });

  if (breeds.length > 0) {
    params.breeds = breeds;
  }

  return params;
}
