import Image from 'next/image';

export default function EmptyReviewsState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-10 ">
      <div className="flex flex-col gap-7">
        <div className="flex justify-center">
          <Image src="/dog-and-cat.svg" alt="강아지와 고양이" width={320} height={141} className="w-auto h-auto" />
        </div>
        <p className="text-grayscale-gray5 text-body-l font-semibold">
          아직 등록된 후기가 없어요
        </p>
      </div>
    </div>
  );
}
