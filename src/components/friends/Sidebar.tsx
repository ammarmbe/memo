"use client";
import Link from "next/link";
import FindFriends from "./FindFriends";
import { useUser } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Loading from "../primitives/Loading";
import Image from "next/image";

export default function Sidebar() {
  const { user } = useUser();

  const { data, isFetching } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const res = await fetch("/api/friends");
      return res.json() as Promise<
        {
          username: string;
          image_url: string;
          id: number;
        }[]
      >;
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex h-screen min-w-[250px] flex-col gap-5 border-r p-5">
      <div className="flex flex-col gap-1">
        <h2 className="label-lg">Friends</h2>
        <p className="pg-sm text-text-600">Your list of friends.</p>
      </div>
      <FindFriends />
      <div className="border-t" />
      <div className="flex flex-grow flex-col gap-2">
        <p className="sh-xs py-1 text-text-400">Friends</p>
        <nav className="relative flex flex-grow flex-col gap-1">
          <Loading isLoading={isFetching} size={32} />
          {data?.map((friend) => (
            <Link
              key={friend.id}
              href={`/?active=${friend.id}`}
              className="relative flex items-center gap-2 rounded-8 p-2 text-text-600 transition-all hover:bg-bg-50"
            >
              <div className="size-6 rounded-full bg-bg-200">
                {friend.image_url ? (
                  <Image
                    src={friend.image_url}
                    alt={friend.username}
                    fill
                    sizes="1.5rem"
                  />
                ) : null}
              </div>
              {friend.username}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
