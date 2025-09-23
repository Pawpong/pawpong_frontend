import { Fragment } from "react";
import { Separator } from "../ui/separator";

export default function BreederList({
  children,
}: {
  children: React.ReactNode[];
}) {
  return (
    <div className="lg:space-y-10 md:space-y-7 space-y-6">
      {children.map((child, index) => (
        <Fragment key={index}>
          {child}
          {index !== children.length - 1 && <Separator />}
        </Fragment>
      ))}
    </div>
  );
}
