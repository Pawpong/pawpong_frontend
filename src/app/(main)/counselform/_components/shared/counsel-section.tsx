'use client';

import { useFormContext } from 'react-hook-form';
import { CounselQuestion } from './counsel-question';
import type { SectionConfig, QuestionMode } from '../../_constants/counsel-questions.constants';
import type { CounselFormData } from '../../_types/counsel';

interface CounselSectionProps {
  section: SectionConfig;
  mode: QuestionMode;
  formData?: Record<string, any>;
  availablePets?: Array<{ petId: string; name: string; breed: string; gender: 'male' | 'female' }>;
  onFormatPhone?: (value: string) => string;
  readonlyVariant?: 'default' | 'white'; // readonly 모드에서 배경색 분기: default = rgba(255,255,255,0.40), white = bg-white
}

/**
 * CounselSection - 섹션 래퍼
 * map 기반으로 질문들을 렌더링
 */
export function CounselSection({
  section,
  mode,
  formData: externalFormData,
  availablePets,
  onFormatPhone,
  readonlyVariant = 'default',
}: CounselSectionProps) {
  const formContext = mode === 'editable' ? useFormContext<CounselFormData>() : null;
  const formData = mode === 'editable' && formContext ? formContext.watch() : externalFormData;

  const getQuestionValue = (question: SectionConfig['questions'][0]) => {
    if (question.customComponent === 'basic-info') {
      return formData ? { name: formData.name, phone: formData.phone, email: formData.email } : undefined;
    }
    if (question.customComponent === 'pet-selection') {
      const animalArray = formData?.interestedAnimal
        ? Array.isArray(formData.interestedAnimal)
          ? formData.interestedAnimal
          : [formData.interestedAnimal]
        : [];
      // readonly 모드를 위해 배열을 객체로 변환 (ReadonlyFieldRenderer가 기대하는 형식)
      const animalObject = animalArray.reduce(
        (acc, val, idx) => {
          acc[idx] = val;
          return acc;
        },
        {} as Record<number, string>,
      );
      return formData ? { ...animalObject, details: formData.interestedAnimalDetails || '' } : undefined;
    }
    return formData ? formData[question.id] : undefined;
  };

  return (
    <div className="flex flex-col w-full">
      {/* 섹션 제목과 설명을 하나의 그룹으로 */}
      {(section.title || section.description) && (
        <div className="flex flex-col gap-[0.38rem] w-full mb-8">
          {section.title && <h2 className="text-body-l font-semibold text-grayscale-gray6 w-full">{section.title}</h2>}
          {section.description && (
            <p className="text-body-s font-medium text-grayscale-gray5 w-full">{section.description}</p>
          )}
        </div>
      )}

      {/* 질문들 - map 기반 렌더링 */}
      <div className="flex flex-col gap-8 w-full">
        {section.questions.map((question) => (
          <CounselQuestion
            key={question.id}
            question={question}
            mode={mode}
            value={getQuestionValue(question)}
            availablePets={availablePets}
            onFormatPhone={onFormatPhone}
            formData={formData}
            readonlyVariant={readonlyVariant}
          />
        ))}
      </div>
    </div>
  );
}
