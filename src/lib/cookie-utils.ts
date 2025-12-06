/**
 * 쿠키에서 특정 키의 값을 읽어옵니다
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }

  return null;
}

/**
 * 쿠키에서 사용자 역할을 읽어옵니다
 */
export function getUserRoleFromCookie(): 'adopter' | 'breeder' | null {
  const userRole = getCookie('userRole');
  if (userRole === 'adopter' || userRole === 'breeder') {
    return userRole;
  }
  return null;
}
