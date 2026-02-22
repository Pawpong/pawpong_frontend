/**
 * 신청 상태 배지용 아이콘 컴포넌트
 */

export function ConsultationPendingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <rect x="3" y="7" width="2" height="2" fill="#4F3B2E" />
      <rect x="7" y="7" width="2" height="2" fill="#4F3B2E" />
      <rect x="11" y="7" width="2" height="2" fill="#4F3B2E" />
    </svg>
  );
}

export function ConsultationCompletedIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path d="M4 8L6.5 10.5L12 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AdoptionApprovedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M4 8L6.5 10.5L12 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AdoptionRejectedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M5 5L11 11M11 5L5 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
