"use client";

import Logo from "@/assets/logo/logo";
import { Button } from "../ui/button";

export default function LogoButton() {
  return (
    <Button
      variant={"ghost"}
      className="py-2 -mx-3 -my-2 h-auto has-[>svg]:px-2"
      onClick={() => {
        location.reload();
      }}
    >
      <Logo className="w-20 h-auto text-primary" />
    </Button>
  );
}
