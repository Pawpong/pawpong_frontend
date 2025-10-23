export default function Breeder(props: React.ComponentProps<"div">) {
  return (
    <div
      className="flex @xl:flex-row gap-gutter justify-between flex-col-reverse my-6"
      {...props}
    />
  );
}
