import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

export default function BreederProfileSectionMore() {
  return (
    <Button type="button" variant="ghost" className="gap-1 p-0 text-grayscale-gray5 text-body-xs">
      <div>더보기</div>
      <ChevronRight className="size-3.5" />
    </Button>
  );
}
