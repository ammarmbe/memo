"use client";
import { bogart } from "@/lib/utils";
import { LogOut, MessageCircle, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pathname === "/sign-in" || pathname === "/sign-up") return null;

  return (
    <div
      className={`relative z-10 sm:h-screen sm:flex-col sm:border-r ${searchParams.get("active") ? "hidden sm:flex" : "flex"}`}
    >
      <div className="hidden px-5 py-6 sm:block">
        <div className="flex size-10 items-center justify-center">
          <Link
            className={`${bogart.className} text-4xl text-main-base hover:text-main-darker`}
            href="/"
          >
            m
          </Link>
        </div>
      </div>
      <div className="mx-5 hidden border-t sm:block" />
      <div className="flex flex-grow flex-col gap-2 border-t p-3 sm:border-t-0 sm:px-3 sm:py-5">
        <p className="sh-xs hidden py-1 text-center text-text-400 sm:inline-block">
          Main
        </p>
        <nav className="grid grid-cols-3 flex-col gap-2 sm:flex sm:gap-1 sm:px-2.5">
          <Link
            href="/"
            className={`relative flex items-center justify-center rounded-8 p-2 transition-all ${pathname === "/" ? "bg-bg-50 text-main-base after:absolute after:-left-[calc(1.125rem+4px)] after:top-2 after:h-5 after:w-1 after:rounded-r-4 after:bg-main-base after:!content-none sm:after:content-['']" : "text-text-600 hover:bg-bg-50"}`}
          >
            <MessageCircle size={20} />
          </Link>
          <Link
            href="/settings"
            className={`relative flex items-center justify-center rounded-8 p-2 transition-all ${pathname === "/settings" ? "bg-bg-50 text-main-base after:absolute after:-left-[calc(1.125rem+4px)] after:top-2 after:h-5 after:w-1 after:rounded-r-4 after:bg-main-base after:!content-none sm:after:content-['']" : "text-text-600 hover:bg-bg-50"}`}
          >
            <Settings size={20} />
          </Link>
          <button
            onClick={async () => {
              await fetch("/api/auth/sign-out");
            }}
            className={`relative flex items-center justify-center rounded-8 p-2 transition-all sm:hidden ${pathname === "/settings" ? "bg-bg-50 text-main-base after:absolute after:-left-[calc(1.125rem+4px)] after:top-2 after:h-5 after:w-1 after:rounded-r-4 after:bg-main-base after:!content-none sm:after:content-['']" : "text-text-600 hover:bg-bg-50"}`}
          >
            <LogOut size={20} />
          </button>
        </nav>
      </div>
      <div className="mx-5 hidden border-t sm:block" />
      <div className="hidden sm:block sm:px-3 sm:py-5">
        <nav className="sm:px-1.5">
          <button
            onClick={async () => {
              await fetch("/api/auth/sign-out");
            }}
            className="flex items-center justify-center rounded-8 p-3 text-text-600 hover:bg-bg-50"
          >
            <LogOut size={20} />
          </button>
        </nav>
      </div>
    </div>
  );
}
