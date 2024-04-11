import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import RQProvider from "@/lib/RQProvider";
import { Toaster } from "@/components/primitives/toast/Toaster";
import { Suspense } from "react";
import Loading from "@/components/primitives/Loading";

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
  metadataBase: new URL("https://memo.ambe.dev"),
  appleWebApp: {
    title: "memo",
    capable: true,
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} relative flex h-screen flex-col-reverse text-text-950 sm:flex-row`}
      >
        <Suspense fallback={<Loading isLoading={true} />}>
          <RQProvider>
            <Toaster />
            <Sidebar />
            {children}
          </RQProvider>
        </Suspense>
      </body>
    </html>
  );
}
