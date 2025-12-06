export interface AdoptionSource {
  label: string;
  value: string;
}

export const adoptionCompleteTitle = '새로운 가족을 맞이하신 걸 축하드려요';
export const adoptionCompleteDescription = '입양하신 아이와의 인연은 어디에서 시작되었나요?';

export const adoptionSources: AdoptionSource[] = [
  {
    label: '포퐁에서 입양했어요.',
    value: 'pawpong',
  },
  {
    label: '유기 동물을 입양했어요.',
    value: 'abandoned',
  },
  {
    label: '가정 분양을 받았어요.',
    value: 'home',
  },
  {
    label: '펫숍에서 입양했어요.',
    value: 'petshop',
  },
  {
    label: '기타(직접 입력)',
    value: 'other',
  },
];
