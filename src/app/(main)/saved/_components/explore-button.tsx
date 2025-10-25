import ReadingGlasses from "@/assets/icons/reading-glasses.svg";

interface ExploreButtonProps {
  onClick?: () => void;
}

const ExploreButton = ({ onClick }: ExploreButtonProps) => {
  return (
    <button className="button-explore" onClick={onClick}>
      <ReadingGlasses />
      브리더 탐색하기
    </button>
  );
};

export default ExploreButton;
