## 📋 PR 제목
```
feat: 브리더 프로필 엄마·아빠 및 분양 중인 아이들 사진·영상 필드 추가
```

## 📝 변경 사항

### ✨ 추가된 기능
- 브리더 프로필 수정 페이지에 엄마·아빠(parentPetInfo) 섹션에 사진·영상 업로드 필드 추가
- 브리더 프로필 수정 페이지에 분양 중인 아이들(availablePetInfo) 섹션에 사진·영상 업로드 필드 추가
- 각 항목당 최대 4개까지 사진 업로드 가능
- `ImageEdit` 컴포넌트에 `labelText` prop 추가 (카운터 대신 커스텀 텍스트 표시)
- `ImagePreview` 컴포넌트의 이미지 간격을 10px로 조정
- 최대 개수 초과 시 토스트 메시지 표시 기능 추가
- 데스크탑(lg)에서 토스트가 오른쪽 영역에 표시되도록 설정

### 🔧 수정된 파일
- `src/app/(main)/profile/profile-schema.ts` - photos 필드 스키마 추가
- `src/app/(main)/profile/_components/parents-info.tsx` - 사진·영상 섹션 추가
- `src/app/(main)/profile/_components/breeding-animals.tsx` - 사진·영상 섹션 추가
- `src/components/image-edit.tsx` - labelText prop 추가, gap 조정, 최대 개수 초과 시 토스트 표시
- `src/components/image-preview.tsx` - gap을 10px로 조정
- `src/stores/profile-store.ts` - photos 필드 처리 로직 추가
- `src/app/(main)/profile/page.tsx` - photos 필드 초기화 로직 추가

### 🎨 UI 변경사항
- 엄마·아빠 섹션에 "사진·영상" 업로드 UI 추가
- 분양 중인 아이들 섹션에 "사진·영상" 업로드 UI 추가
- 카메라 아이콘과 텍스트 간격을 `gap-1.5`로 조정
- 이미지 프리뷰 간격을 10px로 조정
- 최대 4장 초과 시 "상세 사진·영상은 최대 4장 등록할 수 있어요" 토스트 표시
- 데스크탑에서 토스트가 오른쪽 콘텐츠 영역에 표시

### 🐛 버그 수정
- 최대 개수 초과 시에도 파일이 추가되던 문제 수정
- 여러 파일을 한 번에 선택했을 때 초과분이 자동으로 제거되도록 개선

## 🔗 관련 이슈
- #335

## ✅ 체크리스트
- [x] 코드 작성 완료
- [x] 최대 개수 초과 시 토스트 표시 기능 추가
- [x] 데스크탑에서 토스트 위치 설정
- [x] 린터 에러 없음
- [ ] 백엔드 API 연동 필요 (API 스펙 문서: `API_SPEC_PHOTOS_FIELD.md`)
- [ ] 백엔드 API 연동 테스트 필요

## 📸 스크린샷
(추가 예정)

## 📄 참고사항
- 백엔드 API 구현 완료 후 실제 업로드 로직 구현 필요
- API 스펙 문서(`API_SPEC_PHOTOS_FIELD.md`)를 백엔드 팀원과 공유 완료
