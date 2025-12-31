interface QuestionBlockProps {
  title: string;
  children: React.ReactNode;
}

export function QuestionBlock({ title, children }: QuestionBlockProps) {
  return (
    <div className="flex flex-col gap-3 items-start w-full">
      <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">{title}</h2>
      {children}
    </div>
  );
}
