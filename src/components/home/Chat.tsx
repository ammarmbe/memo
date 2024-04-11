"use client";
import InfiniteScroll from "react-infinite-scroll-component";
import { useActive } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

export default function Chat() {
  const active = useActive();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["messages", active.current],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(
        `/api/messages?id=${active.current}&created_at=${pageParam}`,
      );
      return res.json() as Promise<
        {
          id: string;
          content: string;
          created_at: string;
          sender_id: number;
          receiver_id: number;
        }[]
      >;
    },
    enabled: !!active.current,
    initialPageParam: new Date().toISOString(),
    getNextPageParam: (lastPage) => {
      if (lastPage?.length >= 20) {
        return lastPage[lastPage.length - 1].created_at;
      }
      return undefined;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return (
    <div
      id="scrollableDiv"
      className="flex flex-col-reverse overflow-auto p-4 pb-0"
    >
      <InfiniteScroll
        next={fetchNextPage}
        dataLength={data?.pages.flatMap((page) => page).length || 0}
        className="flex flex-grow flex-col-reverse gap-1"
        hasMore={hasNextPage || false}
        loader={
          <div className="mx-auto flex w-fit items-center justify-center gap-1.5 p-1">
            <div className="size-2.5 animate-pulse rounded-full bg-bg-200 duration-500" />
            <div className="size-2.5 animate-pulse rounded-full bg-bg-200 delay-100 duration-500" />
            <div className="size-2.5 animate-pulse rounded-full bg-bg-200 delay-200 duration-500" />
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        {data?.pages.map((page) =>
          page.map((message) =>
            message.sender_id.toString() === active.current ? (
              <div
                key={message.id}
                className="pg-sm flex items-baseline gap-2 self-start rounded-8 rounded-bl-0 bg-main-base px-3 py-2 text-white"
              >
                <p className="sh-xxs flex-none text-main-16">
                  {new Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }).format(new Date(message.created_at))}
                </p>
                <p>{message.content}</p>
              </div>
            ) : (
              <div
                key={message.id}
                className="pg-sm flex items-baseline gap-2 self-end rounded-8 rounded-br-0 bg-bg-200 px-3 py-2"
              >
                <p>{message.content}</p>
                <p className="sh-xxs flex-none text-text-600">
                  {new Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }).format(new Date(message.created_at))}
                </p>
              </div>
            ),
          ),
        )}
      </InfiniteScroll>
    </div>
  );
}
