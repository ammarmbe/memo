"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import Button from "../primitives/Button";
import { useActive, useUser } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Loading from "../primitives/Loading";
import Image from "next/image";

export default function Sidebar() {
  const active = useActive();
  const { user } = useUser();

  const { data, isFetching } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await fetch("/api/chats");
      return res.json() as Promise<
        {
          username: string;
          image_url: string;
          id: number;
          created_at: string;
          message: string;
        }[]
      >;
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex h-screen min-w-[250px] flex-col gap-5 border-r p-5">
      <div className="flex flex-col gap-1">
        <h2 className="label-lg">memo</h2>
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
        <nav className="relative flex flex-grow flex-col gap-1">
          <Loading isLoading={isFetching} size={32} />
          {data?.map((friend) => (
            <Link
              key={friend.id}
              href={`/?active=${friend.id}`}
              className={`relative flex items-center gap-2 rounded-8 p-2 transition-all ${active.current === friend.id.toString() ? "bg-bg-50 text-main-base" : "text-text-600 hover:bg-bg-50"}`}
            >
              <div className="size-9 rounded-full bg-bg-200">
                {friend.image_url ? (
                  <Image
                    src={friend.image_url}
                    alt={friend.username}
                    className="rounded-full"
                    fill
                    sizes="2.25rem"
                  />
                ) : null}
              </div>
              <div className="flex flex-col">
                <p className="label-sm">{friend.username}</p>
                <p className="pg-xs text-text-600">{friend.message}</p>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
