import Close from "@/assets/icons/close";
import Logo from "@/assets/logo/logo";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import Link from "next/link";

export default function Header() {
  return (
    <Container
      className="flex justify-between h-16 items-center"
      wrapperClassName="sticky top-0 bg-tertiary-500"
    >
      <Button variant={"ghost"} className="w-20">
        <Logo className="text-primary h-6 shrink-0" />
      </Button>
      <Link href="/">
        <Button
          size="icon"
          variant={"ghost"}
          className="text-primary size-6 hover:text-primary-600! cursor-pointer"
        >
          <Close className="size-3.75" />
        </Button>
      </Link>
    </Container>
  );
}
