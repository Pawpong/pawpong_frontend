import ReadingGlasses from '@/assets/icons/reading-glasses.svg';
import Link from 'next/link';

const ExploreButton = () => {
  return (
    <Link href="/explore">
      <button className="button-explore">
        <ReadingGlasses />
        브리더 탐색하기
      </button>
    </Link>
  );
};

export default ExploreButton;
