import * as Sentry from '@sentry/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 다양한 에러 타입을 테스트할 수 있는 API 엔드포인트
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const testType = searchParams.get('type') || 'default';

  try {
    switch (testType) {
      case 'error':
        // 일반 에러
        throw new Error('API 라우트에서 발생한 일반 에러입니다');

      case 'custom':
        // 커스텀 에러 클래스
        class CustomAPIError extends Error {
          constructor(message: string) {
            super(message);
            this.name = 'CustomAPIError';
          }
        }
        throw new CustomAPIError('커스텀 에러 클래스로 발생한 에러입니다');

      case 'context':
        // 컨텍스트와 함께 에러
        Sentry.withScope((scope) => {
          scope.setTag('api-test', 'context-error');
          scope.setContext('api-context', {
            endpoint: '/api/sentry-test',
            method: 'GET',
            testType: 'context',
            timestamp: new Date().toISOString(),
          });
          throw new Error('컨텍스트가 포함된 API 에러입니다');
        });
        break;

      case 'user':
        // 사용자 정보와 함께 에러
        Sentry.setUser({
          id: 'api-test-user',
          email: 'api-test@example.com',
        });
        throw new Error('사용자 정보가 포함된 API 에러입니다');

      case 'breadcrumb':
        // Breadcrumb 추가 후 에러
        Sentry.addBreadcrumb({
          category: 'api',
          message: 'Sentry 테스트 API 호출됨',
          level: 'info',
        });
        Sentry.addBreadcrumb({
          category: 'api',
          message: '에러 발생 직전 단계',
          level: 'warning',
        });
        throw new Error('Breadcrumb가 포함된 API 에러입니다');

      case 'performance':
        // 성능 모니터링
        await Sentry.startSpan(
          {
            name: 'Sentry Test API Transaction',
            op: 'api.test',
          },
          async (span) => {
            await Sentry.startSpan(
              {
                op: 'db.query',
                name: '테스트 데이터베이스 쿼리',
              },
              async () => {
                // 시뮬레이션된 작업
                await new Promise((resolve) => setTimeout(resolve, 300));
              }
            );
          }
        );

        return NextResponse.json({
          success: true,
          message: '성능 트랜잭션이 기록되었습니다',
          testType: 'performance',
        });

      case 'message':
        // 커스텀 메시지
        Sentry.captureMessage('API에서 전송된 커스텀 메시지', 'info');
        return NextResponse.json({
          success: true,
          message: '커스텀 메시지가 Sentry에 전송되었습니다',
          testType: 'message',
        });

      default:
        return NextResponse.json({
          success: true,
          message: 'Sentry 테스트 API가 정상적으로 작동합니다',
          availableTypes: [
            'error',
            'custom',
            'context',
            'user',
            'breadcrumb',
            'performance',
            'message',
          ],
          usage: '?type=error 형식으로 테스트 타입을 지정하세요',
        });
    }
  } catch (error) {
    // 에러를 Sentry에 전송
    Sentry.captureException(error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 에러',
        testType,
      },
      { status: 500 }
    );
  }
}

// POST 요청으로도 테스트 가능
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType, customData } = body;

    Sentry.addBreadcrumb({
      category: 'api',
      message: 'POST 요청으로 Sentry 테스트',
      level: 'info',
      data: { testType, customData },
    });

    if (testType === 'error') {
      throw new Error('POST 요청에서 발생한 에러입니다');
    }

    Sentry.captureMessage('POST 요청이 성공적으로 처리되었습니다', 'info');

    return NextResponse.json({
      success: true,
      message: 'POST 요청이 처리되었습니다',
      receivedData: { testType, customData },
    });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 에러',
      },
      { status: 500 }
    );
  }
}
