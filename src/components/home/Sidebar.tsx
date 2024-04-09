"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import Button from "../primitives/Button";
import { useActive } from "@/lib/utils";

export default function Sidebar() {
  const active = useActive();

  return (
    <div className="flex h-screen min-w-[250px] flex-col gap-5 border-r p-5">
      <div className="flex flex-col gap-1">
        <h2 className="label-lg">Memo</h2>
        <p className="pg-sm text-text-600">Chat with your friends.</p>
      </div>
      <Button
        size="md"
        variant="neutral_stroke"
        text="New Chat"
        href="/friends"
        icon_left={<Plus size={20} />}
      />
      <div className="border-t" />
      <div className="flex flex-grow flex-col gap-2">
        <p className="sh-xs py-1 text-text-400">Recent Chats</p>
        <nav className="flex flex-col gap-1">
          <Link
            href="/?active=1"
            className={`relative flex items-center gap-2 rounded-8 p-2 transition-all ${active.current === "1" ? "bg-bg-50 text-main-base" : "text-text-600 hover:bg-bg-50"}`}
          >
            <div className="size-5 rounded-full bg-bg-200" />
            Name
          </Link>
          <Link
            href="/?active=2"
            className={`relative flex items-center gap-2 rounded-8 p-2 transition-all ${active.current === "2" ? "bg-bg-50 text-main-base" : "text-text-600 hover:bg-bg-50"}`}
          >
            <div className="size-5 rounded-full bg-bg-200" />
            Name
          </Link>
        </nav>
      </div>
    </div>
  );
}
