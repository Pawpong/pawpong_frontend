# Project Overview: pawpong_frontend

## Purpose
반려동물 분양/입양 플랫폼 "포퐁(PawPong)"의 프론트엔드 애플리케이션.
브리더 프로필, 분양 상담 신청, 피드, 탐색, 저장, 알림 등의 기능 포함.

## Tech Stack
- **Framework**: Next.js 15.5.7 (App Router, Turbopack)
- **UI Library**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand 5
- **Data Fetching**: TanStack React Query 5 + Axios
- **Forms**: React Hook Form 7 + Zod 4
- **UI Components**: Radix UI, Lucide Icons, shadcn/ui (via components.json)
- **Auth**: NextAuth 4
- **Testing**: Vitest + React Testing Library
- **Storybook**: Storybook 10
- **Error Tracking**: Sentry
- **Code Quality**: ESLint (next/core-web-vitals), Prettier

## Project Structure
```
src/
├── app/                   # Next.js App Router
│   ├── (main)/            # Main authenticated routes
│   │   ├── explore/       # 탐색
│   │   ├── feed/          # 피드
│   │   ├── profile/       # 프로필
│   │   ├── counselform/   # 분양 상담 폼
│   │   ├── application/   # 신청
│   │   ├── myapplication/ # 내 신청
│   │   ├── saved/         # 저장
│   │   ├── settings/      # 설정
│   │   ├── faq/           # FAQ
│   │   └── ...
│   ├── login/             # 로그인
│   ├── signup/            # 회원가입
│   └── api/               # API routes
├── components/            # 공유 컴포넌트
│   ├── ui/                # shadcn/ui 기본 컴포넌트
│   ├── breeder/           # 브리더 관련
│   ├── gnb/               # 네비게이션
│   └── ...
├── hooks/                 # 커스텀 훅
├── stores/                # Zustand 상태 관리
├── utils/                 # 유틸리티
├── constants/             # 상수 정의
├── types/                 # TypeScript 타입
├── contexts/              # React Context
├── providers/             # Provider 컴포넌트
├── styles/                # 스타일
├── assets/                # 정적 자산
└── stories/               # Storybook 스토리
```

## Path Aliases
- `@/*` → `./src/*`
- `@/api/*` → `./src/app/api/*`
