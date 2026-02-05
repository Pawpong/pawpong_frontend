import { ReactNode } from 'react';

interface LoadingStateProps {
  /** 로딩 메시지 (기본: "로딩 중...") */
  message?: string;
  /** 스피너 크기 (기본: 'md') */
  size?: 'sm' | 'md' | 'lg';
  /** 전체 화면 중앙 정렬 여부 (기본: false) */
  fullScreen?: boolean;
}

/**
 * 통일된 로딩 상태 컴포넌트
 * - 스피너 + 메시지
 * - 일관된 디자인 (primary-500 색상, 적절한 폰트 크기)
 */
export function LoadingState({ message = '로딩 중...', size = 'md', fullScreen = false }: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const containerClasses = fullScreen
    ? 'flex justify-center items-center min-h-screen'
    : 'flex justify-center items-center py-20';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        {/* 스피너 */}
        <div className={`relative ${sizeClasses[size]}`}>
          <div className="absolute inset-0 border-2 border-primary-500/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
        {/* 메시지 */}
        <p className="text-body-s text-grayscale-gray5">{message}</p>
      </div>
    </div>
  );
}

interface LoadingTextProps {
  /** 로딩 메시지 (기본: "로딩 중...") */
  message?: string;
  /** 커스텀 클래스명 */
  className?: string;
}

/**
 * 간단한 로딩 텍스트 컴포넌트 (스피너 없음)
 * - 텍스트만 표시
 */
export function LoadingText({ message = '로딩 중...', className }: LoadingTextProps) {
  return <p className={`text-body-s text-grayscale-gray5 ${className || ''}`}>{message}</p>;
}

interface LoadingContainerProps {
  /** 로딩 중 여부 */
  isLoading: boolean;
  /** 로딩 메시지 */
  message?: string;
  /** 스피너 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 전체 화면 중앙 정렬 여부 */
  fullScreen?: boolean;
  /** 로딩이 완료되면 보여줄 자식 컴포넌트 */
  children: ReactNode;
}

/**
 * 로딩 상태를 자동으로 처리하는 컨테이너 컴포넌트
 * - isLoading이 true면 LoadingState를 보여주고
 * - false면 children을 보여줌
 */
export function LoadingContainer({ isLoading, message, size, fullScreen, children }: LoadingContainerProps) {
  if (isLoading) {
    return <LoadingState message={message} size={size} fullScreen={fullScreen} />;
  }

  return <>{children}</>;
}
