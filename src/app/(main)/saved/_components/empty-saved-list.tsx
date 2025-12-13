import DogAndCat from '@/assets/icons/dog-and-cat.svg';

import ExploreButton from './explore-button';
export default function EmptySavedList() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-[var(--space-40)]">
      <div className="flex flex-col gap-[var(--space-28)]">
        <DogAndCat />
        <p className="text-[var(--color-grayscale-gray5)] text-body-l font-semibold line-height-body-l">
          아직 찜한 브리더가 없어요
        </p>
      </div>
      <ExploreButton />
    </div>
  );
}
