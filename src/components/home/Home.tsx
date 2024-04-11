"use client";
import { formatDate, useActive } from "@/lib/utils";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import Loading from "../primitives/Loading";
import Image from "next/image";
import { useMemo } from "react";
import Chat from "./Chat";
import Send from "./Send";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

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
    <div
      className={`relative flex-grow flex-col ${!active.current ? "hidden sm:flex" : "flex"}`}
    >
      {active.current ? (
        <>
          <Loading isLoading={isFetching > 0} />
          <div className="grid grid-cols-[auto,1fr] grid-rows-[auto,auto] gap-x-3.5 gap-y-1 px-4 py-3 sm:px-8 sm:py-5">
            <div className="row-span-2 flex gap-3.5">
              <Link href="/" className="flex h-full items-center text-text-600">
                <ChevronLeft size={24} />
              </Link>
              <div className="relative size-10 overflow-hidden rounded-full bg-bg-200 sm:size-12">
                {current?.image_url ? (
                  <Image
                    src={current.image_url}
                    alt={current.username}
                    className="rounded-full"
                    fill
                    quality={100}
                    sizes="(min-width: 640px) 3rem, 2.5rem"
                  />
                ) : null}
              </div>
            </div>
            <p className="sm:label-lg label-sm">{current?.username}</p>
            <p className="sm:pg-sm pg-xs text-text-600">
              Friends since {formatDate(current?.created_at)}
            </p>
          </div>
          <div className="border-t" />
          <div className="mx-auto flex min-h-0 w-full flex-grow flex-col">
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
