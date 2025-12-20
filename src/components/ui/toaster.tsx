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
        return (
          <ToastProvider key={position}>
            {positionToasts.map(function ({ id, title, description, action, ...props }) {
              return (
                <Toast key={id} {...props}>
                  <div className="flex items-center gap-1 grow box-shadow: 0 0 13px 0 rgba(12, 17, 29, 0.08)">
                    <Check className="size-5 text-[#f6f6ea] shrink-0" />
                    {title && <ToastTitle>{title}</ToastTitle>}
                    {description && <ToastDescription>{description}</ToastDescription>}
                  </div>
                  {action}
                  <ToastClose />
                </Toast>
              );
            })}
            <ToastViewport position={position} />
          </ToastProvider>
        );
      })}
    </>
  );
}
