export interface WithdrawReason {
  label: string;
  value: string;
}

export const withdrawTitle = '그동안 함께 해주셔서 감사해요';
export const withdrawDescription = '탈퇴 이유를 알려주시면, 더 나은 서비스로 보답할게요!';

export const withdrawReasons: WithdrawReason[] = [
  {
    label: '이미 입양을 마쳤어요.',
    value: 'already_adopted',
  },
  {
    label: '마음에 드는 아이가 없어요.',
    value: 'no_suitable_pet',
  },
  {
    label: '입양비가 부담돼요.',
    value: 'adoption_fee_burden',
  },
  {
    label: '사용하기 불편했어요. (UI/기능 등)',
    value: 'uncomfortable_ui',
  },
  {
    label: '개인정보나 보안이 걱정돼요.',
    value: 'privacy_concern',
  },
  {
    label: '다른 이유로 탈퇴하고 싶어요.',
    value: 'other',
  },
];

export const breederWithdrawReasons: WithdrawReason[] = [
  {
    label: '입양 문의가 잘 오지 않았어요.',
    value: 'no_inquiry',
  },
  {
    label: '운영이 생각보다 번거롭거나 시간이 부족해요.',
    value: 'time_consuming',
  },
  {
    label: '브리더 심사나 검증 절차가 어려웠어요.',
    value: 'verification_difficult',
  },
  {
    label: '수익 구조나 서비스 정책이 잘 맞지 않아요.',
    value: 'policy_mismatch',
  },
  {
    label: '사용하기 불편했어요. (UI/기능 등)',
    value: 'uncomfortable_ui',
  },
  {
    label: '다른 이유로 탈퇴하고 싶어요.',
    value: 'other',
  },
];
