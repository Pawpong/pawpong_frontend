'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Sentry에 에러 전송
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>문제가 발생했습니다!</h2>
          <p style={{ color: '#666', marginTop: '1rem' }}>
            죄송합니다. 예상치 못한 오류가 발생했습니다.
            <br />
            문제가 지속되면 고객센터로 문의해주세요.
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#FF6B6B',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
