import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PERSON_INFO, SITE_INFO } from "@/data/site-data";

export const metadata: Metadata = {
  title: {
    default: `${SITE_INFO.name} — 土豆女神 @${PERSON_INFO.xUsername} 非官方粉丝应援站`,
    template: `%s · ${SITE_INFO.name}（非官方粉丝站）`,
  },
  description:
    "为 X 账号 @poteto（土豆女神）打 Call 的非官方民间粉丝应援站：公开照片与舞台封面、AI Engineer 演讲视频打卡、博客短导读与文章打卡、每月 2000 PR 非官方粉丝挑战与应援墙。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
