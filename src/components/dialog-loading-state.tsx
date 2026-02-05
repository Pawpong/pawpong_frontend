import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { LoadingText } from './loading-state';

interface DialogLoadingStateProps {
  /** 다이얼로그 열림 상태 */
  open: boolean;
  /** 다이얼로그 열림 상태 변경 핸들러 */
  onOpenChange: (open: boolean) => void;
  /** 다이얼로그 컨텐츠 클래스명 (기본 스타일 포함) */
  dialogContentClass?: string;
  /** 로딩 메시지 (기본: "로딩 중...") */
  message?: string;
  /** 헤더 영역 높이 (기본: h-15) */
  headerHeight?: string;
  /** 하단 버튼 영역 높이 (기본: h-[57px]) */
  footerHeight?: string;
}

/**
 * 다이얼로그 내부 로딩 상태 컴포넌트
 * 
 * 다이얼로그의 표준 레이아웃 구조를 유지하면서 로딩 상태를 표시합니다.
 * - 헤더 영역
 * - 구분선
 * - 로딩 영역 (배경색 #F6F6EA)
 * - 구분선
 * - 하단 버튼 영역
 */
export function DialogLoadingState({
  open,
  onOpenChange,
  dialogContentClass = 'w-full h-full md:w-[37.5rem] md:h-[37.5rem] md:translate-x-[-50%] md:translate-y-[-50%] md:top-[50%] md:left-[50%] top-0 left-0 translate-x-0 translate-y-0 rounded-none md:rounded-2xl md:overflow-hidden border-none',
  message = '로딩 중...',
  headerHeight = 'h-15',
  footerHeight = 'h-[57px]',
}: DialogLoadingStateProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${dialogContentClass} p-0 gap-0 bg-white flex flex-col`}>
        <VisuallyHidden>
          <DialogTitle>로딩 중</DialogTitle>
        </VisuallyHidden>
        {/* 헤더 */}
        <div className={`flex gap-1 ${headerHeight} items-center justify-end px-6 pt-6 pb-2.5 bg-white rounded-t-none md:rounded-t-2xl`}></div>
        {/* 상단 구분선 */}
        <div className="h-px bg-[#E1E1E1]" />
        {/* 로딩 영역 */}
        <div className="overflow-y-auto bg-[#F6F6EA] px-6 py-5 flex-1 flex items-center justify-center">
          <LoadingText message={message} className="text-body-m text-grayscale-gray5" />
        </div>
        {/* 하단 구분선 */}
        <div className="h-px bg-[#E1E1E1]" />
        {/* 하단 버튼 영역 (빈 공간) */}
        <div className={`bg-white px-6 py-4 rounded-b-none md:rounded-b-2xl ${footerHeight}`}></div>
      </DialogContent>
    </Dialog>
  );
}
