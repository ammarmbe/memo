import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import RQProvider from "@/lib/RQProvider";
import { Toaster } from "@/components/primitives/toast/Toaster";

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
  title: "memo",
  description: "Chat with your friends on memo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RQProvider>
          <Toaster />
          <Sidebar />
          {children}
        </RQProvider>
      </body>
    </html>
  );
}
