import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/api/utils';

const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[--spacing(2)] text-body-xs font-medium transition-all disabled:pointer-events-none [&_svg]:pointer-events-none   [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        // 기본 버튼: 주요 액션에 사용 (예: 회원가입, 제출 등)
        default: 'bg-primary text-white hover:bg-primary-600 ',
        primary: 'bg-primary-500 text-white hover:bg-primary-600 ',
        // 아웃라인 버튼: 보조 액션에 사용 (예: 취소, 뒤로가기 등)
        outline:
          'border bg-background hover:bg-branding-bg border-[#EEEBDE] hover:text-primary-500 dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        // 세컨더리 버튼: 보조 액션에 사용
        secondary: 'bg-[var(--color-tertiary-500)] text-primary-500 hover:bg-[#EEEBDE]',
        // 터셔리 버튼: 보조 액션에 사용 (예: 중복검사 버튼 등)
        tertiary:
          'bg-secondary-500 text-primary-500 hover:bg-secondary-600 disabled:bg-status-disabled disabled:text-grayscale-gray4',
        // 고스트 버튼: 텍스트만 있는 버튼 (예: 더보기 버튼 등)
        ghost: 'hover:text-primary-500',
        // 링크 버튼: 링크처럼 보이는 버튼
        link: 'text-primary-500 underline-offset-4 hover:underline',
        // 필터 버튼: 필터링 기능에 사용
        filter: 'bg-[#A0C8F4] text-primary-500 md:text-grayscale-gray6 hover:bg-secondary-600',
        // 텍스트 버튼: 텍스트만 있는 버튼 (고스트와 유사하지만 더 미묘한 스타일)
        text: 'text-body-xs text-grayscale-gray5! hover:text-primary-500!',
        // 카테고리 버튼: 카테고리 선택에 사용 (예: 고양이/강아지 카테고리)
        category:
          'text-body-xs text-grayscale-gray6! bg-transparent hover:bg-[#F6F6EA]! rounded-sm w-full md:w-40 shrink-0 flex justify-start whitespace-wrap',
        // 수컷 성별 버튼: 성별 선택에 사용
        maleGender: 'hover:bg-[var(--color-gender-male-100)]',
        // 암컷 성별 버튼: 성별 선택에 사용
        femaleGender: 'hover:bg-[var(--color-gender-female-100)]',
        // 부모 추가 버튼: 부모 정보 추가에 사용
        addParent: 'bg-tertiary-700 hover:bg-tertiary-800',
        // 인풋 버튼: 파일 선택, 드롭다운 트리거 등에 사용
        input: 'bg-white text-grayscale-gray4 hover:bg-white/90 justify-between w-full text-body-s',
      },
      size: {
        // 기본 사이즈: 일반적인 버튼에 사용
        default: 'px-2.5 py-1.5',
        // 작은 사이즈: 작은 공간에 배치되는 버튼에 사용 4px
        sm: 'rounded gap-1.5 px-3 ',
        // 큰 사이즈: 강조가 필요한 버튼에 사용 8px
        lg: 'rounded-lg px-6 ',
        // 아이콘 사이즈: 아이콘만 있는 버튼에 사용 (정사각형)
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
