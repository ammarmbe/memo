"use client";
import Friends from "@/components/friends/Friends";
import Sidebar from "@/components/friends/Sidebar";

export default function Page() {
  return (
    <main className="flex flex-grow">
      <Sidebar />
      <Friends />
    </main>
  );
}
