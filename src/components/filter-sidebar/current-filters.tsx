import Close from '@/assets/icons/close';
import { cn } from '@/api/utils';
import { Button } from '../ui/button';
import { KOREA_DISTRICTS } from '@/constants/districts';
import { useMemo } from 'react';

// 모든 필터의 정렬 순서를 정의
const FILTER_ORDER = [
  // 입양 상태
  '입양 가능',
  // 품종 (고양이)
  '장모', '시베리안', '브리티쉬 롱헤어', '메인쿤', '노르웨이숲', '랙돌', '페르시안', '엑조틱', '소말리',
  '단모', '아비시니안', '아메리칸 숏헤어', '뱅갈', '브리티쉬 숏헤어', '데본 렉스', '유러피언 버미즈', '러시안 블루', '스코티시 폴드', '싱가푸라', '샴', '스핑크스', '코니시 렉스', '봄베이',
  // 품종 (강아지)
  '소형견', '비숑프리제', '닥스훈트', '토이·미니어처 푸들', '치와와', '포메라니안', '말티즈', '요크셔테리어', '미니어처 슈나우저', '화이트 테리어(웨스티)', '페키니즈', '알래스칸 클리카이', '시츄', '퍼그', '하바네즈', '아펜핀셔', '기타 소형견',
  '중형견', '시베리안 허스키', '보더콜리', '웰시코기', '미디엄·스탠다드 푸들', '셔틀랜드 쉽독(셸티)', '이탈리안 그레이하운드', '코카 스파니엘', '프렌치 불독', '꼬똥 드 툴레아', '베들링턴 테리어', '보스턴 테리어', '시바견', '휘핏', '골든두들',
  '대형견', '골든 리트리버', '래브라도 리트리버', '알래스칸 말라뮤트', '진돗개', '풍산개', '차우차우', '도베르만', '사모예드', '러프 콜리', '말라뮤트', '셰퍼드', '아메리칸 불리', '아프간하운드',
  // 지역 (KOREA_DISTRICTS 순서)
  ...KOREA_DISTRICTS.flatMap(district => [district.province, ...district.cities]),
];

// --- 수정: props 타입 정의 및 onRemove 추가 ---
type CurrentFiltersProps = {
  selectedLeaves?: string[];
  onRemove?: (filter: string) => void;
};

export default function CurrentFilters({
  className,
  selectedLeaves,
  onRemove,
}: CurrentFiltersProps & React.ComponentProps<'div'>) {
  // 필터를 정해진 순서대로 정렬
  const sortedFilters = useMemo(() => {
    if (!selectedLeaves) return [];
    return [...selectedLeaves].sort((a, b) => {
      const indexA = FILTER_ORDER.indexOf(a);
      const indexB = FILTER_ORDER.indexOf(b);
      // 순서에 없는 항목은 맨 뒤로
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [selectedLeaves]);

  return (
    <div className={cn(`flex flex-wrap gap-2`, className)}>
      {sortedFilters.map((filter) => (
        <Button
          variant="filter"
          key={filter}
          size="sm"
          className="h-auto py-1.5 px-3 gap-2"
          // --- 수정: onClick 이벤트 핸들러 추가 ---
          // onRemove 함수가 있을 경우에만 실행합니다.
          onClick={() => onRemove?.(filter)}
        >
          {filter}
          <Close className="size-4" />
        </Button>
      ))}
    </div>
  );
}
