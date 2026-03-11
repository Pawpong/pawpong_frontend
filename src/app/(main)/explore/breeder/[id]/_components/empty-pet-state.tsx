import Image from 'next/image';

interface EmptyPetStateProps {
  message?: string;
}

export default function EmptyPetState({ message = '곧 새로운 아이가 등록될 예정이에요' }: EmptyPetStateProps) {
  return (
    <div className="flex flex-col items-center gap-[1.75rem]">
      <Image src="/dog-and-cat.svg" alt="강아지와 고양이" width={320} height={141} className="w-auto h-auto" />
      <p className="text-grayscale-gray5 text-body-l font-semibold leading-[2rem] text-center">{message}</p>
    </div>
  );
}
