import Image from "next/image";

export default function BreederImage({ src }: { src: string }) {
  return (
    <div className="relative w-[432px] h-[224px] overflow-hidden rounded-lg">
      <Image src={src} alt="Breeder Image" fill className="object-cover" />
    </div>
  );
}
