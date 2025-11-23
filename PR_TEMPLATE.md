# 브리더 상세 페이지 레이아웃 및 간격 조정

## 변경 사항

### 1. 리뷰 컴포넌트 레이아웃 개선
- **파일**: `src/app/(main)/explore/breeder/[id]/_components/review.tsx`
- 리뷰 레이아웃을 2줄 구조로 변경
  - 첫 번째 줄: "닉네임 입양 후기 · 날짜 신고하기" (데스크톱), 모바일에서는 "닉네임 신고하기"와 "입양 후기 · 날짜"를 분리
  - 두 번째 줄: 리뷰 내용
  - 두 줄 사이 간격: `gap-2` (8px) 적용

### 2. 리뷰 목록 간격 조정
- **파일**: `src/app/(main)/explore/breeder/[id]/_components/reviews.tsx`
- 리뷰들 사이 간격을 `space-y-8`에서 `flex flex-col gap-8`로 변경하여 32px 간격 명확히 적용

### 3. Separator 여백 통일
- **파일**: `src/app/(main)/explore/breeder/[id]/page.tsx`
- Separator의 `md:my-12`를 `my-12`로 변경하여 모든 화면 크기(모바일/패드/데스크톱)에서 48px 여백 적용

### 4. 모바일 프로필-사진 간격 조정
- **파일**: `src/app/(main)/explore/breeder/[id]/page.tsx`
- 모바일에서 프로필과 사진(EnvPhotos) 사이 간격을 40px로 설정 (`mt-10 md:mt-0`)

## 관련 이슈
- 디자인 시안에 따른 레이아웃 조정
- 반응형 간격 통일

## 테스트 체크리스트
- [ ] 모바일에서 리뷰 레이아웃이 올바르게 표시되는지 확인
- [ ] 데스크톱에서 리뷰 레이아웃이 올바르게 표시되는지 확인
- [ ] 리뷰들 사이 간격이 32px인지 확인
- [ ] Separator 위아래 여백이 모든 화면 크기에서 48px인지 확인
- [ ] 모바일에서 프로필과 사진 사이 간격이 40px인지 확인

