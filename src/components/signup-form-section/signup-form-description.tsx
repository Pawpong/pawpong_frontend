import { ComponentProps } from 'react';

export default function SignupFormDescription({ children }: ComponentProps<'div'>) {
  return (
    <div className="text-body-m font-medium text-grayscale-gray6 text-center break-keep text-balance">{children}</div>
  );
}
