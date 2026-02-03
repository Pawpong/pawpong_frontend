# 🚀 Next.js + Sentry 에러 모니터링 완벽 가이드

> 실무에서 바로 써먹는 Sentry 설정부터 CI/CD 자동화까지 한 번에!

---

## 📋 목차

1. [Sentry란?](#sentry란)
2. [Next.js에 Sentry 설치하기](#nextjs에-sentry-설치하기)
3. [Sentry 설정하기](#sentry-설정하기)
4. [CI/CD 자동화 설정](#cicd-자동화-설정)
5. [Sentry Release와 Sourcemap 이해하기](#sentry-release와-sourcemap-이해하기)
6. [테스트 페이지 만들기](#테스트-페이지-만들기)
7. [실제 사용 예시](#실제-사용-예시)
8. [트러블슈팅](#트러블슈팅)

---

## Sentry란?

### 🤔 Sentry가 뭔데?

**Sentry**는 프로덕션 환경에서 발생하는 에러를 자동으로 수집하고 알려주는 에러 모니터링 도구입니다.

### 왜 필요한가?

#### ❌ Sentry 없으면

```
사용자: "버튼 클릭했는데 에러났어요!"
개발자: "어디서 에러났는지 모르겠는데요... 😰"
→ 에러 재현 어려움
→ 원인 파악 어려움
→ 해결 시간 오래 걸림
```

#### ✅ Sentry 있으면

```
사용자: 버튼 클릭 → 에러 발생
Sentry: 에러 자동 수집!
개발자: Sentry 대시보드 확인
→ 정확한 파일/라인 번호 확인
→ 원인 즉시 파악
→ 빠른 해결! ✅
```

---

## Next.js에 Sentry 설치하기

### 1️⃣ 패키지 설치

```bash
yarn add @sentry/nextjs
```

### 2️⃣ Sentry Wizard 실행

```bash
npx @sentry/wizard@latest -i nextjs
```

이 명령어가 자동으로 필요한 설정 파일들을 생성해줍니다!

---

## Sentry 설정하기

### 📁 생성된 파일들

```
프로젝트/
├── sentry.server.config.ts    # 서버 사이드 설정
├── sentry.edge.config.ts      # Edge Runtime 설정
└── src/
    └── instrumentation-client.ts  # 클라이언트 설정
```

### ⚙️ 핵심 설정

#### `next.config.ts`

```typescript
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ⭐ Sourcemap 생성 필수!
  productionBrowserSourceMaps: true,
  
  // 나머지 설정...
};

export default withSentryConfig(nextConfig, {
  org: 'pawpong',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
```

**⚠️ 중요**: `productionBrowserSourceMaps: true` 없으면 Sourcemap이 생성되지 않아서 에러 위치를 정확히 알 수 없습니다!

#### `sentry.server.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // ⭐ 환경별 설정
  environment: process.env.NEXT_PUBLIC_ENV || 'development',
  
  // ⭐ Release 버전 (CI/CD에서 자동 설정)
  ...(process.env.SENTRY_RELEASE && { 
    release: process.env.SENTRY_RELEASE 
  }),
  
  tracesSampleRate: 1,
  enableLogs: true,
  sendDefaultPii: true,
});
```

동일한 설정을 `sentry.edge.config.ts`와 `src/instrumentation-client.ts`에도 적용합니다.

---

## CI/CD 자동화 설정

### 🎯 목표

코드 push → 자동 배포 → 자동 Sentry Release 생성

### 📝 GitHub Actions 워크플로우

`.github/workflows/sentry-cicd.yml` 파일 생성:

```yaml
name: 🚀 Vercel Deploy + Sentry

on:
  push:
    branches: [main, dev]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'
      
      - run: yarn install --frozen-lockfile
      
      - run: npm install -g vercel@latest
      
      - name: Deploy
        run: |
          if [ "${{ github.ref_name }}" = "main" ]; then
            # main 브랜치 → Production 배포
            vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
            vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
            vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
            echo "ENV=production" >> $GITHUB_ENV
          else
            # dev 브랜치 → Preview 배포
            vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
            vercel build --token=${{ secrets.VERCEL_TOKEN }}
            vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
            echo "ENV=staging" >> $GITHUB_ENV
          fi
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          NEXT_PUBLIC_SENTRY_DSN: ${{ secrets.NEXT_PUBLIC_SENTRY_DSN }}
      
      - name: Sentry Release
        if: success()
        uses: getsentry/action-release@v1
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: pawpong
          SENTRY_PROJECT: javascript-nextjs
        with:
          environment: ${{ env.ENV }}
          version: ${{ env.ENV }}-${{ github.sha }}
```

### 🔑 필요한 GitHub Secrets

```
GitHub Repository → Settings → Secrets → Actions

필수 5개:
1. VERCEL_TOKEN
2. VERCEL_ORG_ID
3. VERCEL_PROJECT_ID
4. SENTRY_AUTH_TOKEN
5. NEXT_PUBLIC_SENTRY_DSN
```

### 🚀 동작 방식

```
dev 브랜치 push
    ↓
자동 실행:
├─ Vercel Preview 배포
├─ Sourcemap 자동 업로드
└─ Sentry Release 생성: staging-{커밋SHA}

main 브랜치 push
    ↓
자동 실행:
├─ Vercel Production 배포
├─ Sourcemap 자동 업로드
└─ Sentry Release 생성: prod-{커밋SHA}
```

---

## Sentry Release와 Sourcemap 이해하기

### 📦 Sentry Release란?

**Release = 배포 단위**

각 배포마다 고유한 Release를 생성하여, 에러가 발생했을 때 "어느 배포에서 에러가 났는지" 추적할 수 있습니다.

#### 예시

```
Release: prod-a1b2c3d4
├─ 커밋: a1b2c3d4
├─ 환경: production
└─ 배포 시간: 2026-02-02 10:00
```

#### 왜 필요한가?

```
에러 발생!
    ↓
Sentry에서 확인
    ↓
"어느 배포에서 에러가 났지?"
    ↓
Release: prod-a1b2c3d4 확인
    ↓
GitHub에서 해당 커밋 확인
    ↓
원인 코드 찾기 ✅
```

### 🗺️ Sourcemap이란?

**Sourcemap = 원본 코드와 빌드 코드를 연결하는 맵**

#### 문제: 빌드된 코드는 읽기 어렵다

```typescript
// 원본 코드 (개발자가 작성)
function handleClick() {
  console.log('버튼 클릭!');
  throw new Error('에러 발생!');
}

// ↓ 빌드 후 (실제 배포된 코드)
function a(){console.log("버튼 클릭!");throw new Error("에러 발생!")}
```

#### Sourcemap 없으면

```
Sentry에서 에러 확인:
❌ 에러 위치: webpack://_N_E/./node_modules/...
❌ 파일명: chunk-abc123.js
❌ 라인 번호: 의미 없음
→ 원인 찾기 어려움!
```

#### Sourcemap 있으면

```
Sentry에서 에러 확인:
✅ 에러 위치: src/components/Button.tsx
✅ 파일명: Button.tsx
✅ 라인 번호: 42번째 줄
✅ 코드: throw new Error('에러 발생!')
→ 원인 즉시 파악!
```

### 🔄 자동 업로드

#### 수동 업로드 (복잡)

```
1. 빌드 완료
2. Sourcemap 파일 찾기 (.next/**/*.map)
3. Sentry에 수동 업로드
4. Release 생성
→ 실수 가능, 시간 소모
```

#### 자동 업로드 (간단)

```yaml
# CI/CD에서:
vercel build  # 빌드 시 Sourcemap 자동 생성
              # + Sentry에 자동 업로드 ✅
```

---

## 테스트 페이지 만들기

### 🧪 Sentry 테스트 페이지

다양한 Sentry 기능을 테스트할 수 있는 페이지를 만들어봅시다!

`src/app/sentry-test/page.tsx`:

```typescript
'use client';

import * as Sentry from '@sentry/nextjs';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SentryTestPage() {
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
    });
  }, []);

  // 클라이언트 에러 테스트
  const testClientError = () => {
    throw new Error('🧪 클라이언트 에러 테스트');
  };

  // 비동기 에러 테스트
  const testAsyncError = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    throw new Error('🧪 비동기 에러 테스트');
  };

  // 커스텀 메시지 테스트
  const testCustomMessage = () => {
    Sentry.captureMessage('🧪 커스텀 메시지 테스트', 'info');
    alert('✅ 커스텀 메시지가 Sentry에 전송되었습니다!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          🧪 Sentry 테스트 페이지
        </h1>
        
        {/* 연결 상태 */}
        {isConnected ? (
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            ✅ Sentry 연결됨
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
            ❌ Sentry 연결 실패
          </span>
        )}

        {/* Sentry 링크 */}
        <Link
          href="https://sentry.io/organizations/pawpong/issues/"
          target="_blank"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          📊 Sentry 대시보드 열기
        </Link>

        {/* 테스트 버튼들 */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <button
            onClick={testClientError}
            className="rounded-lg border-2 border-red-200 bg-red-50 p-4 text-left hover:border-red-300"
          >
            <div className="font-semibold text-gray-900">클라이언트 에러</div>
            <div className="mt-1 text-sm text-gray-600">동기 에러 발생</div>
          </button>

          <button
            onClick={testAsyncError}
            className="rounded-lg border-2 border-red-200 bg-red-50 p-4 text-left hover:border-red-300"
          >
            <div className="font-semibold text-gray-900">비동기 에러</div>
            <div className="mt-1 text-sm text-gray-600">Promise 내부 에러</div>
          </button>

          <button
            onClick={testCustomMessage}
            className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 text-left hover:border-blue-300"
          >
            <div className="font-semibold text-gray-900">커스텀 메시지</div>
            <div className="mt-1 text-sm text-gray-600">정보 메시지 전송</div>
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 사용 방법

```bash
# 개발 서버 실행
yarn dev

# 브라우저에서 접속
http://localhost:3000/sentry-test

# 각 버튼 클릭하여 테스트
```

---

## 실제 사용 예시

### 시나리오: 프로덕션 에러 발생

#### 1️⃣ 사용자가 에러 경험

```
사용자: 버튼 클릭
    ↓
에러 발생: "Cannot read property 'name' of undefined"
    ↓
Sentry가 자동으로 에러 수집
```

#### 2️⃣ 개발자가 Sentry에서 확인

```
1. Sentry 대시보드 접속
   https://sentry.io/organizations/pawpong/issues/

2. Issues 탭에서 에러 확인
   🔴 Error: Cannot read property 'name' of undefined

3. 에러 클릭 → 상세 정보 확인
```

#### 3️⃣ 에러 상세 정보

```
Release: prod-a1b2c3d4
Environment: production
First Seen: 2026-02-02 10:00

Stack Trace:
  at Button.tsx:42:15
    const name = user.name;  // ← 실제 코드
  at handleClick (Button.tsx:38:10)
  at onClick (index.tsx:15:5)

Breadcrumbs:
  1. 페이지 로드: /home
  2. 버튼 클릭: "제출하기"
  3. API 호출: POST /api/submit
  4. 에러 발생

User Context:
  id: user-123
  username: 홍길동
```

#### 4️⃣ 원인 파악 및 해결

```
1. Release 확인 → prod-a1b2c3d4
2. GitHub에서 해당 커밋 확인
3. 파일/라인 확인 → Button.tsx:42
4. 코드 확인 → user.name 접근 시 user가 undefined
5. 수정 → user?.name 또는 user && user.name
6. 배포 → 문제 해결! ✅
```

---

## Sentry 대시보드에서 확인하는 방법

### 📊 접속 방법

```
https://sentry.io/organizations/pawpong/issues/
```

또는 테스트 페이지에서 "📊 Sentry 대시보드 열기" 링크 클릭

### 🔍 확인할 수 있는 정보

#### 1. 에러 목록

```
Issues 탭
├─ 🔴 Error: Cannot read property 'name' of undefined
├─ 🔴 TypeError: ...
└─ 🔴 ReferenceError: ...
```

#### 2. 에러 상세 정보

에러를 클릭하면:

```
Release: prod-a1b2c3d4        ← 어느 배포인지
Environment: production       ← 어떤 환경인지
File: src/components/Button.tsx  ← 어느 파일인지
Line: 42                      ← 어느 줄인지
Code: const name = user.name; ← 무슨 코드인지
```

#### 3. Breadcrumbs (사용자 행동)

```
1. 페이지 로드: /home
2. 버튼 클릭: "제출하기"
3. API 호출: POST /api/submit
4. 에러 발생
```

#### 4. User Context

```
User:
  id: user-123
  username: 홍길동
  email: hong@example.com
```

---

## 트러블슈팅

### ❗ Sourcemap이 업로드 안 됨

**증상:**
- Sentry에서 `webpack://_N_E/...` 같은 난독화된 경로
- 정확한 파일명/라인 번호 없음

**해결:**
```typescript
// next.config.ts
const nextConfig = {
  productionBrowserSourceMaps: true,  // ⭐ 이거 꼭 추가!
};
```

```yaml
# GitHub Actions
- name: Build
  env:
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}  # ⭐ 환경변수 필수
```

### ❗ Release가 생성 안 됨

**증상:**
- Sentry에서 "No releases found"

**해결:**
```yaml
# GitHub Actions에서 SENTRY_AUTH_TOKEN 확인
- name: Sentry Release
  env:
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}  # ⭐ 필수
```

### ❗ 환경별 에러 구분 안 됨

**해결:**
```typescript
// sentry.*.config.ts
Sentry.init({
  environment: process.env.NEXT_PUBLIC_ENV,  // ⭐ 환경 설정 필수
  release: process.env.SENTRY_RELEASE,       // ⭐ Release 설정 필수
});
```

---

## 핵심 정리

### ✅ 꼭 기억할 것

1. **Sourcemap 필수**
   - `productionBrowserSourceMaps: true` 설정
   - 없으면 에러 위치 특정 불가능

2. **Release는 커밋 SHA 기반**
   - `prod-{커밋SHA}` 형식
   - 에러 → 커밋 즉시 추적 가능

3. **환경별 분리 필수**
   - production / staging 구분
   - 실제 유저 에러와 테스트 에러 분리

4. **CI/CD 자동화**
   - 수동 작업 0%
   - 배포 시 자동으로 Release 생성

---

## 마무리

이제 Next.js 프로젝트에 Sentry를 완벽하게 설정했습니다!

- ✅ 에러 자동 수집
- ✅ 정확한 코드 위치 추적
- ✅ 배포 단위 에러 관리
- ✅ 환경별 에러 분리
- ✅ 커밋 SHA 기반 추적

**Happy Debugging! 🐛**

---

## 참고 자료

- [Sentry Next.js 공식 문서](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [GitHub Actions Sentry Release](https://github.com/marketplace/actions/sentry-release)
- [Vercel CI/CD 가이드](https://vercel.com/docs/deployments/git)

---

**작성일**: 2026-02-02  
**프로젝트**: Pawpong  
**작성자**: Heeyoung
