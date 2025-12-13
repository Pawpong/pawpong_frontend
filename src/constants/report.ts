export interface ReportReason {
  label: string;
  value: string;
}

export const reportDescription = '신고된 내용은 빠르게 검토해서 조치하겠습니다.';

export const reportTitle = '후기를 신고할까요?';
export const reportReasons: ReportReason[] = [
  {
    label: '허위 사실이나 과장된 내용을 포함하고 있어요.',
    value: 'false_information',
  },
  {
    label: '욕설이나 비방 등 부적절한 언행이 포함되어 있어요.',
    value: 'inappropriate_language',
  },
  { label: '불법적이거나 광고성 내용이에요.', value: 'illegal_or_advertising' },
  {
    label: '타인의 저작권을 침해하고 있어요. (사진/글 무단 사용 등)',
    value: 'copyright_violation',
  },
  { label: '기타 부적절한 사유가 있어요.', value: 'other' },
];
