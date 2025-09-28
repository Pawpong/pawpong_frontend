export default function Login() {
  return (
    <div className="grid grid-cols-2 h-screen">
      {/* 왼쪽 이미지 */}
      <div className="relative pl-12 pb-10">
        {/* <Image
          src="/login-image.png"
          alt="Login"
          fill
          className="object-cover"
          priority
        /> */}
      </div>

      {/* 오른쪽 콘텐츠 */}
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">로그인 영역</h1>
      </div>
    </div>
  );
}
