# PR 타이틀

feat: 약관/개인정보처리방침 다이얼로그 개선 및 UI 컴포넌트 수정

## 📋 변경 사항

### 주요 변경사항

- 서비스 이용약관 및 개인정보처리방침 다이얼로그를 Figma 디자인에 맞게 구조 개선
- 약관 내용을 상수 파일로 분리하여 관리 용이성 향상
- LargeDialogHeader 모바일 반응형 padding 추가
- 글로벌 CSS 타이포그래피 및 스타일 변수 수정

### 상세 변경사항

#### 1. 약관/개인정보처리방침 다이얼로그 개선

- **파일**: `src/app/signup/_components/term-dialog-trigger.tsx`, `src/app/signup/_components/privacy-dialog-trigger.tsx`
- Figma 디자인에 맞게 `ol`/`ul` 리스트 구조로 변경
- 들여쓰기 및 간격 조정 (`ms-[21px]`, `ms-[42px]`, `gap-[20px]`)
- 제목 스타일 조정 (`font-semibold` 제거)
- 약관 내용을 `src/constants/terms.tsx`, `src/constants/privacy.tsx`로 분리

#### 2. LargeDialog 컴포넌트 개선

- **파일**: `src/components/ui/large-dialog.tsx`
- `LargeDialogHeader`에 모바일 padding 추가 (`py-4 px-5`)
- 데스크탑/태블릿은 기존 스타일 유지 (`md:pt-6 md:px-6 md:pb-2.5`)

#### 3. 글로벌 CSS 타이포그래피 수정

- **파일**: `src/app/global.css`
- 타이포그래피 line-height 값들을 모바일/데스크탑 반응형으로 대폭 수정
  - 모바일: Display 44px, Heading-1 40px, Heading-2 36px, Heading-3 28px, Body-L 28px, Body-M 24px, Body-S 22px, Body-XS 18px, Caption 11px
  - 데스크탑: Display 64px, Heading-1 60px, Heading-2 48px, Heading-3 36px, Body-L 32px, Body-M 28px, Body-S 24px, Body-XS 20px, Caption 12px

#### 4. 닉네임 섹션 개선

- **파일**: `src/app/signup/_components/sections/nickname-section.tsx`
- Figma 디자인에 맞게 성공 메시지 구조 변경
- Input 필드와 성공 메시지를 하나의 컨테이너로 묶어 일관된 간격 유지 (`gap-[10px]`)
- 성공 메시지에 체크 아이콘 추가 및 텍스트 변경 ("사용 가능한 닉네임입니다" → "사용할 수 있는 닉네임이에요")
- 메시지 스타일: `text-caption font-medium text-status-success-500`

#### 5. 플랜 섹션 수정

- **파일**: `src/app/signup/_components/sections/plan-section.tsx`
- 제목 변경: "회원 유형을 선택해 주세요" → "원하는 플랜을 선택해 주세요"
- 색상 클래스 수정: `bg-secondary` → `bg-secondary-500`, `text-primary!` → `text-primary-500`
- Free 뱃지 색상 수정: `bg-primary text-secondary` → `bg-primary-500 text-secondary-500`
- 불필요한 `!` 제거

#### 6. 사용자 정보 섹션 수정

- **파일**: `src/app/signup/_components/sections/user-info-section.tsx`
- 인증 관련 버튼에 `text-body-s` 클래스 추가

#### 7. 버튼 컴포넌트 수정

- **파일**: `src/components/ui/button.tsx`
- tertiary variant에서 불필요한 `!` 제거

#### 8. NextButton 컴포넌트 수정

- **파일**: `src/components/signup-form-section/next-button.tsx`
- 고정 높이 추가: `h-12`

## 📁 변경된 파일

### 수정된 파일

- `src/app/global.css`
- `src/app/signup/_components/privacy-dialog-trigger.tsx`
- `src/app/signup/_components/sections/nickname-section.tsx`
- `src/app/signup/_components/sections/plan-section.tsx`
- `src/app/signup/_components/sections/user-info-section.tsx`
- `src/app/signup/_components/term-dialog-trigger.tsx`
- `src/components/signup-form-section/next-button.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/large-dialog.tsx`

### 새로 추가된 파일

- `src/constants/privacy.tsx` - 개인정보처리방침 내용 상수
- `src/constants/terms.tsx` - 서비스 이용약관 내용 상수
- `src/assets/icons/check-blue.svg` - 체크 아이콘

## 🎨 디자인 변경사항

- 약관/개인정보처리방침 다이얼로그가 Figma 디자인과 일치하도록 구조 개선
- 모바일 환경에서 다이얼로그 헤더 padding 조정
- 닉네임 섹션 성공 메시지가 Figma 디자인에 맞게 구조 개선
- 타이포그래피 line-height 값들을 디자인 시스템에 맞게 조정
- 플랜 섹션 제목 및 색상 클래스 수정

## ✅ 체크리스트

- [x] 코드 리뷰 완료
- [x] 디자인 검토 완료
- [x] 반응형 디자인 테스트 완료
- [x] 브라우저 호환성 확인

## 📸 스크린샷 (선택사항)

<!-- 필요시 스크린샷 추가 -->

## 🔗 관련 이슈

<!-- 관련 이슈 번호가 있다면 추가 -->

- Closes #49
