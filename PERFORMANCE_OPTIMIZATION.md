# 성능 최적화 제안서

## 📊 현재 상태 분석

### 발견된 주요 이슈
1. **클라이언트 컴포넌트 과다 사용**: 107개 파일에서 `'use client'` 사용
2. **코드 스플리팅 부재**: `dynamic()` import가 전혀 사용되지 않음
3. **메모이제이션 부족**: `useMemo`/`useCallback`이 10개 파일에서만 사용
4. **React.memo 미사용**: 컴포넌트 메모이제이션이 없음
5. **불필요한 리렌더링 가능성**: 큰 컴포넌트들이 최적화되지 않음

---

## 🚀 우선순위별 최적화 제안

### 🔴 높은 우선순위 (즉시 적용 권장)

#### 1. 코드 스플리팅 (Code Splitting)
**현재 문제**: 모든 컴포넌트가 번들에 포함되어 초기 로딩이 느림

**제안**:
```typescript
// ❌ 현재
import ReviewDialog from '@/components/review-dialog';

// ✅ 개선
import dynamic from 'next/dynamic';
const ReviewDialog = dynamic(() => import('@/components/review-dialog'), {
  loading: () => <div>로딩 중...</div>,
  ssr: false // 클라이언트 전용 컴포넌트인 경우
});
```

**적용 대상**:
- `src/app/(main)/application/_components/review-dialog.tsx` - 큰 다이얼로그
- `src/app/(main)/explore/breeder/[id]/_components/pet-detail-dialog.tsx` - 모달 컴포넌트
- `src/app/(main)/profile/page.tsx` - 복잡한 폼 페이지
- `src/app/(main)/counselform/_components/*` - 큰 폼 컴포넌트들
- `src/app/(main)/feed/_components/*` - 비디오 관련 컴포넌트

**예상 효과**: 초기 번들 크기 30-40% 감소

---

#### 2. React.memo로 불필요한 리렌더링 방지
**현재 문제**: 부모 컴포넌트 리렌더링 시 자식 컴포넌트도 모두 리렌더링

**제안**:
```typescript
// ❌ 현재
export default function ReviewListItem({ review }: ReviewListItemProps) {
  // ...
}

// ✅ 개선
export default React.memo(function ReviewListItem({ review }: ReviewListItemProps) {
  // ...
}, (prevProps, nextProps) => {
  // 커스텀 비교 함수 (필요시)
  return prevProps.review.reviewId === nextProps.review.reviewId;
});
```

**적용 대상**:
- `src/app/(main)/profile/reviews/_components/review-list-item.tsx`
- `src/app/(main)/explore/breeder/[id]/_components/review.tsx`
- `src/app/(main)/explore/_components/site-breeder-list.tsx` - 리스트 아이템들
- `src/app/(main)/feed/_components/feed-video-card.tsx`
- `src/app/(main)/application/_components/application-list-item.tsx`

**예상 효과**: 리렌더링 횟수 50-70% 감소

---

#### 3. useCallback으로 함수 메모이제이션
**현재 문제**: 매 렌더링마다 새로운 함수가 생성되어 자식 컴포넌트 리렌더링 유발

**제안**:
```typescript
// ❌ 현재
const handleClick = () => {
  // ...
};

// ✅ 개선
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);
```

**적용 대상**:
- `src/app/(main)/explore/breeder/[id]/_components/breeder-detail-client.tsx`
  - `handleCounselClick` 함수
- `src/app/(main)/profile/page.tsx`
  - 폼 핸들러 함수들
- `src/app/(main)/feed/page.tsx`
  - 비디오 관련 핸들러들

---

#### 4. useMemo로 계산 비용이 큰 값 메모이제이션
**현재 문제**: 매 렌더링마다 복잡한 계산이 반복됨

**제안**:
```typescript
// ❌ 현재
const mappedReviews = reviews.map(review => {
  // 복잡한 변환 로직
});

// ✅ 개선
const mappedReviews = useMemo(() => {
  return reviews.map(review => {
    // 복잡한 변환 로직
  });
}, [reviews]);
```

**적용 대상**:
- `src/app/(main)/explore/breeder/[id]/_components/breeder-detail-client.tsx`
  - `reviews` 매핑 로직 (327-352줄)
  - `breedingAnimals` 매핑
  - `parentPets` 매핑
- `src/app/(main)/profile/reviews/page.tsx`
  - `allReviews` 매핑 로직
- `src/app/(main)/explore/_hooks/use-filter-data.ts`
  - 필터 데이터 변환 로직

---

### 🟡 중간 우선순위 (단기 적용 권장)

#### 5. 이미지 최적화 강화
**현재 상태**: `next/image` 사용 중 (좋음)

**개선 제안**:
```typescript
// ✅ 추가 최적화
<Image
  src={imageUrl}
  alt="description"
  width={400}
  height={300}
  loading="lazy" // 뷰포트 밖 이미지 지연 로딩
  placeholder="blur" // 블러 플레이스홀더
  blurDataURL={blurDataUrl} // 작은 블러 이미지
  sizes="(max-width: 768px) 100vw, 50vw" // 반응형 크기
/>
```

**적용 대상**:
- 모든 이미지 사용 컴포넌트
- 특히 리스트 아이템의 썸네일 이미지들

---

#### 6. API 호출 최적화
**현재 문제**: 불필요한 API 호출 또는 순차적 호출

