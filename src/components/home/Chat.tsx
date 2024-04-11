"use client";
import InfiniteScroll from "react-infinite-scroll-component";
import { useActive, useUser } from "@/lib/utils";
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useEffect } from "react";
import PusherClient from "pusher-js";

const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
  cluster: "eu",
});

export default function Chat() {
  const active = useActive();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ["messages"],
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
            ) => {
              const newFirstPage = [d];

              return {
                pageParams: data?.pageParams,
                pages: [newFirstPage, ...(data?.pages ?? [])],
              };
            },
          );
        },
      );

    return () => {
      channel.unbind();
    };
  }, [active, queryClient, refetch, user]);

  return (
    <InfiniteScroll
      dataLength={data?.pages.flatMap((page) => page).length || 0}
      next={fetchNextPage}
      inverse
      className="flex flex-grow flex-col-reverse justify-end gap-1 !overflow-visible p-4"
      hasMore={hasNextPage || false}
      loader={
        <div className="flex items-center justify-center p-1">
          <div role="status">
            <svg
              aria-hidden="true"
              style={{
                width: 24 + "px",
                height: 24 + "px",
              }}
              className="animate-spin fill-gray-300 text-transparent duration-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        </div>
      }
    >
      {data?.pages.map((page) =>
        page.map((message) =>
          message.sender_id.toString() === active.current ? (
            <div
              key={message.id}
              className="pg-sm self-start rounded-8 rounded-bl-0 bg-main-base px-3 py-2 text-white"
            >
              {message.content}
            </div>
          ) : (
            <div
              key={message.id}
              className="pg-sm self-end rounded-8 rounded-br-0 bg-bg-200 px-3 py-2"
            >
              {message.content}
            </div>
          ),
        ),
      )}
    </InfiniteScroll>
  );
}
