import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

class SentryExampleAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SentryExampleAPIError';
  }
}

// A faulty API route to test Sentry's error monitoring
export function GET() {
  try {
    Sentry.logger.info('Sentry example API called');
    throw new SentryExampleAPIError(
      'This error is raised on the backend called by the example page.'
    );
  } catch (error) {
    // 에러를 Sentry에 명시적으로 전송
    Sentry.captureException(error);
    
    return NextResponse.json(
      {
        error: 'Sentry 테스트 에러가 발생했습니다',
        message: error instanceof Error ? error.message : '알 수 없는 에러',
      },
      { status: 500 }
    );
  }
}
