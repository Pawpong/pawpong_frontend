import Cat from "@/assets/icons/cat";
import Dog from "@/assets/icons/dog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface BreederAvatarProps {
  src?: string | null;
  animal?: "cat" | "dog";
}

export default function BreederAvatar({
  src,
  animal = "dog",
}: BreederAvatarProps) {
  return (
    <Avatar className="size-12">
      {src && <AvatarImage src={src} />}
      <AvatarFallback>
        {animal === "cat" ? (
          <Cat className="size-9 text-grayscale-gray5" />
        ) : (
          <Dog className="size-9 text-grayscale-gray5" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
