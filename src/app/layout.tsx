import Gnb from "@/components/gnb/gnb";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: "../assets/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "포퐁",
  description: "포퐁 페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable}  ${pretendard.className}`}
    >
      <body
        className={`${pretendard.variable}  ${pretendard.className} antialiased`}
      >
        <Gnb />
        {children}
      </body>
    </html>
  );
}
