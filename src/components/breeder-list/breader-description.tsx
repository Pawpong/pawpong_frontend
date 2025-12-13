export default function BreederDescription({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className="mb-2 flex flex-row sm:flex-col lg:flex-row items-center sm:items-start lg:items-center gap-2 sm:gap-0 lg:gap-2"
      {...props}
    />
  );
}
