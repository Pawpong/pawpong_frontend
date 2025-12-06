import { KOREA_DISTRICTS } from './districts';

export type Filter = {
  label: string;
  value?: string;
  children?: Filter[];
};

export const adoptableFilters: Filter = {
  label: '입양 상태',
  children: [{ label: '입양 가능', value: 'available' }],
};

export const locationFilters: Filter = {
  label: '지역',
  children: KOREA_DISTRICTS.map((e) => ({
    label: e.province,
    value: e.province,
    children: e.cities.map((city) => ({
      label: city,
    })),
  })),
};

export const levelFilters: Filter = {
  label: '브리더 레벨',
  children: [
    { label: '엘리트', value: 'elite' },
    { label: '뉴', value: 'new' },
  ],
};

export const catBreedFilters: Filter = {
  label: '품종',
  children: [
    {
      label: '장모',
      value: 'long_hair_cat',
      children: [
        { label: '시베리안' },
        { label: '브리티쉬 롱헤어' },
        { label: '메인쿤' },
        { label: '노르웨이숲' },
        { label: '랙돌' },
        { label: '페르시안' },
        { label: '엑조틱' },
        { label: '소말리' },
      ],
    },
    {
      label: '단모',
      value: 'short_hair_cat',
      children: [
        { label: '아비시니안' },
        { label: '아메리칸 숏헤어' },
        { label: '뱅갈' },
        { label: '브리티쉬 숏헤어' },
        { label: '데본 렉스' },
        { label: '유러피언 버미즈' },
        { label: '러시안 블루' },
        { label: '스코티시 폴드' },
        { label: '싱가푸라' },
        { label: '샴' },
        { label: '스핑크스' },
        { label: '코니시 렉스' },
        { label: '봄베이' },
      ],
    },
  ],
};

export const dogBreedFilters: Filter = {
  label: '품종',
  children: [
    {
      label: '소형견',
      value: 'small_dog',
      children: [
        { label: '비숑프리제' },
        { label: '닥스훈트' },
        { label: '토이·미니어처 푸들' },
        { label: '치와와' },
        { label: '포메라니안' },
        { label: '말티즈' },
        { label: '요크셔테리어' },
        { label: '미니어처 슈나우저' },
        { label: '화이트 테리어(웨스티)' },
        { label: '페키니즈' },
        { label: '알래스칸 클리카이' },
        { label: '시츄' },
        { label: '퍼그' },
        { label: '하바네즈' },
        { label: '아펜핀셔' },
        { label: '기타 소형견' },
      ],
    },
    {
      label: '중형견',
      value: 'medium_dog',
      children: [
        { label: '시베리안 허스키' },
        { label: '보더콜리' },
        { label: '웰시코기' },
        { label: '미디엄·스탠다드 푸들' },
        { label: '셔틀랜드 쉽독(셸티)' },
        { label: '이탈리안 그레이하운드' },
        { label: '코카 스파니엘' },
        { label: '프렌치 불독' },
        { label: '꼬똥 드 툴레아' },
        { label: '베들링턴 테리어' },
        { label: '보스턴 테리어' },
        { label: '시바견' },
        { label: '휘핏' },
        { label: '골든두들' },
      ],
    },
    {
      label: '대형견',
      value: 'large_dog',
      children: [
        { label: '골든 리트리버' },
        { label: '래브라도 리트리버' },
        { label: '알래스칸 말라뮤트' },
        { label: '진돗개' },
        { label: '풍산개' },
        { label: '차우차우' },
        { label: '도베르만' },
        { label: '사모예드' },
        { label: '러프 콜리' },
        { label: '말라뮤트' },
        { label: '셰퍼드' },
        { label: '아메리칸 불리' },
        { label: '아프간하운드' },
      ],
    },
  ],
};

export const filter = {
  cat: [adoptableFilters, catBreedFilters, locationFilters, levelFilters],
  dog: [adoptableFilters, dogBreedFilters, locationFilters, levelFilters],
};
