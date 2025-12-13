import ErrorIcon from '@/assets/icons/error';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex gap-0.5 text-status-error-500 text-caption-s">
      <div className="size-3 flex justify-center items-center">
        <ErrorIcon className="h-2.5 w-2.5" />
      </div>
      {message}
    </div>
  );
}
