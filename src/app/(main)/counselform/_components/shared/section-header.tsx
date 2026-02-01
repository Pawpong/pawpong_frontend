interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-start w-full gap-1.5">
      <h2 className="text-body-l font-semibold text-grayscale-gray7 w-full">{title}</h2>
      {subtitle && <p className="text-body-s font-medium text-grayscale-gray5">{subtitle}</p>}
    </div>
  );
}
