interface BreederInfoProps {
  breederName: string;
  applicationDate?: string;
  nameWidth?: string;
  className?: string;
  hideDate?: boolean;
}

export default function BreederInfo({
  breederName,
  applicationDate,

  className = '',
  hideDate = false,
}: BreederInfoProps) {
  return (
    <div className={`flex flex-col items-start ${className}`}>
      <div className="flex gap-2 items-center">
        <p className={`text-body-l font-semibold text-primary-500 `}>{breederName}</p>
      </div>
      {applicationDate && !hideDate && (
        <p className="text-body-s font-normal text-grayscale-gray5 whitespace-nowrap">{applicationDate}</p>
      )}
    </div>
  );
}