**제안**:
```typescript
// ❌ 현재: 순차적 호출
const { data: profile } = useBreederProfile(breederId);
const { data: pets } = useBreederPets(breederId);
const { data: reviews } = useBreederReviews(breederId);

// ✅ 개선: 병렬 호출 + 조건부 호출
const { data: profile } = useBreederProfile(breederId);
const { data: pets } = useBreederPets(breederId, 1, 20, {
  enabled: !!profile // 프로필 로드 후에만 호출
});
const { data: reviews } = useBreederReviews(breederId, {
  enabled: !!profile && shouldLoadReviews
});
```

**적용 대상**:
- `src/app/(main)/explore/breeder/[id]/_components/breeder-detail-client.tsx`
  - 4개의 독립적인 쿼리를 조건부로 최적화

---

#### 7. 불필요한 'use client' 제거
**현재 문제**: 서버 컴포넌트로 가능한데 클라이언트 컴포넌트로 되어 있음

**제안**:
```typescript
// ❌ 현재
'use client';
export default function StaticComponent() {
  return <div>정적 콘텐츠</div>;
}

// ✅ 개선 (서버 컴포넌트로)
export default function StaticComponent() {
  return <div>정적 콘텐츠</div>;
}
```

**확인 필요 파일**:
- `src/app/(main)/page.tsx` - 정적 콘텐츠만 있는 경우
- `src/app/(main)/introduction/page.tsx`
- `src/app/(main)/terms-of-service/page.tsx`
- `src/app/(main)/terms-of-privacy/page.tsx`

---

#### 8. Suspense 경계 추가
**현재 문제**: 로딩 상태가 개별적으로 처리됨

**제안**:
```typescript
// ✅ 개선
<Suspense fallback={<LoadingSkeleton />}>
  <BreederDetailContent breederId={breederId} />
</Suspense>
```

**적용 대상**:
- `src/app/(main)/explore/breeder/[id]/page.tsx`
- `src/app/(main)/profile/page.tsx`
- 큰 데이터를 로드하는 페이지들

---

### 🟢 낮은 우선순위 (장기 개선)

#### 9. 가상화 (Virtualization) 적용
**제안**: 긴 리스트에 `react-window` 또는 `react-virtual` 사용

**적용 대상**:
- `src/app/(main)/explore/_components/site-breeder-list.tsx` - 브리더 리스트
- `src/app/(main)/feed/page.tsx` - 피드 리스트
- `src/app/(main)/profile/reviews/page.tsx` - 후기 리스트

---

#### 10. Web Workers 활용
**제안**: 무거운 계산 작업을 웹 워커로 이동

**적용 대상**:
- 이미지 처리
- 대량 데이터 필터링/정렬
- 복잡한 폼 검증

---

#### 11. Service Worker 캐싱
**제안**: 정적 자산 및 API 응답 캐싱

---

## 📝 구체적인 파일별 개선 사항

### `src/app/(main)/explore/breeder/[id]/_components/breeder-detail-client.tsx`
1. ✅ `reviews` 매핑 로직을 `useMemo`로 감싸기
2. ✅ `handleCounselClick`을 `useCallback`으로 메모이제이션
3. ✅ 하위 컴포넌트들을 `React.memo`로 감싸기
4. ✅ API 호출을 조건부로 최적화

### `src/app/(main)/profile/page.tsx`
1. ✅ 큰 폼 컴포넌트를 `dynamic` import로 변경
2. ✅ 폼 핸들러 함수들을 `useCallback`으로 메모이제이션
3. ✅ 복잡한 변환 로직을 `useMemo`로 감싸기

### `src/app/(main)/page.tsx`
1. ✅ `'use client'` 제거 가능 여부 확인
2. ✅ 하위 컴포넌트들을 `dynamic` import로 변경

### `src/app/(main)/feed/_components/feed-video-card.tsx`
1. ✅ `React.memo`로 감싸기
2. ✅ 비디오 관련 핸들러들을 `useCallback`으로 메모이제이션

---

## 🎯 예상 성능 개선 효과

| 최적화 항목 | 예상 개선율 |
|------------|------------|
| 코드 스플리팅 | 초기 로딩 시간 30-40% 감소 |
| React.memo | 리렌더링 횟수 50-70% 감소 |
| useMemo/useCallback | CPU 사용량 20-30% 감소 |
| API 호출 최적화 | 네트워크 요청 시간 15-25% 감소 |
| 이미지 최적화 | 이미지 로딩 시간 40-50% 감소 |

**전체 예상 효과**: 
- 초기 로딩 시간: **40-50% 감소**
- 런타임 성능: **30-40% 개선**
- 번들 크기: **30-35% 감소**

---

## 🔧 구현 가이드

### 단계별 적용 순서
1. **1주차**: 코드 스플리팅 (높은 우선순위)
2. **2주차**: React.memo 적용
3. **3주차**: useCallback/useMemo 적용
4. **4주차**: API 호출 최적화
5. **5주차**: 기타 최적화

### 테스트 방법
- React DevTools Profiler로 리렌더링 확인
- Lighthouse로 성능 점수 측정
- Network 탭으로 번들 크기 확인
- Performance 탭으로 런타임 성능 측정

---

## 📚 참고 자료
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Web.dev Performance](https://web.dev/performance/)
