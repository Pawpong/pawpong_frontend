import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './global.css';
import { Toaster } from '@/components/ui/toaster';
import { QueryProvider } from '@/providers/query-provider';

const pretendard = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: '포퐁(Pawpong) | 반려동물 브리더와 입양자를 연결해요',
  description:
    '믿을 수 있는 전문 브리더의 강아지·고양이를 한 곳에서 만나보세요.\n브리더 정보부터 입양 가능한 아이, 상담과 후기까지 투명하게 확인할 수 있어요.',
  icons: {
    icon: '/images/favicon.ico',
    shortcut: '/images/favicon.ico',
    apple: '/images/favicon.ico',
  },
  openGraph: {
    title: '포퐁(Pawpong) | 반려동물 브리더와 입양자를 연결해요',
    description:
      '믿을 수 있는 전문 브리더의 강아지·고양이를 한 곳에서 만나보세요.\n브리더 정보부터 입양 가능한 아이, 상담과 후기까지 투명하게 확인할 수 있어요.',
    images: [
      {
        url: '/images/open-graph.png',
        width: 1200,
        height: 630,
        alt: '포퐁(Pawpong)',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '포퐁(Pawpong) | 반려동물 브리더와 입양자를 연결해요',
    description:
      '믿을 수 있는 전문 브리더의 강아지·고양이를 한 곳에서 만나보세요.\n브리더 정보부터 입양 가능한 아이, 상담과 후기까지 투명하게 확인할 수 있어요.',
    images: ['/images/open-graph.png'],
  },
  verification: {
    google: 'QkaaoP-i1GL-IFK9fxAfMKa-csvd-ufMxiN5KOWafB4',
    other: {
      'naver-site-verification': '6a2ee16f52ebf338c18bc6b7c5a9a7b1b394e3e0',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable}  ${pretendard.className} break-keep`}>
      <body className={`${pretendard.variable}  ${pretendard.className} antialiased`}>
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
