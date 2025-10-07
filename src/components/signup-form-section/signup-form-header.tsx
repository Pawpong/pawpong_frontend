import { ComponentProps } from "react";

export default function SignupFormHeader(props: ComponentProps<"div">) {
  return <div className="flex flex-col items-center gap-3" {...props} />;
}
