"use client";
import { useUser } from "@/lib/utils";
import { MessageCircle, Settings, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  if (pathname === "/sign-in" || pathname === "/sign-up") return null;

  return (
    <div className="flex h-screen flex-col border-r">
      <div className="px-5 py-6">
        <div className="size-10 rounded-full bg-bg-200"></div>
      </div>
      <div className="mx-5 border-t" />
      <div className="flex flex-grow flex-col gap-2 px-3 py-5">
        <p className="sh-xs py-1 text-center text-text-400">Main</p>
        <nav className="flex flex-col gap-1 px-2.5">
          <Link
            href="/"
            className={`relative rounded-8 p-2 transition-all ${pathname === "/" ? "bg-bg-50 text-main-base after:absolute after:-left-[calc(1.125rem+4px)] after:top-2 after:h-5 after:w-1 after:rounded-r-4 after:bg-main-base" : "text-text-600 hover:bg-bg-50"}`}
          >
            <MessageCircle size={20} />
          </Link>
          <Link
            href="/friends"
            className={`relative rounded-8 p-2 transition-all ${pathname === "/friends" ? "bg-bg-50 text-main-base after:absolute after:-left-[calc(1.125rem+4px)] after:top-2 after:h-5 after:w-1 after:rounded-r-4 after:bg-main-base" : "text-text-600 hover:bg-bg-50"}`}
          >
            <User2 size={20} />
          </Link>
          <Link
            href="/settings"
            className={`relative rounded-8 p-2 transition-all ${pathname === "/settings" ? "bg-bg-50 text-main-base after:absolute after:-left-[calc(1.125rem+4px)] after:top-2 after:h-5 after:w-1 after:rounded-r-4 after:bg-main-base" : "text-text-600 hover:bg-bg-50"}`}
          >
            <Settings size={20} />
          </Link>
        </nav>
      </div>
      <div className="mx-5 border-t" />
      <div className="px-5 py-6">
        <div className="relative size-10 rounded-full bg-bg-200">
          {user?.image_url ? (
            <Image
              src={user.image_url}
              alt={`${user.username}'s profile picture`}
              fill
              sizes="2.5rem"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
