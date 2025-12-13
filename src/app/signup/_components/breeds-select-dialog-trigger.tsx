'use client';

import Close from '@/assets/icons/close';
import ClearFilters from '@/components/filter-sidebar/clear-filters';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogTrigger } from '@/components/ui/dialog';
import {
  LargeDialog,
  LargeDialogClose,
  LargeDialogContent,
  LargeDialogFooter,
  LargeDialogHeader,
  LargeDialogTitle,
  LargeDialogTrigger,
} from '@/components/ui/large-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { cn } from '@/lib/utils';
import { Animal } from '@/stores/signup-form-store';
import { useState, useEffect } from 'react';
import { getBreeds } from '@/lib/breeds';

interface BreedCategory {
  category: string;
  categoryDescription?: string;
  breeds: string[];
}

export default function BreedsSelectDialogTrigger({
  animal,
  onSubmitBreeds,
  initialValue = [],
  ...props
}: {
  animal: Animal;
  onSubmitBreeds: (value: string[]) => void;
  initialValue?: string[];
} & React.ComponentProps<typeof DialogTrigger>) {
  const isMobile = useBreakpoint('md') === false;
  const [categories, setCategories] = useState<BreedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selected, setSelected] = useState<string[]>(initialValue);

  // Sync with initialValue when it changes
  useEffect(() => {
    setSelected(initialValue);
  }, [initialValue]);

  // API에서 품종 데이터 가져오기
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        setLoading(true);
        const response = await getBreeds(animal);
        setCategories(response.categories);
        if (response.categories.length > 0) {
          setSelectedGroup(response.categories[0].category);
        }
      } catch (error) {
        console.error('품종 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds();
  }, [animal]);

  const clearActiveFilters = () => {
    setSelected([]);
  };

  if (loading) {
    return (
      <LargeDialog>
        <LargeDialogTrigger {...props} />
        <LargeDialogContent className="h-full md:size-150">
          <div className="flex items-center justify-center h-full">
            <p className="text-grayscale-gray5">품종 데이터 로딩 중...</p>
          </div>
        </LargeDialogContent>
      </LargeDialog>
    );
  }

  const currentCategory = categories.find((cat) => cat.category === selectedGroup);

  return (
    <LargeDialog>
      <LargeDialogTrigger {...props} />
      <LargeDialogContent className="h-full md:size-150">
        <LargeDialogHeader className="p-0 md:pt-6 md:px-6 md:pb-2.5 gap-0">
          <LargeDialogTitle className="py-4 px-padding md:p-0">
            <div className="flex justify-between items-center">
              품종
              <LargeDialogClose asChild>
                <Button variant="secondary" className="size-9">
                  <Close className="size-5 text-grayscale-gray-7" />
                </Button>
              </LargeDialogClose>
            </div>
          </LargeDialogTitle>
          {isMobile && (
            <div className="overflow-auto w-full">
              <div className="flex gap-4 px-padding">
                {categories.map(({ category }) => (
                  <Button
                    variant={'ghost'}
                    key={category}
                    className={cn('flex-col gap-2 p-0 text-grayscale-gray5 font-semibold text-body-m', {
                      'text-primary': selectedGroup === category,
                    })}
                    onClick={() => setSelectedGroup(category)}
                  >
                    {category}
                    <div
                      className={cn('h-0.5 w-full bg-transparent', {
                        'bg-primary-500': selectedGroup === category,
                      })}
                    />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </LargeDialogHeader>
        <div className="flex flex-1 min-h-0 h-full ">
          {/* 그룹 컬럼 */}
          {!isMobile && (
            <ScrollArea className="h-full border-r">
              <div className="flex-shrink-0 py-2 pl-3.5 pr-3">
                {categories.map(({ category }) => (
                  <Button
                    key={category}
                    variant={'category'}
                    className={cn('py-2 px-2.5', {
                      'bg-[#F6F6EA]': selectedGroup === category,
                    })}
                    onClick={() => {
                      setSelectedGroup(category);
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
          <ScrollArea className={cn('w-38.25 md:w-auto h-full', 'flex-1')}>
            <div className={cn('flex-shrink-0 py-2 pl-3.5 pr-3', ' pl-5 pr-3.5')}>
              {currentCategory?.breeds.map((breed) => (
                <div
                  key={breed}
                  className="py-2 pr-2.5 gap-2 text-body-xs text-grayscale-gray6 flex items-center cursor-pointer"
                  onClick={() =>
                    setSelected((prev) => {
                      const isSelected = prev.includes(breed);
                      if (isSelected) {
                        // 이미 선택된 항목이면 제거
                        return prev.filter((item) => item !== breed);
                      } else {
                        // 새로 선택하려는 항목이 5개 이상이면 막기
                        if (prev.length >= 5) {
                          return prev;
                        }
                        return [...prev, breed];
                      }
                    })
                  }
                >
                  <Checkbox checked={selected.includes(breed)} />
                  <div className="whitespace-wrap">{breed}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <LargeDialogFooter>
          <ClearFilters onClick={clearActiveFilters} />
          <LargeDialogClose asChild>
            <Button
              className="py-2 px-4 text-sm leading-[140%] tracking-[-2%] bg-[#A0C8F4] w-18 text-primary-500!"
              onClick={() => onSubmitBreeds(selected)}
            >
              입력
            </Button>
          </LargeDialogClose>
        </LargeDialogFooter>
      </LargeDialogContent>
    </LargeDialog>
  );
}
