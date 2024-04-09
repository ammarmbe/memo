import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = localFont({
  src: [
    {
      path: "../../public/InterVariable.ttf",
      style: "normal",
    },
    {
      path: "../../public/InterVariable-Italic.ttf",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "Memo",
  description: "Chat with your friends on Memo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
