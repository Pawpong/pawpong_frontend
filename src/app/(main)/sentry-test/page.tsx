'use client';

import * as Sentry from '@sentry/nextjs';
import { useState } from 'react';

export default function SentryTestPage() {
  const [testResult, setTestResult] = useState<string>('');

  // 1. 클라이언트 사이드 에러 테스트
  const testClientError = () => {
    try {
      setTestResult('클라이언트 에러 테스트 중...');
      throw new Error('클라이언트 사이드 테스트 에러입니다');
    } catch (error) {
      Sentry.captureException(error);
      setTestResult('✅ 클라이언트 에러가 Sentry에 전송되었습니다');
    }
  };

  // 2. API 에러 테스트
  const testAPIError = async () => {
    try {
      setTestResult('API 에러 테스트 중...');
      const response = await fetch('/api/sentry-example-api');
      if (!response.ok) {
        throw new Error(`API 에러: ${response.status}`);
      }
    } catch (error) {
      Sentry.captureException(error);
      setTestResult('✅ API 에러가 Sentry에 전송되었습니다');
    }
  };

  // 3. 커스텀 메시지 전송
  const testCustomMessage = () => {
    setTestResult('커스텀 메시지 전송 중...');
    Sentry.captureMessage('Sentry 테스트: 커스텀 메시지', 'info');
    setTestResult('✅ 커스텀 메시지가 Sentry에 전송되었습니다');
  };

  // 4. 타입 에러 테스트
  const testTypeError = () => {
    try {
      setTestResult('타입 에러 테스트 중...');
      // @ts-expect-error - 의도적인 타입 에러
      const result = null.someProperty;
      return result;
    } catch (error) {
      Sentry.captureException(error);
      setTestResult('✅ 타입 에러가 Sentry에 전송되었습니다');
    }
  };

  // 5. 비동기 에러 테스트
  const testAsyncError = async () => {
    try {
      setTestResult('비동기 에러 테스트 중...');
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('비동기 에러 발생'));
        }, 100);
      });
    } catch (error) {
      Sentry.captureException(error);
      setTestResult('✅ 비동기 에러가 Sentry에 전송되었습니다');
    }
  };

  // 6. 컨텍스트와 함께 에러 전송
  const testErrorWithContext = () => {
    try {
      setTestResult('컨텍스트 포함 에러 테스트 중...');
      Sentry.withScope((scope) => {
        scope.setTag('test-type', 'context-error');
        scope.setContext('test-context', {
          userId: 'test-user-123',
          action: 'sentry-test',
          timestamp: new Date().toISOString(),
        });
        scope.setLevel('error');
        throw new Error('컨텍스트가 포함된 에러입니다');
      });
    } catch (error) {
      Sentry.captureException(error);
      setTestResult('✅ 컨텍스트 포함 에러가 Sentry에 전송되었습니다');
    }
  };

  // 7. 사용자 정보와 함께 에러 전송
  const testErrorWithUser = () => {
    try {
      setTestResult('사용자 정보 포함 에러 테스트 중...');
      Sentry.setUser({
        id: 'test-user-123',
        email: 'test@example.com',
        username: 'testuser',
      });
      throw new Error('사용자 정보가 포함된 에러입니다');
    } catch (error) {
      Sentry.captureException(error);
      setTestResult('✅ 사용자 정보 포함 에러가 Sentry에 전송되었습니다');
    }
  };

  // 8. 성능 모니터링 테스트
  const testPerformance = async () => {
    setTestResult('성능 모니터링 테스트 중...');
    
    await Sentry.startSpan(
      {
        name: 'Sentry Test Transaction',
        op: 'test',
      },
      async (span) => {
        await Sentry.startSpan(
          {
            op: 'test-operation',
            name: '테스트 작업',
          },
          async () => {
            // 시뮬레이션된 작업
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        );
      }
    );

    setTestResult('✅ 성능 트랜잭션이 Sentry에 전송되었습니다');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sentry 테스트 페이지</h1>
        <p className="text-gray-600 mb-8">
          아래 버튼들을 클릭하여 다양한 Sentry 기능을 테스트할 수 있습니다.
        </p>

        {testResult && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{testResult}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={testClientError}
            className="p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            1. 클라이언트 에러 테스트
          </button>

          <button
            onClick={testAPIError}
            className="p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            2. API 에러 테스트
          </button>

          <button
            onClick={testCustomMessage}
            className="p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            3. 커스텀 메시지 전송
          </button>

          <button
            onClick={testTypeError}
            className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            4. 타입 에러 테스트
          </button>

          <button
            onClick={testAsyncError}
            className="p-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            5. 비동기 에러 테스트
          </button>

          <button
            onClick={testErrorWithContext}
            className="p-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            6. 컨텍스트 포함 에러
          </button>

          <button
            onClick={testErrorWithUser}
            className="p-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            7. 사용자 정보 포함 에러
          </button>

          <button
            onClick={testPerformance}
            className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            8. 성능 모니터링 테스트
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">테스트 후 확인사항</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Sentry 대시보드에서 에러가 정상적으로 수집되었는지 확인하세요</li>
            <li>에러에 포함된 컨텍스트 정보를 확인하세요</li>
            <li>성능 트랜잭션이 기록되었는지 확인하세요</li>
            <li>사용자 정보가 올바르게 전송되었는지 확인하세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
