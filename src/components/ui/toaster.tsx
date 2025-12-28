'use client';

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import Check from '@/assets/icons/check';
import type { ToastPosition } from '@/hooks/use-toast';

export function Toaster() {
  const { toasts } = useToast();

  // position별로 토스트 그룹화
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = (toast.position || 'default') as ToastPosition;
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {} as Record<ToastPosition, typeof toasts>);

  const positions: ToastPosition[] = ['default', 'split'];

  return (
    <>
      {positions.map((position) => {
        const positionToasts = toastsByPosition[position] || [];
        const wrapperClassName =
          position === 'split'
            ? 'pointer-events-none fixed bottom-10 left-0 right-0 flex justify-center px-8 md:bottom-24 md:left-[648px] md:w-[calc(100vw-648px)] md:right-auto md:px-4 lg:px-0.5'
            : undefined;

        const viewportClassName = position === 'split' ? 'pointer-events-auto w-full' : undefined;

        return (
          <ToastProvider key={position}>
            <div className={wrapperClassName}>
              {positionToasts.map(function ({ id, title, description, action, ...props }) {
                return (
                  <Toast key={id} {...props}>
                    <div className="flex items-center gap-2 grow min-w-0 box-shadow: 0 0 13px 0 rgba(12, 17, 29, 0.08)">
                      <Check className="size-5 text-[#f6f6ea] shrink-0" />
                      <div className="flex flex-col gap-0.5 min-w-0 grow">
                        {title && <ToastTitle>{title}</ToastTitle>}
                        {description && <ToastDescription>{description}</ToastDescription>}
                      </div>
                    </div>
                    {action}
                    <ToastClose />
                  </Toast>
                );
              })}
              <ToastViewport position={position} className={viewportClassName} />
            </div>
          </ToastProvider>
        );
      })}
    </>
  );
}
