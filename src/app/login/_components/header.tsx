import Logo from "@/assets/logo/logo";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";

export default function Header() {
  return (
    <Container className="flex justify-between h-16">
      <Button variant={"ghost"} className="w-20">
        <Logo className="text-point-basic h-6 shrink-0" />
      </Button>
    </Container>
  );
}
