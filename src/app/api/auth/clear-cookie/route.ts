import { NextResponse } from 'next/server';

/**
 * 로그아웃 시 모든 인증 쿠키 삭제
 *
 * POST /api/auth/clear-cookie
 *
 * 역할:
 * - 로그아웃 시 accessToken, refreshToken, userRole 쿠키 완전 삭제
 * - 중복 토큰 버그 방지를 위한 완전한 쿠키 정리
 *
 * 주요 기능:
 * - HttpOnly 쿠키 삭제 (accessToken, refreshToken)
 * - 일반 쿠키 삭제 (userRole)
 * - 에러 발생 시에도 쿠키 삭제 보장
 */
export async function POST() {
  try {
    const res = NextResponse.json({ ok: true, message: '쿠키가 삭제되었습니다.' });

    // 모든 인증 관련 쿠키 삭제
    res.cookies.delete('accessToken');
    res.cookies.delete('refreshToken');
    res.cookies.delete('userRole');

    return res;
  } catch (error) {
    console.error('쿠키 삭제 실패:', error);

    // 에러가 발생해도 쿠키는 삭제 시도
    const res = NextResponse.json(
      { ok: false, message: '쿠키 삭제 중 오류가 발생했습니다.' },
      { status: 500 },
    );

    res.cookies.delete('accessToken');
    res.cookies.delete('refreshToken');
    res.cookies.delete('userRole');

    return res;
  }
}
