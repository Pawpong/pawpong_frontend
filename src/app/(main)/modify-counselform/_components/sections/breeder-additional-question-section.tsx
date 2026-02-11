'use client';

import { useState, useEffect, useImperativeHandle, forwardRef, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Plus from '@/assets/icons/plus';
import Trash from '@/assets/icons/trash.svg';
import { useUpdateApplicationFormSimple, useApplicationForm } from '@/app/(main)/profile/application-form/_hooks/use-application-form-simple';
import { toast } from '@/hooks/use-toast';
import { BREEDER_QUESTION_CONSTANTS, BREEDER_QUESTION_MESSAGES } from '../../_constants/breeder-question.constants';
import { validateQuestions, getValidQuestions, hasQuestionChanges, hasValidInput } from '../../_utils/breeder-question-validation';
import type { Question, BreederAdditionalQuestionSectionRef, BreederAdditionalQuestionSectionProps } from '../../_types/breeder-question.types';

const BreederAdditionalQuestionSection = forwardRef<
  BreederAdditionalQuestionSectionRef,
  BreederAdditionalQuestionSectionProps
>(({ onSaveComplete, onStateChange }, ref) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [initialQuestions, setInitialQuestions] = useState<Question[]>([]);
  const { data: formData, isLoading } = useApplicationForm();
  const { mutate: updateForm } = useUpdateApplicationFormSimple();

  // 기존 커스텀 질문 로드
  useEffect(() => {
    if (formData?.customQuestions) {
      const loadedQuestions: Question[] = formData.customQuestions.map((q) => ({
        id: q.id || `temp-${Date.now()}-${Math.random()}`,
        question: q.label || '',
      }));
      setQuestions(loadedQuestions);
      setInitialQuestions(loadedQuestions);
    }
  }, [formData]);

  // 계산된 값들
  const isMaxReached = useMemo(() => questions.length >= BREEDER_QUESTION_CONSTANTS.MAX_QUESTIONS, [questions.length]);
  const hasValidInputValue = useMemo(() => hasValidInput(questions), [questions]);
  const hasChangesValue = useMemo(() => hasQuestionChanges(questions, initialQuestions), [questions, initialQuestions]);

  // 상태 변경 시 상위 컴포넌트에 알림
  useEffect(() => {
    onStateChange?.(hasChangesValue, hasValidInputValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasChangesValue, hasValidInputValue]);

  const handleSave = useCallback((): Promise<void> => {
    // 유효한 질문 필터링
    const validQuestions = getValidQuestions(questions);

    // 검증
    const validationError = validateQuestions(questions);
    if (validationError) {
      toast(validationError);
      return Promise.reject(new Error(validationError.description));
    }

    // API 호출
    return new Promise<void>((resolve, reject) => {
      updateForm(
        {
          questions: validQuestions.map((q) => ({ question: q.question.trim() })),
        },
        {
          onSuccess: (data) => {
            toast(BREEDER_QUESTION_MESSAGES.SAVE_SUCCESS(validQuestions.length));
            // 성공 시 서버에서 반환된 데이터로 업데이트
            if (data.customQuestions) {
              const updatedQuestions: Question[] = data.customQuestions.map((q: { id: string; question: string }) => ({
                id: q.id,
                question: q.question,
              }));
              setQuestions(updatedQuestions);
              setInitialQuestions(updatedQuestions);
            }
            onSaveComplete?.();
            resolve();
          },
          onError: (error: unknown) => {
            let errorMessage: string = BREEDER_QUESTION_MESSAGES.SAVE_ERROR_DEFAULT.description;
            if (error && typeof error === 'object' && 'response' in error) {
              const axiosError = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
              errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || errorMessage;
            } else if (error instanceof Error) {
              errorMessage = error.message;
            }
            toast({
              title: BREEDER_QUESTION_MESSAGES.SAVE_ERROR_DEFAULT.title,
              description: errorMessage,
            });
            reject(new Error(errorMessage));
          },
        },
      );
    });
  }, [questions, updateForm, onSaveComplete]);

  // 외부에서 호출할 수 있도록 저장 함수 노출
  useImperativeHandle(
    ref,
    () => ({
      saveQuestions: handleSave,
      hasChanges: hasChangesValue,
      hasValidInput: hasValidInputValue,
    }),
    [handleSave, hasChangesValue, hasValidInputValue],
  );

  const handleAddQuestion = useCallback(() => {
    if (isMaxReached) {
      toast(BREEDER_QUESTION_MESSAGES.MAX_REACHED);
      return;
    }
    setQuestions((prev) => [...prev, { id: `temp-${Date.now()}-${Math.random()}`, question: '' }]);
  }, [isMaxReached]);

  const handleRemoveQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const handleQuestionChange = useCallback((id: string, value: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, question: value } : q)));
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-[0.38rem] w-full mb-8">
          <h2 className="text-body-l font-semibold text-grayscale-gray6 w-full">브리더 추가질문</h2>
          <p className="text-body-s font-medium text-grayscale-gray5 w-full">
            브리더가 개별적으로 확인하고 싶은 사항에 답변해 주세요.
          </p>
        </div>
        <div className="flex justify-center py-8">
          <p className="text-body-s text-grayscale-gray5">로딩 중...</p>
        </div>
      </div>
    );
  }

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
        {/* 질문 입력 필드들 */}
        {questions.map((q, index) => (
          <div key={q.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col font-semibold justify-center relative shrink-0 text-grayscale-gray6 text-body-xs">
                <p className="leading-body-xs">추가 질문 {index + 1}</p>
              </div>
              {questions.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(q.id)}
                  className="flex gap-1 items-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  aria-label="질문 삭제"
                >
                  <Trash className="size-5" />
                  <p className="font-medium leading-body-xs relative shrink-0 text-grayscale-gray5 text-body-xs text-nowrap">
                    삭제하기
                  </p>
                </button>
              )}
            </div>
            <Input
              placeholder={`질문을 입력해주세요 (${BREEDER_QUESTION_CONSTANTS.MIN_LENGTH}~${BREEDER_QUESTION_CONSTANTS.MAX_LENGTH}자)`}
              value={q.question}
              onChange={(e) => handleQuestionChange(q.id, e.target.value)}
              maxLength={BREEDER_QUESTION_CONSTANTS.MAX_LENGTH}
              className="h-12"
            />
            <Textarea
              value=""
              readOnly
              placeholder=""
              className="min-h-[100px] bg-[rgba(255,255,255,0.40)]"
              wrapperClassName="bg-[rgba(255,255,255,0.40)] rounded-lg"
            />
          </div>
        ))}

        {/* 추가하기 버튼 */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
            className="bg-tertiary-700 hover:bg-tertiary-800 h-12 gap-1 rounded-full py-2.5 pr-5 pl-3 disabled:opacity-50"
            onClick={handleAddQuestion}
            disabled={isMaxReached}
            >
              <Plus className="size-5" />
              <span className="text-body-s font-medium text-grayscale-gray6">추가하기</span>
            </Button>
        </div>

        {isMaxReached && (
          <p className="text-body-s text-grayscale-gray5 text-center">
            최대 {BREEDER_QUESTION_CONSTANTS.MAX_QUESTIONS}개까지만 추가할 수 있습니다.
          </p>
        )}
      </div>
    </div>
  );
});

BreederAdditionalQuestionSection.displayName = 'BreederAdditionalQuestionSection';

export default BreederAdditionalQuestionSection;
