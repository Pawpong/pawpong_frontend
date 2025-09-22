import Container from "../ui/container";
import LogoButton from "./logo-button";
import NavBar from "./nav-bar";
import NoticeButton from "./notice-button";

export default function Gnb() {
  return (
    <Container className="h-[var(--gnb-height)] flex items-center justify-between fixed top-0 left-0 right-0 bg-white z-50 ">
      <LogoButton />
      <NavBar />
      <NoticeButton />
    </Container>
  );
}
