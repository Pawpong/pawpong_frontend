import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function BreederAvatar({ src }: { src: string }) {
  return (
    <Avatar className="size-12 ">
      <AvatarImage src={src} />
      <AvatarFallback></AvatarFallback>
    </Avatar>
  );
}
