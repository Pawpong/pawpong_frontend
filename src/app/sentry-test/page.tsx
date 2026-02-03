'use client';

import * as Sentry from '@sentry/nextjs';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SentryTestPage() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Sentry 연결 확인
    async function checkConnectivity() {
      const result = await Sentry.diagnoseSdkConnectivity();
      setIsConnected(result !== 'sentry-unreachable');
    }
    checkConnectivity();

    // User Context 설정
    Sentry.setUser({
      id: 'test-user-123',
      username: '테스트유저',
      email: 'test@pawpong.com',
    });

    // 초기 Breadcrumb
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'Sentry 테스트 페이지 접속',
      level: 'info',
    });
  }, []);

  const markTestComplete = (testName: string) => {
    setTestResults((prev) => ({ ...prev, [testName]: true }));
  };

  // 1️⃣ 클라이언트 에러
  const testClientError = () => {
    Sentry.addBreadcrumb({
      category: 'test',
      message: '클라이언트 에러 테스트 시작',
      level: 'info',
    });
    markTestComplete('client-error');
    throw new Error('🧪 클라이언트 에러 테스트: 이 에러는 Sentry에 전송됩니다.');
  };

  // 2️⃣ 비동기 에러
  const testAsyncError = async () => {
    Sentry.addBreadcrumb({
      category: 'test',
      message: '비동기 에러 테스트 시작',
      level: 'info',
    });
    markTestComplete('async-error');
    
    await new Promise((resolve) => setTimeout(resolve, 100));
    throw new Error('🧪 비동기 에러 테스트: Promise 내부에서 발생한 에러입니다.');
  };

  // 3️⃣ Promise Rejection
  const testPromiseRejection = () => {
    Sentry.addBreadcrumb({
      category: 'test',
      message: 'Promise Rejection 테스트 시작',
      level: 'info',
    });
    markTestComplete('promise-rejection');
    
    Promise.reject(new Error('🧪 Promise Rejection 테스트: 처리되지 않은 Promise 거부입니다.'));
  };

  // 4️⃣ 서버 API 에러
  const testServerError = async () => {
    Sentry.addBreadcrumb({
      category: 'test',
      message: '서버 API 에러 테스트 시작',
      level: 'info',
    });
    markTestComplete('server-error');
    
    try {
      const response = await fetch('/api/sentry-example-api');
      if (!response.ok) {
        throw new Error('서버 에러 발생');
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  // 5️⃣ 커스텀 메시지
  const testCustomMessage = () => {
    Sentry.addBreadcrumb({
      category: 'test',
      message: '커스텀 메시지 테스트 시작',
      level: 'info',
    });
    markTestComplete('custom-message');
    
    Sentry.captureMessage('🧪 커스텀 메시지 테스트: 이것은 에러가 아닌 정보 메시지입니다.', 'info');
    alert('✅ 커스텀 메시지가 Sentry에 전송되었습니다!');
  };

  // 6️⃣ Tags와 Context 추가
  const testTagsAndContext = () => {
    Sentry.addBreadcrumb({
      category: 'test',
      message: 'Tags & Context 테스트 시작',
      level: 'info',
    });
    markTestComplete('tags-context');
    
    Sentry.setTag('test-type', 'tags-context-test');
    Sentry.setTag('environment', 'development');
    Sentry.setContext('test-info', {
      feature: 'sentry-test',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
    
    throw new Error('🧪 Tags & Context 테스트: 추가 정보가 포함된 에러입니다.');
  };

  // 7️⃣ Performance 트랜잭션
  const testPerformance = async () => {
    Sentry.addBreadcrumb({
      category: 'test',
      message: 'Performance 테스트 시작',
      level: 'info',
    });
    markTestComplete('performance');
    
    await Sentry.startSpan(
      {
        name: '테스트 작업',
        op: 'test.performance',
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        await Sentry.startSpan(
          {
            name: '중첩 작업',
            op: 'test.nested',
          },
          async () => {
            await new Promise((resolve) => setTimeout(resolve, 200));
          },
        );
      },
    );
    
    alert('✅ Performance 트랜잭션이 Sentry에 전송되었습니다!');
  };

  // 8️⃣ 모든 테스트 실행
  const runAllTests = async () => {
    const tests = [
      { name: 'custom-message', fn: testCustomMessage },
      { name: 'tags-context', fn: testTagsAndContext },
      { name: 'performance', fn: testPerformance },
      { name: 'server-error', fn: testServerError },
    ];

    for (const test of tests) {
      try {
        await test.fn();
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch {
        // 에러는 이미 Sentry에 전송됨
      }
    }

    alert('✅ 모든 테스트가 실행되었습니다! Sentry 대시보드를 확인하세요.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">🧪 Sentry 테스트 페이지</h1>
          <p className="text-lg text-gray-600">
            다양한 Sentry 기능을 테스트하고 에러 모니터링을 확인하세요
          </p>
          
          {/* 연결 상태 */}
          <div className="mt-4">
            {isConnected === null ? (
              <span className="text-gray-500">연결 확인 중...</span>
            ) : isConnected ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                ✅ Sentry 연결됨
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                ❌ Sentry 연결 실패 (Ad-blocker 확인)
              </span>
            )}
          </div>

          {/* Sentry 링크 */}
          <div className="mt-4">
            <Link
              href="https://sentry.io/organizations/pawpong/issues/?project=4510817140342784"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              📊 Sentry 대시보드 열기
            </Link>
          </div>
        </div>

        {/* 테스트 버튼들 */}
        <div className="space-y-4">
          {/* 빠른 테스트 */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">⚡ 빠른 테스트</h2>
            <button
              onClick={runAllTests}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              🚀 모든 테스트 실행
            </button>
          </div>

          {/* 개별 테스트 */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">🔬 개별 테스트</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <TestButton
                name="클라이언트 에러"
                description="동기 에러 발생"
                onClick={testClientError}
                completed={testResults['client-error']}
                variant="error"
              />
              <TestButton
                name="비동기 에러"
                description="Promise 내부 에러"
                onClick={testAsyncError}
                completed={testResults['async-error']}
                variant="error"
              />
              <TestButton
                name="Promise Rejection"
                description="처리되지 않은 Promise"
                onClick={testPromiseRejection}
                completed={testResults['promise-rejection']}
                variant="error"
              />
              <TestButton
                name="서버 API 에러"
                description="API Route 에러"
                onClick={testServerError}
                completed={testResults['server-error']}
                variant="error"
              />
              <TestButton
                name="커스텀 메시지"
                description="정보 메시지 전송"
                onClick={testCustomMessage}
                completed={testResults['custom-message']}
                variant="info"
              />
              <TestButton
                name="Tags & Context"
                description="추가 정보 포함"
                onClick={testTagsAndContext}
                completed={testResults['tags-context']}
                variant="info"
              />
              <TestButton
                name="Performance"
                description="트랜잭션 추적"
                onClick={testPerformance}
                completed={testResults['performance']}
                variant="info"
              />
            </div>
          </div>

          {/* 테스트 결과 */}
          {Object.keys(testResults).length > 0 && (
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">✅ 테스트 완료</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(testResults).map(([test]) => (
                  <span
                    key={test}
                    className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                  >
                    ✓ {test}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 안내 */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h3 className="mb-2 font-semibold text-blue-900">💡 사용 방법</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-blue-800">
            <li>각 버튼을 클릭하면 해당 테스트가 실행됩니다</li>
            <li>에러는 자동으로 Sentry에 전송됩니다</li>
            <li>Sentry 대시보드에서 에러를 확인하세요</li>
            <li>Release, Environment, Sourcemap이 정상 작동하는지 확인하세요</li>
          </ul>
        </div>

        {/* 돌아가기 */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

// 테스트 버튼 컴포넌트
function TestButton({
  name,
  description,
  onClick,
  completed,
  variant,
}: {
  name: string;
  description: string;
  onClick: () => void | Promise<void>;
  completed: boolean;
  variant: 'error' | 'info';
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
        variant === 'error'
          ? 'border-red-200 bg-red-50 hover:border-red-300'
          : 'border-blue-200 bg-blue-50 hover:border-blue-300'
      } ${completed ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="mt-1 text-sm text-gray-600">{description}</div>
        </div>
        {completed && (
          <span className="ml-2 text-green-600">✓</span>
        )}
      </div>
    </button>
  );
}
