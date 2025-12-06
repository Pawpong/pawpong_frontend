import FilterDialogTrigger from '../filter-dialog/filter-dialog-trigger';
import { Button } from '../ui/button';

export default function MoreButton(props: React.ComponentProps<typeof Button>) {
  return (
    <FilterDialogTrigger asChild>
      <Button
        variant="ghost"
        className="text-grayscale-gray5! text-sm font-normal tracking-[-2%] leading-[140%] underline hover:no-underline -mx-2.5 -my-1.5"
        {...props}
      >
        더보기
      </Button>
    </FilterDialogTrigger>
  );
}
