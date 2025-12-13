import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';
import GridContainer from '../ui/grid-container';

export default function SignupFormItems({ className, children }: ComponentProps<'div'>) {
  return (
    <div>
      <GridContainer>
        <div className={cn('col-span-(--inner-span) col-start-(--inner-start) flex flex-col gap-3', className)}>
          {children}
        </div>
      </GridContainer>
    </div>
  );
}
