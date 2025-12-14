export const breederReportTitle = (nickname: string) => `${nickname}님을 신고할까요?`;
export const breederReportDescription = '신고된 내용은 빠르게 검토해서 조치하겠습니다.';

// 백엔드 enum: 'no_contract', 'false_info', 'inappropriate_content', 'poor_conditions', 'fraud', 'other'
export const breederReportReasons = {
  no_contract: '계약서를 작성하지 않거나, 계약 내용을 이행하지 않고 있어요.',
  false_info: '거짓 정보를 기재하고 있어요.',
  poor_conditions: '반려동물 사육 환경이 부적절해요. (위생, 공간 문제 등)',
  inappropriate_content: '부적절한 사진 또는 언행을 목격했어요.',
  fraud: '법규나 포퐁 규정을 위반하고 있어요.',
  other: '기타 부적절한 사유가 있어요.',
};
