import { NextResponse } from 'next/server';

/**
 * JWT 토큰 디코딩 함수
 * Base64 URL 디코딩을 사용하여 JWT의 payload를 파싱합니다
 */
function decodeJwtPayload(token: string): {
  sub?: string;
  email?: string;
  role?: string;
} {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Base64 URL 디코딩
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return {};
  }
}

export async function POST(req: Request) {
  const { accessToken, refreshToken } = await req.json();

  // JWT 토큰에서 role 정보 추출
  const payload = decodeJwtPayload(accessToken);
  const userRole = payload.role || 'adopter'; // 기본값은 입양자

  const res = NextResponse.json({ ok: true });

  // 기존 쿠키 먼저 삭제 (중복 방지 - 입양자/브리더 계정 전환 시)
  res.cookies.delete('accessToken');
  res.cookies.delete('refreshToken');
  res.cookies.delete('userRole');

  // localhost에서는 Secure 쿠키 사용 불가 (HTTP이므로)
  // HTTPS 환경에서만 Secure 플래그 설정
  const isSecure =
    process.env.NODE_ENV === 'production' && (process.env.NEXT_PUBLIC_FRONTEND_URL?.startsWith('https://') ?? false);

  // accessToken은 httpOnly: false로 설정 (cross-origin 요청 시 Authorization 헤더로 전송 필요)
  // localhost에서 api.pawpong.kr로 요청 시 쿠키가 자동 전송되지 않으므로
  // JavaScript에서 읽어서 Authorization 헤더로 보내야 함
  res.cookies.set('accessToken', accessToken, {
    httpOnly: false, // cross-origin API 요청을 위해 JavaScript에서 접근 가능하게 설정
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1일
  });

  res.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30일
  });

  // 사용자 역할(role)을 별도 쿠키로 저장 (프론트엔드에서 접근 가능)
  res.cookies.set('userRole', userRole, {
    httpOnly: false, // 프론트엔드에서 접근 가능하도록 설정
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1일
  });

  return res;
}
