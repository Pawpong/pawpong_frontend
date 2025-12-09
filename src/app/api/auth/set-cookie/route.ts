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

  // HttpOnly 쿠키에 토큰 저장 (보안)
  res.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1일
  });

  res.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30일
  });

  // 사용자 역할(role)을 별도 쿠키로 저장 (프론트엔드에서 접근 가능)
  res.cookies.set('userRole', userRole, {
    httpOnly: false, // 프론트엔드에서 접근 가능하도록 설정
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1일
  });

  return res;
}
