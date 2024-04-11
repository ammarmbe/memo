"use client";
import { formatDate, useActive } from "@/lib/utils";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import Loading from "../primitives/Loading";
import Image from "next/image";
import { useMemo } from "react";
import Chat from "./Chat";
import Send from "./Send";

export default function Home() {
  const active = useActive();
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({
    queryKey: ["chats"],
  });

  const data = queryClient.getQueryData<
    {
      username: string;
      image_url: string;
      id: number;
      created_at: string;
      message: string;
    }[]
  >(["chats"]);

  const current = useMemo(() => {
    return data?.find((d) => d.id.toString() === active.current);
  }, [data, active]);

  return (
    <div className="relative flex flex-grow flex-col">
      {active.current ? (
        <>
          <Loading isLoading={isFetching > 0} />
          <div className="grid grid-cols-[auto,1fr] grid-rows-[1.5rem,1.25rem] gap-x-3.5 gap-y-1 px-8 py-5">
            <div className="relative row-span-2 size-12 overflow-hidden rounded-full bg-bg-200">
              {current?.image_url ? (
                <Image
                  src={current.image_url}
                  alt={current.username}
                  className="rounded-full"
                  fill
                  sizes="3rem"
                />
              ) : null}
            </div>
            <p className="label-lg">{current?.username}</p>
            <p className="pg-sm text-text-600">
              Friends since {formatDate(current?.created_at)}
            </p>
          </div>
          <div className="border-t" />
          <div className="mx-auto flex min-h-0 w-full max-w-xl flex-grow flex-col gap-4 p-5">
            <div className="flex flex-grow overflow-auto [&>div]:flex [&>div]:flex-grow">
              <Chat />
            </div>
            <Send />
          </div>
        </>
      ) : (
        <div className="flex flex-grow items-center justify-center">
          <p className="pg-md select-none text-text-300">
            Select a chat to start messaging.
          </p>
        </div>
      )}
    </div>
  );
}
