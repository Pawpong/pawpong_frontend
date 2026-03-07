'use client';

import { Button } from '@/components/ui/button';
import { COUNSEL_SUBMIT_BUTTON_LABEL, COUNSEL_SUBMIT_BUTTON_SUBMITTING_LABEL } from '../../_constants/submit-button.constants';

type SubmitButtonProps = {
  isDisabled: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  submitLabel?: string;
  submittingLabel?: string;
};

export default function SubmitButton({
  isDisabled,
  isSubmitting,
  onSubmit,
  submitLabel = COUNSEL_SUBMIT_BUTTON_LABEL,
  submittingLabel = COUNSEL_SUBMIT_BUTTON_SUBMITTING_LABEL,
}: SubmitButtonProps) {
  return (
    <div className="sticky bottom-6 flex w-full justify-center px-8 md:bottom-10 md:px-4 lg:px-0.5">
      <Button
        variant={undefined}
        disabled={isDisabled}
        className="button-edit-default text-primary-500 hover:bg-secondary-600 flex h-12 items-center justify-center min-w-20 px-4 py-3 rounded-lg w-full md:w-[424px] disabled:cursor-not-allowed disabled:text-grayscale-gray4"
        onClick={onSubmit}
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </div>
  );
}
