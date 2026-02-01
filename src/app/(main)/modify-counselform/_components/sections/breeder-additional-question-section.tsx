import { useState } from 'react';

import { Button } from '@/components/ui/button';
import Plus from '@/assets/icons/plus';
import Trash from '@/assets/icons/trash.svg';

export default function BreederAdditionalQuestionSection() {
  const [questions, setQuestions] = useState<string[]>([]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, '']);
  };

  const handleQuestionChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setQuestions((prev) => prev.map((item, currentIndex) => (currentIndex === index ? value : item)));
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col items-start w-full gap-[0.38rem]">
        <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">브리더 추가질문</h2>
        <div className="flex flex-col w-full gap-8">
          <p className="text-body-xs text-grayscale-gray5">브리더가 개별적으로 확인하고 싶은 사항에 답변해 주세요.</p>
          {questions.length > 0 && (
            <div className="flex flex-col w-full gap-8">
              {questions.map((question, index) => (
                <div key={`breeder-question-${index}`} className="flex flex-col w-full gap-3">
                  <div className="flex items-center justify-between w-full">
                    <p className="text-body-xs font-semibold text-grayscale-gray6">추가 질문 {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(index)}
                      className="flex items-center gap-1 shrink-0 text-grayscale-gray5 hover:opacity-80 transition-opacity"
                    >
                      <Trash className="size-5" />
                      <span className="text-body-xs font-medium leading-body-xs">삭제하기</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={question}
                    onChange={handleQuestionChange(index)}
                    placeholder="질문을 입력해주세요"
                    className="h-12 w-full rounded-[--spacing(2)] bg-white px-4 py-3 text-body-s font-medium text-color-primary-500-basic leading-body-s placeholder:text-grayscale-gray4 focus:outline-none"
                  />
                  <textarea
                    disabled
                    readOnly
                    className="min-h-[200px] w-full resize-none rounded-[--spacing(2)] bg-[var(--Alpha-W-40,rgba(255,255,255,0.40))] px-4 py-3 text-body-s font-medium text-primary-500-basic"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-center">
            <Button
              type="button"
              variant="ghost"
              className="bg-tertiary-700 hover:bg-tertiary-800 h-12 gap-1 rounded-full py-2.5 pr-5 pl-3"
              onClick={handleAddQuestion}
            >
              <Plus className="size-5" />
              <span className="text-body-s font-medium text-grayscale-gray6">추가하기</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
