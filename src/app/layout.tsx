import type { Metadata } from "next";
import localFont from "next/font/local";
import "./global.css";

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
      className={`${pretendard.variable}  ${pretendard.className} break-keep`}
    >
      <body
        className={`${pretendard.variable}  ${pretendard.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
