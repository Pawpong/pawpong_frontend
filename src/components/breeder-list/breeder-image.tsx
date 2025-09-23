import Image from "next/image";

export default function BreederImage({ src }: { src: string }) {
  return (
    <div className="relative w-full h-[224px]  @xl:w-auto @xl:h-56 @xl:aspect-square @3xl:aspect-[432/224] overflow-hidden rounded-lg ">
      <Image src={src} alt="Breeder Image" fill className="object-cover" />
    </div>
  );
}
