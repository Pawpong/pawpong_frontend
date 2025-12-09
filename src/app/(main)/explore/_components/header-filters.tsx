'use client';

import Close from '@/assets/icons/close';
import Location from '@/assets/icons/location';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function HeaderFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const filters = [
    { key: 'adoptable', label: '입양 가능', value: 'true' },
    { key: 'location', label: '현재 위치', value: 'true', icon: Location },
  ];

  const toggleQuery = (key: string, value: string) => {
    const searchParams = new URLSearchParams(params.toString());

    if (searchParams.get(key) === value) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }

    const queryString = searchParams.toString();
    // Update the URL with the new query string, preserving the current path
    router.push(`${pathname}?${queryString}`);
  };

  return (
    <>
      {filters.map((filter) => {
        const isActive = params.get(filter.key) === filter.value;
        return (
          <Button
            key={filter.key}
            onClick={() => toggleQuery(filter.key, filter.value)}
            variant="outline"
            className={cn(
              {
                [buttonVariants({
                  variant: 'default',
                  className: 'border-primary hover:text-point-basic!  ',
                })]: isActive,
              },
              'py-2 px-3 text-body-xs h-auto gap-2',
              { 'pl-2!': filter.icon },
            )}
          >
            <div className="flex items-center gap-1">
              {filter.icon && <filter.icon className="size-5" />}
              {filter.label}
            </div>
            {isActive && <Close className="size-4" />}
          </Button>
        );
      })}
    </>
  );
}
