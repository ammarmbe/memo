"use client";
import Link from "next/link";
import { useActive, useUser } from "@/lib/utils";
import { InfiniteData, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../primitives/Loading";
import Image from "next/image";
import FindFriends from "./FindFriends";
import { useEffect } from "react";
import PusherClient from "pusher-js";

const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
  cluster: "eu",
});

function chatsUpdater(
  old:
    | {
        username: string;
        image_url: string;
        id: number;
        created_at: string;
        message: string;
      }[]
    | undefined,
  d: {
    id: number;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: string;
    username: string;
    image_url: string;
  },
  active: string,
) {
  const index = old?.findIndex((o) => o.id.toString() === active);

  if (index !== -1) {
    return old?.map((o) =>
      o.id.toString() === active ? { ...o, message: d.content } : o,
    );
  } else {
    return old?.unshift({
      username: d.username,
      image_url: d.image_url,
      id: parseInt(active),
      created_at: d.created_at,
      message: d.content,
    });
  }
}

function messagesUpdater(
  data:
    | InfiniteData<
        {
          id: string;
          content: string;
          created_at: string;
          sender_id: number;
          receiver_id: number;
        }[],
        unknown
      >
    | undefined,
  d: {
    id: number;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: string;
    username: string;
    image_url: string;
  },
) {
  const newFirstPage = [d];

  return {
    pageParams: data?.pageParams,
    pages: [newFirstPage, ...(data?.pages ?? [])],
  };
}

export default function Sidebar() {
  const active = useActive();
  const { user } = useUser();
  const queryClient = useQueryClient();

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

  useEffect(() => {
    const current = active.current;

    if (!current || !user) {
      return;
    }

    const channel = pusher
      .subscribe(`${current}_${user.id}`)
      .bind(
        "message",
        async (d: {
          id: number;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at: string;
          username: string;
          image_url: string;
        }) => {
          queryClient.setQueryData(
            ["messages"],
            (
              data:
                | InfiniteData<
                    {
                      id: string;
                      content: string;
                      created_at: string;
                      sender_id: number;
                      receiver_id: number;
                    }[],
                    unknown
                  >
                | undefined,
            ) => messagesUpdater(data, d),
          );

          queryClient.setQueryData(
            ["chats"],
            (
              old:
                | {
                    username: string;
                    image_url: string;
                    id: number;
                    created_at: string;
                    message: string;
                  }[]
                | undefined,
            ) => chatsUpdater(old, d, current),
          );
        },
      );

    return () => {
      channel.unbind();
    };
  }, [active, queryClient, user]);

  return (
    <div
      className={`h-screen w-full flex-col gap-5 p-5 sm:w-[250px] sm:border-r ${!active.current ? "flex" : "hidden sm:flex"}`}
    >
      <div className="flex items-center justify-between sm:flex-col sm:items-start sm:justify-normal sm:gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="sm:label-lg label-md">memo</h2>
          <p className="pg-sm text-text-600">Chat with your friends.</p>
        </div>
        <FindFriends />
      </div>
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
              <div className="relative size-9 flex-none overflow-hidden rounded-full bg-bg-200">
                {friend.image_url ? (
                  <Image
                    src={friend.image_url}
                    alt={friend.username}
                    className="rounded-full"
                    fill
                    sizes="2.25rem"
                    quality={100}
                  />
                ) : null}
              </div>
              <div className="flex min-w-0 flex-grow flex-col">
                <p className="label-sm">{friend.username}</p>
                <p className="pg-xs min-w-0 truncate text-text-600">
                  {friend.message}
                </p>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
