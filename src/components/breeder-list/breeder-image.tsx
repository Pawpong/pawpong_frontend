import Image from 'next/image';

const DEFAULT_IMAGE = '/placeholder-breeder.png';

export default function BreederImage({ src }: { src: string }) {
  const imageSrc = src || DEFAULT_IMAGE;

  return (
    <div className="relative w-full h-[224px]  @xl:w-auto @xl:h-56 @xl:aspect-square @4xl:aspect-[432/224] overflow-hidden rounded-lg ">
      <Image src={imageSrc} alt="Breeder Image" fill className="object-cover" />
    </div>
  );
}
