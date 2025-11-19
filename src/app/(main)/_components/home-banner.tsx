const HomeBanner = () => {
  return (
    <div className="w-full  h-[20rem] md:h-[20rem] lg:h-[30rem] flex items-center justify-center text-center">
      <div className="space-y-4">
        <p className="text-heading-2 md:text-heading-1 font-semibold text-[#ff3b30]">
          메인배너 영역
        </p>
        <p className="text-body-m md:text-body-l text-[#ff3b30]">
          (이미지로 구성, 클릭 시 링크 연결(*인스타 연결 예정))
        </p>
      </div>
    </div>
  );
};

export default HomeBanner;
