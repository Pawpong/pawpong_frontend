import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * 토큰 리프레시 API 라우트
 *
 * cross-origin 요청에서는 httpOnly 쿠키가 전송되지 않으므로,
 * 프론트엔드 API 라우트에서 쿠키를 읽어 백엔드로 전달합니다.
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'refreshToken이 없습니다.' },
        { status: 401 },
      );
    }

    // 백엔드 API로 리프레시 요청
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev-api.pawpong.kr';
    const response = await fetch(`${backendUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { success: false, message: data.message || '토큰 갱신에 실패했습니다.' },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('토큰 리프레시 오류:', error);
    return NextResponse.json(
      { success: false, message: '토큰 갱신 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
