import Container from "../ui/container";
import LogoButton from "./logo-button";
import NavBar from "./nav-bar";
import NoticeButton from "./notice-button";

export default function Gnb() {
  return (
    <Container className="h-16 flex items-center justify-between ">
      <LogoButton />
      <NavBar />
      <NoticeButton />
    </Container>
  );
}
