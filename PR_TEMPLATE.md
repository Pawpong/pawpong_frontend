## 📋 PR 제목
```
feat: 브리더 프로필 엄마·아빠 및 분양 중인 아이들 사진·영상 필드 추가 (백엔드 대기 중)
```

## 📝 변경 사항

### ✨ 추가된 기능
- 브리더 프로필 수정 페이지에 엄마·아빠(parentPetInfo) 섹션에 사진·영상 업로드 필드 추가
- 브리더 프로필 수정 페이지에 분양 중인 아이들(availablePetInfo) 섹션에 사진·영상 업로드 필드 추가
- 각 항목당 최대 4개까지 사진 업로드 가능
- `ImageEdit` 컴포넌트에 `labelText` prop 추가 (카운터 대신 커스텀 텍스트 표시)
- `ImagePreview` 컴포넌트의 이미지 간격을 10px로 조정

### 🔧 수정된 파일
- `src/app/(main)/profile/profile-schema.ts` - photos 필드 스키마 추가 (현재 주석 처리)
- `src/app/(main)/profile/_components/parents-info.tsx` - 사진·영상 섹션 추가 (현재 주석 처리)
- `src/app/(main)/profile/_components/breeding-animals.tsx` - 사진·영상 섹션 추가 (현재 주석 처리)
- `src/components/image-edit.tsx` - labelText prop 추가, gap 조정
- `src/components/image-preview.tsx` - gap을 10px로 조정
- `src/stores/profile-store.ts` - photos 필드 처리 로직 추가 (현재 주석 처리)
- `src/app/(main)/profile/page.tsx` - photos 필드 초기화 로직 추가 (현재 주석 처리)

### 📄 추가된 파일
- `API_SPEC_PHOTOS_FIELD.md` - 백엔드 팀원 공유용 API 스펙 문서

## ⚠️ 주의사항
- 현재 `photos` 필드 관련 코드는 **주석 처리된 상태**입니다
- 백엔드 API 구현 완료 후 주석을 해제하여 사용할 예정입니다
- API 스펙 문서(`API_SPEC_PHOTOS_FIELD.md`)를 백엔드 팀원과 공유했습니다

## 🎨 UI 변경사항
- 엄마·아빠 섹션에 "사진·영상" 업로드 UI 추가 (주석 처리됨)
- 분양 중인 아이들 섹션에 "사진·영상" 업로드 UI 추가 (주석 처리됨)
- 카메라 아이콘과 텍스트 간격을 `gap-1.5`로 조정
- 이미지 프리뷰 간격을 10px로 조정

## 🔗 관련 이슈
- #335

## ✅ 체크리스트
- [x] 코드 작성 완료
- [x] 주석 처리 완료 (백엔드 대기)
- [x] API 스펙 문서 작성 완료
- [x] 린터 에러 없음
- [ ] 백엔드 API 구현 완료 후 주석 해제 필요
- [ ] 백엔드 API 연동 테스트 필요

## 📸 스크린샷
(백엔드 연동 후 추가 예정)
