export const breederReportTitle = (nickname: string) => `${nickname}님을 신고할까요?`;
export const breederReportDescription = '신고된 내용은 빠르게 검토해서 조치하겠습니다.';

export const breederReportReasons = {
  contract_violation: '계약서를 작성하지 않거나, 계약 내용을 이행하지 않고 있어요.',
  false_information: '거짓 정보를 기재하고 있어요.',
  inadequate_environment: '반려동물 사육 환경이 부적절해요. (위생, 공간 문제 등)',
  inappropriate_behavior: '부적절한 사진 또는 언행을 목격했어요.',
  regulation_violation: '법규나 포퐁 규정을 위반하고 있어요.',
  other: '기타 부적절한 사유가 있어요.',
};
