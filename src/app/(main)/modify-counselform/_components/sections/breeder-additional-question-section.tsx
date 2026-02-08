import { Button } from '@/components/ui/button';
import Plus from '@/assets/icons/plus';

export default function BreederAdditionalQuestionSection() {
  return (
    <div className="flex flex-col w-full">
      {/* 제목과 설명을 하나의 그룹으로 */}
      <div className="flex flex-col gap-[0.38rem] w-full mb-8">
        <h2 className="text-body-l font-semibold text-grayscale-gray6 w-full">브리더 추가질문</h2>
        <p className="text-body-s font-medium text-grayscale-gray5 w-full">
          브리더가 개별적으로 확인하고 싶은 사항에 답변해 주세요.
        </p>
      </div>
        <div className="flex flex-col w-full gap-8">
          <div className="flex justify-center">
            <Button
              variant="ghost"
              className="bg-tertiary-700 hover:bg-tertiary-800 h-12 gap-1 rounded-full py-2.5 pr-5 pl-3"
            >
              <Plus className="size-5" />
              <span className="text-body-s font-medium text-grayscale-gray6">추가하기</span>
            </Button>
        </div>
      </div>
    </div>
  );
}
