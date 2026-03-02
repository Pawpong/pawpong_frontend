import InquiryAnswer from '../../_components/inquiry-answer';
import type { Inquiry } from '../../_types/inquiry';
import InquiryWaitingAnswer from './inquiry-waiting-answer';

interface InquiryDetailAnswersProps {
  inquiry: Inquiry;
}

export default function InquiryDetailAnswers({ inquiry }: InquiryDetailAnswersProps) {
  const hasAnswers = inquiry.answerCount > 0 && (inquiry.answers?.length ?? 0) > 0;
  const answers = inquiry.answers ?? (inquiry.latestAnswer ? [inquiry.latestAnswer] : []);

  if (!hasAnswers) {
    return (
      <section className="w-full max-w-[41.25rem] mx-auto py-20">
        <InquiryWaitingAnswer />
      </section>
    );
  }

  return (
    <section className="w-full max-w-[41.25rem] mx-auto py-20">
      <div className="flex flex-col gap-[3.75rem]">
        {answers.map((answer, index) => (
          <div key={answer.id ?? `${answer.breederName}-${answer.answeredAt}-${index}`} className="flex flex-col gap-[3.75rem]">
            <InquiryAnswer inquiryId={inquiry.id} answer={answer} />
            {index < answers.length - 1 ? <div className="h-[0.0625rem] bg-grayscale-gray2" aria-hidden /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
