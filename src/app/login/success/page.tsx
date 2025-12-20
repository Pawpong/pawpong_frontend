import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface LoginSuccessPageProps {
  searchParams: Promise<{ accessToken?: string; refreshToken?: string }>;
}

/**
 * JWT 토큰 디코딩 함수
 */
function decodeJwtPayload(token: string): { role?: string } {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}

/**
 * 소셜 로그인 성공 후 토큰을 쿠키에 저장하는 페이지
 *
 * 백엔드 OAuth 콜백에서 토큰을 URL 파라미터로 전달받아
 * Next.js cookies() API를 통해 HttpOnly 쿠키에 직접 저장
 *
 * Server Component에서 cookies()를 사용하면:
 * - 서버에서 쿠키를 설정하고 응답 헤더에 Set-Cookie가 포함됨
 * - 브라우저가 해당 쿠키를 저장함
 */
export default async function LoginSuccessPage({ searchParams }: LoginSuccessPageProps) {
  const { accessToken, refreshToken } = await searchParams;

  if (!accessToken || !refreshToken) {
    console.error('토큰이 없습니다. 로그인 페이지로 이동합니다.');
    redirect('/login');
  }

  // JWT에서 role 정보 추출
  const payload = decodeJwtPayload(accessToken);
  const userRole = payload.role || 'adopter';

  const isProduction = process.env.NODE_ENV === 'production';

  // Next.js cookies() API로 직접 쿠키 설정
  const cookieStore = await cookies();

  // 기존 쿠키 삭제 (중복 방지)
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('userRole');

  // 새 쿠키 설정
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1일
  });

  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30일
  });

  cookieStore.set('userRole', userRole, {
    httpOnly: false, // 프론트엔드에서 접근 가능
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1일
  });

  console.log('로그인 성공: 쿠키 설정 완료');

  // 로그인 성공 - 탐색 페이지로 이동
  redirect('/explore');
}
