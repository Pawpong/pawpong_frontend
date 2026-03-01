/**
 * 날짜를 "YYYY년 MM월 DD일 생" 형식으로 포맷
 * @param dateString - Date 객체, ISO 문자열, null, 또는 undefined
 * @returns 포맷된 날짜 문자열 또는 빈 문자열
 */
export function formatBirthDateToKorean(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}년 ${month}월 ${day}일 생`;
  } catch {
    return '';
  }
}

/**
 * 날짜를 "YYYY. MM. DD." 형식으로 포맷
 * @param dateString - Date 객체, ISO 문자열, null, 또는 undefined
 * @returns 포맷된 날짜 문자열 또는 빈 문자열
 */
export function formatDateToDotNotation(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}. ${month}. ${day}.`;
  } catch {
    return '';
  }
}

/**
 * 날짜를 "YYYY-MM-DD" 형식으로 포맷 (ISO 날짜 형식)
 * @param dateString - Date 객체, ISO 문자열, null, 또는 undefined
 * @returns 포맷된 날짜 문자열 또는 빈 문자열
 */
export function formatDateToISO(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

/**
 * 마감일이 지정한 일수 이내인지 (당일 23:59:59 기준, 시간대 영향 최소화)
 * @param deadline - "YYYY.MM.DD." 또는 "YYYY-MM-DD" 형식
 * @param withinDays - 이 일수 이내면 true (기본 7일)
 */
export function isDeadlineUrgent(deadline?: string, withinDays = 7): boolean {
  if (!deadline) return false;
  const trimmed = deadline.replace(/\./g, '-').replace(/-$/g, '').trim();
  const [y, m, d] = trimmed.split('-').map(Number);
  if (!y || !m || !d) return false;
  const deadlineEndOfDay = new Date(y, m - 1, d, 23, 59, 59, 999);
  const now = Date.now();
  const diff = deadlineEndOfDay.getTime() - now;
  return diff >= 0 && diff <= withinDays * 24 * 60 * 60 * 1000;
}
