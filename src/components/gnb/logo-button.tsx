"use client";

import LogoIcon from "@/assets/logo/logo.svg";
import { Button } from "../ui/button";

export default function LogoButton() {
  return (
    <Button
      variant={"ghost"}
      className="py-2 -mx-3 -my-2 h-auto has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-auto"
      onClick={() => {
        location.reload();
      }}
    >
      <LogoIcon />
    </Button>
  );
}
