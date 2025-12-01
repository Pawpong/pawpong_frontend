# 입점 서류 수정 페이지 구현 및 공통 컴포넌트 리팩터링

## 📋 변경 사항

### 주요 기능
- ✅ GNB 메뉴에서 "입점 서류 수정" 클릭 시 `/profile/documents` 페이지 이동 기능 구현
- ✅ 브리더 입점 서류 수정 페이지 UI 구현 (Elite/New 레벨 선택, 파일 업로드, 서약서 동의)
- ✅ 문서 관련 공통 컴포넌트 분리 및 재사용 구조 개선
- ✅ 파일 업로드 컴포넌트 border 스타일 제거
- ✅ 서약서 동의 상태를 스토어에 저장하여 상태 유지

### 스타일 변경
- **GNB 배경색**: `/profile/documents` 경로에서 GNB 배경색을 `bg-tertiary-500`로 변경
- **파일 업로드**: 파일 선택 전 border 제거로 더 깔끔한 UI 제공

## 📁 파일 구조

### 새로 생성된 파일

```
src/
├── app/
│   └── (main)/
│       └── profile/
│           └── documents/
│               ├── layout.tsx          # 페이지 레이아웃 (signup과 동일한 구조)
│               └── page.tsx            # 페이지 진입점
│
└── components/
    └── document-form/                  # 문서 관련 공통 컴포넌트
        ├── document-constants.ts       # 상수 및 타입 정의
        ├── document-edit-section.tsx    # 입점 서류 수정 섹션
        ├── document-form-content.tsx   # 폼 컨텐츠 통합 컴포넌트
        ├── document-upload-fields.tsx  # 파일 업로드 필드 컴포넌트
        ├── level-tabs.tsx              # 레벨 탭 컴포넌트
        └── oath-checkbox.tsx           # 서약서 체크박스 컴포넌트
```

### 수정된 파일

```
src/
├── app/
│   ├── (main)/
│   │   └── layout.tsx                  # GNB 배경색 조건 추가 (/profile/documents)
│   └── signup/
│       └── _components/
│           └── sections/
│               ├── document-section.tsx        # 공통 컴포넌트 사용, 스토어 연동
│               └── file-button.tsx             # border 제거
│
├── components/
│   └── gnb/
│       ├── gnb.tsx                             # navVariant prop 추가
│       └── nav-button.tsx                     # navVariant prop 추가
│
└── stores/
    └── signup-form-store.ts                    # oathChecked 필드 추가
```

## 🔄 리팩터링 내용

### 공통 컴포넌트 분리
- `document-section.tsx` (signup)와 `document-edit-section.tsx` (profile/documents)의 중복 코드 제거
- 공통 로직을 `document-form` 폴더로 분리하여 재사용성 향상
- 컴포넌트 구조:
  ```
  DocumentEditSection / DocumentSection
    └── DocumentFormContent
        ├── LevelTabs
        ├── DocumentUploadFields
        └── OathCheckbox
  ```

### 스토어 연동
- 서약서 동의 상태(`oathChecked`)를 `signup-form-store`에 추가
- signup과 입점 서류 수정 페이지 모두 스토어를 사용하여 상태 유지
- 페이지 이동 후에도 서약서 동의 상태가 유지됨

## 🎨 스타일 변경 상세

### 1. GNB 배경색 조건부 적용
**파일**: `src/app/(main)/layout.tsx`

```tsx
const isProfileDocumentsPage = pathname === "/profile/documents";
const useTertiaryVariant = isProfilePage || isProfileDocumentsPage || isCounselFormPage;
```

**변경 이유**: 입점 서류 수정 페이지에서도 GNB 배경색을 tertiary로 통일

### 2. 파일 업로드 border 제거
**파일**: `src/app/signup/_components/sections/file-button.tsx`

```tsx
// 변경 전
!fileName && "border border-grayscale-gray3"

// 변경 후
// border 제거
```

**변경 이유**: 더 깔끔한 UI 제공

## 🧪 테스트 체크리스트

- [ ] GNB 메뉴에서 "입점 서류 수정" 클릭 시 페이지 이동 확인
- [ ] Elite/New 레벨 탭 전환 동작 확인
- [ ] 파일 업로드 기능 동작 확인
- [ ] 서약서 체크박스 동작 확인
- [ ] 서약서 동의 상태가 스토어에 저장되는지 확인
- [ ] 페이지 이동 후 서약서 동의 상태 유지 확인
- [ ] 제출 버튼 활성화/비활성화 확인
- [ ] 모바일/데스크탑 반응형 레이아웃 확인
- [ ] GNB 배경색이 올바르게 적용되는지 확인

## 📝 참고사항

- 파일 업로드 border 제거로 더 깔끔한 UI 제공
- 공통 컴포넌트 분리로 유지보수성 향상
- signup과 동일한 레이아웃 구조로 일관성 유지
- 스토어 연동으로 상태 관리 개선

