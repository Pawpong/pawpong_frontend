# 📂 Next.js 15 프로젝트 파일 구조 완벽 가이드

> 실무에서 사용하는 Feature-Based 아키텍처 분석

---

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [전체 파일 구조](#전체-파일-구조)
3. [App Router 구조](#app-router-구조)
4. [Feature-Based 구조](#feature-based-구조)
5. [디자인 패턴](#디자인-패턴)
6. [아키텍처 다이어그램](#아키텍처-다이어그램)
7. [파일 구조의 장점](#파일-구조의-장점)
8. [모범 사례](#모범-사례)

---

## 프로젝트 개요

### 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **API**: React Query
- **Error Monitoring**: Sentry
- **Deployment**: Vercel

### 프로젝트 규모

```
총 파일 수: ~450개
├── 컴포넌트 (TSX): ~300개
├── 로직 (TS): ~100개
├── API Routes: 27개
├── Stores: 6개
└── Custom Hooks: 11개
```

---

## 전체 파일 구조

```
pawpong_frontend/
├── 📁 .github/workflows/        # CI/CD 자동화
│   ├── deploy.yml               # 문서 빌드
│   └── sentry-cicd.yml          # Vercel + Sentry
│
├── 📁 public/                   # 정적 파일
│   ├── images/                  # 이미지
│   └── *.svg, *.png             # 아이콘, 로고
│
├── 📁 src/                      # 소스 코드
│   ├── 📁 app/                  # Next.js App Router
│   ├── 📁 assets/               # 폰트, 아이콘, 이미지
│   ├── 📁 components/           # 공용 컴포넌트
│   ├── 📁 constants/            # 상수
│   ├── 📁 contexts/             # React Context
│   ├── 📁 hooks/                # Custom Hooks
│   ├── 📁 providers/            # Provider 컴포넌트
│   ├── 📁 stores/               # Zustand 전역 상태
│   ├── 📁 types/                # TypeScript 타입
│   └── 📁 utils/                # 유틸리티 함수
│
├── sentry.server.config.ts      # Sentry 서버 설정
├── sentry.edge.config.ts        # Sentry Edge 설정
├── next.config.ts               # Next.js 설정
├── tsconfig.json                # TypeScript 설정
└── package.json                 # 패키지 설정
```

---

## App Router 구조

### 라우트 구조

```
src/app/
├── 📁 (main)/                   # Route Group (메인 레이아웃)
│   ├── page.tsx                 # 홈페이지 (/)
│   ├── layout.tsx               # 공통 레이아웃
│   ├── error.tsx                # 에러 페이지
│   │
│   ├── explore/                 # 탐색 (/explore)
│   ├── counselform/             # 상담 신청 (/counselform)
│   ├── application/             # 신청 내역 (/application)
│   ├── profile/                 # 프로필 (/profile)
│   ├── saved/                   # 저장 목록 (/saved)
│   ├── settings/                # 설정 (/settings)
│   └── ...
│
├── 📁 login/                    # 로그인 (별도 레이아웃)
│   ├── page.tsx
│   └── layout.tsx
│
├── 📁 signup/                   # 회원가입 (별도 레이아웃)
│   ├── page.tsx
│   └── layout.tsx
│
└── 📁 api/                      # API Routes
    ├── auth.ts
    ├── breeder.ts
    ├── application.ts
    └── ...
```

### Route Groups란?

`(main)`처럼 괄호로 감싼 폴더는 **Route Group**입니다.

#### 특징

- URL에 포함되지 않음
  - `/main/explore` ❌
  - `/explore` ✅
- 공통 레이아웃 공유
- 논리적 그룹화

#### 왜 사용하나?

```typescript
// app/(main)/layout.tsx
export default function MainLayout({ children }) {
  return (
    <>
      <GNB />           {/* 모든 메인 페이지에 GNB */}
      {children}
      <Footer />        {/* 모든 메인 페이지에 Footer */}
    </>
  );
}

// app/login/layout.tsx
export default function LoginLayout({ children }) {
  return (
    <div className="min-h-screen">
      {children}        {/* GNB/Footer 없음 */}
    </div>
  );
}
```

---

## Feature-Based 구조

### 개념

각 페이지/기능별로 **독립적인 폴더 구조**를 가집니다.

### 구조

```
explore/
├── _components/          # 해당 기능 전용 컴포넌트
│   ├── filter-section.tsx
│   ├── breeder-grid.tsx
│   └── animal-card.tsx
│
├── _hooks/               # 해당 기능 전용 Hook
│   ├── use-breeders.ts
│   ├── use-filters.ts
│   └── use-animals.ts
│
├── _types/               # 해당 기능 전용 타입
│   └── breeder.types.ts
│
├── _utils/               # 해당 기능 전용 유틸
│   └── filter-helpers.ts
│
├── breeder/              # 하위 라우트
│   └── [id]/
│       └── page.tsx
│
└── page.tsx              # 페이지 컴포넌트
```

### `_` 프리픽스의 의미

#### Next.js 규칙

- `_`로 시작하는 폴더는 **라우팅되지 않음**
- 내부 구현 세부사항 표시
- "이 폴더는 라우트가 아님"을 명확히 함

#### 예시

```
explore/
├── _components/      → URL 생성 ❌
├── _hooks/           → URL 생성 ❌
├── breeder/          → URL 생성 ✅ (/explore/breeder)
└── page.tsx          → URL 생성 ✅ (/explore)
```

### 실제 예시: Counselform

```
counselform/
├── _components/
│   ├── counsel-form-content.tsx      # 메인 폼 컴포넌트
│   ├── form-layout.tsx               # 폼 레이아웃
│   │
│   ├── sections/                     # 섹션 컴포넌트
│   │   ├── personal-info-section.tsx
│   │   ├── address-section.tsx
│   │   ├── family-section.tsx
│   │   └── ...
│   │
│   └── shared/                       # 섹션 간 공유
│       ├── section-header.tsx
│       ├── input-field.tsx
│       └── ...
│
├── _hooks/
│   ├── use-counsel-form.ts
│   ├── use-form-navigation.ts
│   ├── use-form-validation.ts
│   └── ...
│
├── _types/
│   └── counsel-form.types.ts
│
├── _utils/
│   ├── validation.ts
│   ├── formatter.ts
│   └── ...
│
├── layout.tsx                        # 상담 신청 레이아웃
├── page.tsx                          # 상담 신청 페이지
└── sections.ts                       # 섹션 설정
```

---

## 계층화된 컴포넌트 구조

### 전역 vs 지역

```
src/
├── components/                       # 전역 공용 컴포넌트
│   ├── ui/                           # shadcn/ui 기본
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   ├── gnb/                          # GNB
│   │   ├── gnb.tsx
│   │   ├── gnb-auth.tsx
│   │   └── ...
│   │
│   ├── footer/                       # Footer
│   │   ├── footer.tsx
│   │   └── ...
│   │
│   ├── breeder-list/                 # 도메인 컴포넌트
│   │   ├── breeder-list.tsx
│   │   ├── breeder-card.tsx
│   │   └── ...
│   │
│   └── ...
│
└── app/(main)/xxx/_components/       # 페이지 전용 컴포넌트
```

### 분리 기준

#### 전역 컴포넌트 (`components/`)

- 여러 페이지에서 재사용
- 범용적인 UI 컴포넌트
- 도메인 특화 공용 컴포넌트

#### 페이지 전용 컴포넌트 (`_components/`)

- 특정 페이지에서만 사용
- 해당 기능에 강하게 결합
- 외부로 노출할 필요 없음

---

## 디자인 패턴

### 1. Container/Presentational 패턴

로직과 UI를 분리합니다.

#### Container (로직)

```typescript
// explore/_components/breeder-list-container.tsx
function BreederListContainer() {
  // 로직: 데이터 fetching, 상태 관리
  const { data, isLoading } = useBreederList();
  const { filters } = useFilterStore();
  const filteredData = useMemo(() => 
    applyFilters(data, filters), 
    [data, filters]
  );
  
  // UI 컴포넌트에 props 전달
  return (
    <BreederList 
      data={filteredData} 
      isLoading={isLoading} 
    />
  );
}
```

#### Presentational (UI)

```typescript
// explore/_components/breeder-list.tsx
interface BreederListProps {
  data: Breeder[];
  isLoading: boolean;
}

function BreederList({ data, isLoading }: BreederListProps) {
  // UI만 담당
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="grid gap-4">
      {data.map(breeder => (
        <BreederCard key={breeder.id} {...breeder} />
      ))}
    </div>
  );
}
```

#### 장점

- ✅ 로직과 UI 분리
- ✅ 재사용성 향상
- ✅ 테스트 용이
- ✅ 유지보수 편리

---

### 2. Custom Hooks 패턴

로직을 재사용 가능한 Hook으로 추출합니다.

```typescript
// hooks/use-breeder-list.ts
export function useBreederList() {
  const [data, setData] = useState<Breeder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const result = await fetchBreeders();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  return { data, isLoading, error };
}
```

#### 사용

```typescript
function BreederPage() {
  const { data, isLoading, error } = useBreederList();
  
  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;
  
  return <BreederList data={data} />;
}
```

#### 장점

- ✅ 로직 재사용
- ✅ 컴포넌트 간소화
- ✅ 테스트 분리
- ✅ 관심사 분리

---

### 3. Compound Components 패턴

관련 컴포넌트를 함께 사용합니다.

```typescript
// components/ui/dialog.tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>열기</Button>
  </DialogTrigger>
  
  <DialogContent>
    <DialogHeader>
      <DialogTitle>제목</DialogTitle>
      <DialogDescription>설명</DialogDescription>
    </DialogHeader>
    
    <DialogFooter>
      <Button>확인</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### 장점

- ✅ 유연한 구성
- ✅ 명확한 API
- ✅ 재사용성
- ✅ 타입 안전

---

### 4. Provider 패턴

전역 설정을 계층적으로 관리합니다.

```typescript
// providers/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

#### 사용

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

#### 장점

- ✅ 전역 설정 관리
- ✅ 계층적 구조
- ✅ 의존성 주입
- ✅ 테스트 용이

---

### 5. Store 패턴 (Zustand)

간단하고 효율적인 전역 상태 관리입니다.

```typescript
// stores/auth-store.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: true 
  }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),
}));
```

#### 사용

```typescript
function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  
  return (
    <header>
      {isAuthenticated ? (
        <>
          <span>{user?.name}</span>
          <button onClick={logout}>로그아웃</button>
        </>
      ) : (
        <Link href="/login">로그인</Link>
      )}
    </header>
  );
}
```

#### 장점

- ✅ 간단한 API
- ✅ Context API보다 성능 우수
- ✅ DevTools 지원
- ✅ TypeScript 친화적

---

## 관심사의 분리

### 폴더별 책임

```
src/
├── components/     # UI 표현 (어떻게 보일까?)
├── hooks/          # 로직 재사용 (어떻게 동작할까?)
├── stores/         # 전역 상태 (무엇을 저장할까?)
├── api/            # API 통신 (어떻게 통신할까?)
├── utils/          # 순수 함수 (어떻게 계산할까?)
├── constants/      # 상수 (무엇을 고정할까?)
└── types/          # 타입 정의 (어떤 형태일까?)
```

### 예시: 사용자 인증

```
인증 관련 코드 분리:
├── stores/auth-store.ts           # 상태: 로그인 여부, 사용자 정보
├── hooks/use-auth-guard.ts        # 로직: 인증 체크, 리다이렉트
├── api/auth.ts                    # 통신: 로그인, 로그아웃 API
├── components/gnb/gnb-auth.tsx    # UI: 로그인 버튼, 프로필
└── utils/auth-helpers.ts          # 유틸: 토큰 파싱, 권한 체크
```

---

## 아키텍처 다이어그램

### 전체 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                       사용자                             │
└─────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│                  Next.js App Router                      │
│  ┌────────────────────────────────────────────────┐    │
│  │  Pages (app/)                                  │    │
│  │    ├─ (main)/   → 메인 레이아웃               │    │
│  │    ├─ login/    → 로그인 레이아웃             │    │
│  │    └─ signup/   → 회원가입 레이아웃           │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ↓                  ↓                  ↓
  ┌──────────┐      ┌───────────┐      ┌──────────┐
  │Components│      │   Hooks   │      │  Stores  │
  │   (UI)   │←─────│  (Logic)  │─────→│ (State)  │
  └──────────┘      └───────────┘      └──────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ↓
                    ┌───────────┐
                    │ API Layer │
                    └───────────┘
                           │
                           ↓
                    ┌───────────┐
                    │  Backend  │
                    └───────────┘
```

### 데이터 흐름

```
1. 사용자 액션
   ↓
2. 컴포넌트에서 Hook 호출
   ↓
3. Hook에서 API 호출
   ↓
4. API에서 Backend 통신
   ↓
5. 데이터 받아서 Store 업데이트
   ↓
6. 컴포넌트 리렌더링
```

---

## 파일 구조의 장점

### 1. 확장성 (Scalability)

새 기능 추가가 쉽습니다.

```
새 기능 추가:
app/(main)/
└── reviews/              # 새 페이지
    ├── _components/
    ├── _hooks/
    └── page.tsx
```

- ✅ 기존 코드 영향 없음
- ✅ 독립적으로 개발 가능
- ✅ 폴더만 추가하면 됨

### 2. 유지보수성 (Maintainability)

관련 파일이 한 곳에 모여있습니다.

```
counselform 수정 시:
counselform/
├── _components/      # 관련 컴포넌트
├── _hooks/           # 관련 로직
├── _types/           # 관련 타입
└── _utils/           # 관련 유틸
```

- ✅ 한 폴더만 확인
- ✅ 수정 범위 명확
- ✅ 사이드 이펙트 최소화

### 3. 코드 재사용성 (Reusability)

재사용 수준이 명확합니다.

```
전역 재사용:
components/
├── ui/               # 모든 곳에서 사용
└── breeder-list/     # 여러 페이지에서 사용

지역 재사용:
explore/_components/  # 해당 기능 내에서만 사용
```

- ✅ 재사용 범위 명확
- ✅ 의존성 관리 용이
- ✅ 불필요한 결합 방지

### 4. 테스트 용이성 (Testability)

테스트 파일이 테스트 대상 근처에 위치합니다.

```
utils/
├── phone.ts
├── counsel-form-validation.ts
└── __tests__/
    ├── phone.test.ts
    └── counsel-form-validation.test.ts
```

- ✅ 테스트 찾기 쉬움
- ✅ 테스트 작성 편리
- ✅ 커버리지 확인 용이

### 5. 타입 안정성 (Type Safety)

TypeScript로 타입 안전성을 보장합니다.

```typescript
// _types/breeder.types.ts
export interface Breeder {
  id: string;
  name: string;
  rating: number;
  // ...
}

// _components/breeder-card.tsx
interface BreederCardProps {
  breeder: Breeder;  // ← 타입 안전
}
```

- ✅ 컴파일 타임 에러 감지
- ✅ 자동 완성 지원
- ✅ 리팩토링 안전

### 6. 삭제 용이성 (Removability)

기능 제거가 쉽습니다.

```bash
# 기능 전체 삭제
rm -rf app/(main)/counselform/

# 의존성 체크
# TypeScript가 자동으로 에러 표시
```

- ✅ 폴더만 삭제
- ✅ 의존성 자동 체크
- ✅ 안전한 제거

---

## 모범 사례 (Best Practices)

### 1. Colocation (함께 두기)

관련 파일을 가까이 둡니다.

```
✅ Good:
counselform/
├── _components/
├── _hooks/
└── page.tsx

❌ Bad:
app/counselform/page.tsx
components/counselform/...
hooks/counselform/...
```

### 2. Convention Over Configuration

일관된 규칙을 따릅니다.

```
✅ Good:
- _components/ (라우트 아님)
- _hooks/ (라우트 아님)
- page.tsx (라우트)

❌ Bad:
- components/ (헷갈림)
- utils/ (헷갈림)
```

### 3. Single Responsibility

각 파일이 하나의 책임만 가집니다.

```
✅ Good:
- use-breeder-list.ts (브리더 목록만)
- use-filters.ts (필터만)

❌ Bad:
- use-everything.ts (모든 것)
```

### 4. DRY (Don't Repeat Yourself)

중복을 피합니다.

```typescript
// ✅ Good: 공용 컴포넌트
components/ui/button.tsx

// 여러 곳에서 재사용
import { Button } from '@/components/ui/button';
```

### 5. Explicit Dependencies

의존성을 명확히 합니다.

```typescript
// ✅ Good: 명시적 import
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';

// ❌ Bad: 암시적 의존성
// import { Button } from '../../../components/ui/button';
```

---

## 실전 예시

### 새 페이지 추가하기

```bash
# 1. 페이지 폴더 생성
app/(main)/reviews/

# 2. 필요한 폴더 추가
app/(main)/reviews/
├── _components/
├── _hooks/
└── page.tsx

# 3. 컴포넌트 작성
# _components/review-list.tsx
# _components/review-card.tsx

# 4. Hook 작성
# _hooks/use-reviews.ts

# 5. 페이지 작성
# page.tsx
```

### 공용 컴포넌트 추출하기

```typescript
// 1. 여러 곳에서 사용되는 컴포넌트 발견
app/(main)/explore/_components/animal-card.tsx
app/(main)/saved/_components/animal-card.tsx  // 중복!

// 2. 공용 컴포넌트로 이동
components/animal-card.tsx

// 3. import 경로 변경
import { AnimalCard } from '@/components/animal-card';
```

---

## 핵심 패턴 요약

| 패턴 | 사용 위치 | 장점 |
|------|----------|------|
| **Route Groups** | `(main)/` | URL 간소화, 레이아웃 공유 |
| **Feature-Based** | 모든 페이지 | 캡슐화, 독립성, 확장성 |
| **Colocation** | `_components/`, `_hooks/` | 관련 파일 근접 배치 |
| **Custom Hooks** | `hooks/`, `_hooks/` | 로직 재사용 |
| **Zustand Store** | `stores/` | 간단한 전역 상태 |
| **Provider** | `providers/` | 전역 설정 관리 |
| **API Layer** | `api/` | 백엔드 통신 분리 |

---

## 결론

### 이 구조의 특징

- ✅ **현대적**: Next.js 15 App Router
- ✅ **체계적**: Feature-based 구조
- ✅ **확장 가능**: Colocation 패턴
- ✅ **유지보수 용이**: 명확한 분리
- ✅ **타입 안전**: TypeScript 엄격 모드
- ✅ **테스트 가능**: 테스트 파일 포함
- ✅ **모니터링**: Sentry 통합
- ✅ **자동화**: CI/CD 구축

### 실무 활용

이 구조는:
- 대규모 프로젝트에 적합
- 팀 협업에 유리
- 장기 유지보수에 최적
- 프로덕션 레벨

**실무에서 바로 사용 가능한 구조**입니다!

---

## 참고 자료

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [App Router Patterns](https://nextjs.org/docs/app/building-your-application/routing)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Patterns](https://react-patterns.com/)

---

**작성일**: 2026-02-02  
**프로젝트**: Pawpong  
**작성자**: Heeyoung
