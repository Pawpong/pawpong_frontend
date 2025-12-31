import SmallDot from '@/assets/icons/small-dot.svg';

interface InfoRowProps {
  text: string;
}

export function InfoRow({ text }: InfoRowProps) {
  return (
    <div className="flex gap-1 items-start">
      <SmallDot />
      <p className="text-caption font-medium text-grayscale-gray5">{text}</p>
    </div>
  );
}
