import { ANIMAL_TAB_ITEMS } from '@/components/animal-tab-bar';
import type { InquiryAnswer as InquiryAnswerType } from '../_types/inquiry';
import InquiryDetailImages from '../[id]/_components/inquiry-detail-images';
import InquiryDetailActions from '../[id]/_components/inquiry-detail-actions';
import InquiryAnswerHelpful from './inquiry-answer-helpful';

interface InquiryAnswerProps {
  inquiryId: string | null;
  answer: InquiryAnswerType;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function InquiryAnswer({ inquiryId, answer, onEdit, onDelete }: InquiryAnswerProps) {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-secondary-100 rounded-lg p-5 flex items-center justify-between gap-4 w-full">
        <div className="flex min-w-0 flex-1 gap-4 items-center">
          <div className="relative size-12 bg-white rounded-lg flex items-center justify-center shrink-0">
            {(() => {
              const isCat = answer.animalTypeName === '고양이';
              const animalItem = ANIMAL_TAB_ITEMS.find((item) => item.type === (isCat ? 'cat' : 'dog'));
              const Icon = animalItem?.icon ?? ANIMAL_TAB_ITEMS[0].icon;
              return <Icon className="size-6 text-primary-500" />;
            })()}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-body-l font-semibold text-primary-500 truncate">{answer.breederName}</p>
            {(answer.animalTypeName || answer.breed) && (
              <div className="flex gap-2 items-center text-body-s font-normal text-grayscale-gray5">
                {answer.animalTypeName && <span>{answer.animalTypeName}</span>}
                {answer.animalTypeName && answer.breed && <span aria-hidden>·</span>}
                {answer.breed && <span>{answer.breed}</span>}
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          className="h-8 rounded-lg bg-white pl-3 pr-3 text-body-xs font-normal text-grayscale-gray6 whitespace-nowrap shrink-0"
        >
          입양 신청하기
        </button>
      </div>

      <p className="text-body-m font-medium text-grayscale-gray6 whitespace-pre-wrap">{answer.content}</p>

      {answer.imageUrls && answer.imageUrls.length > 0 && (
        <InquiryDetailImages imageUrls={answer.imageUrls} className="mx-auto" />
      )}

      <div className="flex items-center justify-between w-full gap-4 flex-wrap">
        <span className="text-body-s font-normal text-grayscale-gray5">{answer.answeredAt}</span>
        <div className="flex gap-2 items-center">
          <InquiryAnswerHelpful
            inquiryId={inquiryId}
            answerId={answer.id}
            helpfulCount={answer.helpfulCount ?? 0}
          />
          <InquiryDetailActions onEdit={onEdit} onDelete={onDelete} deleteTarget="answer" />
        </div>
      </div>
    </div>
  );
}
