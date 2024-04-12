"use client";
import { SendHorizonal } from "lucide-react";
import { useRef, useState } from "react";
import Button from "../primitives/Button";
import Input from "../primitives/Input";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useActive, useUser } from "@/lib/utils";

export default function Send() {
  const active = useActive();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const sendRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState("");

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          receiver_id: active.current,
          content,
        }),
      });
    },
    onMutate: (content) => {
      setValue("");
      queryClient.setQueryData(
        ["messages", active.current],
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
          console.log([
            [
              {
                id: Math.random().toString(),
                content: value,
                created_at: new Date().toISOString(),
                sender_id: user?.id,
                receiver_id: parseInt(active.current ?? ""),
              },
            ],
            ...(data?.pages ?? []),
          ]);

          return {
            pageParams: data?.pageParams,
            pages: [
              [
                {
                  id: Math.random().toString(),
                  content: value,
                  created_at: new Date().toISOString(),
                  sender_id: user?.id,
                  receiver_id: parseInt(active.current ?? ""),
                },
              ],
              ...(data?.pages ?? []),
            ],
          };
        },
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
        ) =>
          old?.map((o) =>
            o.id.toString() === active.current ? { ...o, message: content } : o,
          ),
      );
    },
  });

  return (
    <div className="flex p-4">
      <Input
        ref={inputRef as any}
        className="relative rounded-r-0 border-border-300 hover:border-border-300"
        grow
        size="md"
        onFocus={(e) => {
          e.currentTarget.classList.add("z-10");
          sendRef.current?.classList.remove("z-10");
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !e.shiftKey &&
            value &&
            window.outerWidth > 768
          ) {
            sendMutation.mutate(value);
          }
        }}
      />
      <Button
        ref={sendRef as any}
        icon_left={<SendHorizonal size={20} />}
        size="md"
        variant="neutral_stroke"
        className="relative -ml-px rounded-l-0 border-border-300 hover:border-border-300"
        onMouseDown={(e) => {
          e.currentTarget.classList.add("z-10");
          inputRef.current?.classList.remove("z-10");
        }}
        onClick={() => {
          if (value) {
            sendMutation.mutate(value);
          }
        }}
      />
    </div>
  );
}
