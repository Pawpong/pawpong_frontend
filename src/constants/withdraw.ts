export interface WithdrawReason {
  label: string;
  value: string;
}

export const withdrawTitle = '그동안 함께 해주셔서 감사해요';
export const withdrawDescription = '탈퇴 이유를 알려주시면, 더 나은 서비스로 보답할게요!';

/**
 * 입양자 탈퇴 사유 (백엔드 AdopterWithdrawReason enum과 동기화)
 */
export const withdrawReasons: WithdrawReason[] = [
  {
    label: '이미 입양을 마쳤어요.',
    value: 'already_adopted', // ALREADY_ADOPTED
  },
  {
    label: '마음에 드는 아이가 없어요.',
    value: 'no_suitable_pet', // NO_SUITABLE_PET
  },
  {
    label: '입양비가 부담돼요.',
    value: 'adoption_fee_burden', // ADOPTION_FEE_BURDEN
  },
  {
    label: '사용하기 불편했어요. (UI/기능 등)',
    value: 'uncomfortable_ui', // UNCOMFORTABLE_UI
  },
  {
    label: '개인정보나 보안이 걱정돼요.',
    value: 'privacy_concern', // PRIVACY_CONCERN
  },
  {
    label: '다른 이유로 탈퇴하고 싶어요.',
    value: 'other', // OTHER
  },
];

/**
 * 브리더 탈퇴 사유 (백엔드 BreederWithdrawReason enum과 동기화)
 */
export const breederWithdrawReasons: WithdrawReason[] = [
  {
    label: '입양 문의가 잘 오지 않았어요.',
    value: 'no_inquiry', // NO_INQUIRY
  },
  {
    label: '운영이 생각보다 번거롭거나 시간이 부족해요.',
    value: 'time_consuming', // TIME_CONSUMING
  },
  {
    label: '브리더 심사나 검증 절차가 어려웠어요.',
    value: 'verification_difficult', // VERIFICATION_DIFFICULT
  },
  {
    label: '수익 구조나 서비스 정책이 잘 맞지 않아요.',
    value: 'policy_mismatch', // POLICY_MISMATCH
  },
  {
    label: '사용하기 불편했어요. (UI/기능 등)',
    value: 'uncomfortable_ui', // UNCOMFORTABLE_UI
  },
  {
    label: '다른 이유로 탈퇴하고 싶어요.',
    value: 'other', // OTHER
  },
];
