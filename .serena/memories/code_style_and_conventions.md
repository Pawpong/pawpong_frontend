# Code Style and Conventions

## Prettier
- Single quotes (`'`)
- Trailing commas (`all`)
- Tab width: 2
- Print width: 120

## ESLint
- `next/core-web-vitals`
- `next/typescript`
- Storybook flat/recommended

## TypeScript
- Strict mode enabled
- Target: ES2017
- Module: ESNext (bundler resolution)

## Naming Conventions
- 파일/폴더: kebab-case (예: `counsel-form-store.ts`, `use-breakpoint.tsx`)
- 컴포넌트: PascalCase (예: `CounselSection`)
- 훅: camelCase with `use-` prefix (예: `use-toast.ts`)
- 상수: camelCase 또는 UPPER_SNAKE_CASE
- 타입/인터페이스: PascalCase

## Project Patterns
- Next.js App Router 사용 (route groups, layouts)
- `_components`, `_hooks`, `_types` 디렉토리로 route-specific 코드 분리
- Zustand 스토어: `src/stores/` 디렉토리
- shadcn/ui 컴포넌트: `src/components/ui/`
- Radix UI primitives 기반 커스텀 컴포넌트
- React Hook Form + Zod 스키마 검증
- TanStack React Query로 서버 상태 관리
