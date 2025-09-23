import Menu from "@/assets/icons/menu";
import { Button } from "../ui/button";

export default function NavButton() {
  return (
    <Button variant="ghost" size="icon" className="size-9 -m-1.5">
      <div className="flex items-center justify-center size-6">
        <Menu className="size-5" />
      </div>
    </Button>
  );
}
