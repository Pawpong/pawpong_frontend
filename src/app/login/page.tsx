import Container from "@/components/ui/container";
import LoginSection from "./_components/login-section";

export default function Login() {
  return (
    <Container className="grid grid-cols-2 gap-padding h-[calc(100vh-(--spacing(16)))]">
      {/* 왼쪽 이미지 */}
      <div className="h-full w-full pt-4 pb-padding">
        <div className="relative pl-12 pb-10 bg-primary-600 h-full" />
      </div>

      {/* 오른쪽 콘텐츠 */}
      <div className="flex items-center justify-center">
        <LoginSection />
      </div>
    </Container>
  );
}
