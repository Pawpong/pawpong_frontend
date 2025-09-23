export type Filter = {
  label: string;
  value?: string;
  children?: Filter[];
};

export const adoptableFilters: Filter = {
  label: "입양 상태",
  children: [{ label: "입양 가능", value: "available" }],
};

export const locationFilters: Filter = {
  label: "지역",
  children: [
    {
      label: "서울특별시",
      value: "seoul",
      children: [{ label: "강남구" }, { label: "강동구" }, { label: "강서구" }],
    },
    {
      label: "경기도",
      value: "gyeonggi",
      children: [{ label: "성남시" }, { label: "수원시" }, { label: "용인시" }],
    },
    {
      label: "인천광역시",
      value: "incheon",
      children: [{ label: "남동구" }, { label: "부평구" }, { label: "연수구" }],
    },
    {
      label: "부산광역시",
      value: "busan",
      children: [
        { label: "해운대구" },
        { label: "수영구" },
        { label: "동래구" },
      ],
    },
    {
      label: "대구광역시",
      value: "daegu",
      children: [{ label: "수성구" }, { label: "중구" }, { label: "동구" }],
    },
    {
      label: "광주광역시",
      value: "gwangju",
      children: [
        { label: "광산구" },
        { label: "남구" },
        { label: "북구" },
        { label: "서구" },
        { label: "동구" },
      ],
    },
  ],
};

export const levelFilters: Filter = {
  label: "브리더 레벨",
  children: [
    { label: "엘리트", value: "elite" },
    { label: "뉴", value: "new" },
  ],
};

export const catBreedFilters: Filter = {
  label: "품종",
  children: [
    {
      label: "장모 고양이",
      value: "long_hair_cat",
      children: [
        { label: "아비시니안" },
        { label: "아메리칸 숏헤어" },
        { label: "뱅갈" },
        { label: "브리티쉬 숏헤어 (블루/골드/실버/포인트 등)" },
        { label: "데본 렉스" },
        { label: "유러피언 버미즈" },
        { label: "러시안 블루" },
        { label: "스코티시 폴드" },
        { label: "페르시안" },
        { label: "터키시 앙고라" },
        { label: "메인쿤" },
        { label: "노르웨이 숲" },
      ],
    },
    {
      label: "단모 고양이",
      value: "short_hair_cat",
      children: [
        { label: "아비시니안" },
        { label: "아메리칸 숏헤어" },
        { label: "뱅갈" },
        { label: "브리티쉬 숏헤어 (블루/골드/실버/포인트 등)" },
        { label: "데본 렉스" },
        { label: "유러피언 버미즈" },
        { label: "러시안 블루" },
        { label: "스코티시 폴드" },
        { label: "샴" },
        { label: "싱가푸라" },
        { label: "오리엔탈 쇼트헤어" },
        { label: "코숏" },
        { label: "코리안 숏헤어" },
        { label: "뭉크스" },
        { label: "아메리칸 컬" },
        { label: "벵갈" },
        { label: "샤르트뢰" },
        { label: "시암" },
      ],
    },
  ],
};

export const dogBreedFilters: Filter = {
  label: "품종",
  children: [
    {
      label: "대형견",
      value: "large_dog",
      children: [
        { label: "골든 리트리버" },
        { label: "저먼 셰퍼드" },
        { label: "래브라도 리트리버" },
        { label: "시베리안 허스키" },
      ],
    },
    {
      label: "중형견",
      value: "medium_dog",
      children: [{ label: "웰시코기" }, { label: "비글" }, { label: "불독" }],
    },
    {
      label: "소형견",
      value: "small_dog",
      children: [
        { label: "포메라니안" },
        { label: "치와와" },
        { label: "요크셔테리어" },
      ],
    },
  ],
};

export const filter = {
  cat: [adoptableFilters, locationFilters, levelFilters, catBreedFilters],
  dog: [adoptableFilters, locationFilters, levelFilters, dogBreedFilters],
};
