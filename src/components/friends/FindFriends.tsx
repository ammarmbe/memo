"use client";
import { DialogClose } from "@radix-ui/react-dialog";
import { UserPlus2, X } from "lucide-react";
import Button from "../primitives/Button";
import Dialog from "../primitives/Dialog";
import Input from "../primitives/Input";
import { useUser } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../primitives/Loading";
import Image from "next/image";
import { useState } from "react";
import { toast } from "../primitives/toast/use-toast";

export default function FindFriends() {
  const { user } = useUser();
  const [value, setValue] = useState("");
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: ["find-friends"],
    queryFn: async () => {
      const res = await fetch("/api/friends/requests");
      return res.json() as Promise<
        {
          username: string;
          image_url: string;
          id: number;
        }[]
      >;
    },
    enabled: !!user,
  });

  const sendMutation = useMutation({
    mutationFn: async (username: string) => {
      const res = await fetch("/api/friends/requests", {
        method: "POST",
        body: JSON.stringify({ username, status: "send" }),
      });

      if (res.status === 404) {
        throw new Error("No user found with that username.");
      }

      return username;
    },
    onError: (error) => {
      toast({
        color: "orange",
        position: "center",
        saturation: "medium",
        size: "sm",
        title: error.message,
      });
    },
    onSuccess: (username) => {
      setValue("");
      toast({
        color: "green",
        position: "center",
        saturation: "high",
        size: "sm",
        title: `Friend request sent to ${username}.`,
      });
    },
  });

  const responseMutation = useMutation({
    mutationFn: async ({
      username,
      status,
    }: {
      username: string;
      status: "accept" | "ignore";
    }) => {
      const res = await fetch("/api/friends/requests", {
        method: "POST",
        body: JSON.stringify({ username, status }),
      });

      if (res.status === 404) {
        throw new Error("No user found with that username.");
      }

      return username;
    },
    onMutate: async ({ username }) => {
      await queryClient.setQueryData(
        ["find-friends"],
        (
          oldData: {
            username: string;
            image_url: string;
            id: number;
          }[],
        ) => {
          return oldData?.filter((friend) => friend.username !== username);
        },
      );
    },
  });

  return (
    <Dialog
      trigger={
        <Button
          size="md"
          variant="neutral_stroke"
          text="Find Friends"
          className={
            data?.length
              ? "relative after:absolute after:right-2 after:top-2 after:size-1.5 after:rounded-full after:border-border-0 after:bg-red-500"
              : ""
          }
          icon_left={<UserPlus2 size={20} />}
        />
      }
    >
      <div className="flex gap-x-3 gap-y-1 p-4">
        <div className="shadow-sm flex items-center justify-center rounded-full border bg-white p-3 text-text-600">
          <UserPlus2 size={22} />
        </div>
        <div className="flex flex-grow justify-between">
          <div className="flex-grow">
            <p className="label-md">Find Friends</p>
            <p className="pg-sm mt-1 text-text-600">
              Search for friends and add them.
            </p>
          </div>
          <DialogClose className="h-fit text-text-600 hover:text-text-950">
            <X size={16} />
          </DialogClose>
        </div>
      </div>
      <div className="border-t" />
      <div className="p-5">
        <div className="flex-grow">
          <p className="label-sm mb-1.5">Send a friend request to someone.</p>
          <div className="flex gap-2.5">
            <Input
              size="sm"
              grow
              placeholder="username"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button
              variant="neutral_stroke"
              size="sm"
              text="Send"
              disabled={sendMutation.isPending}
              onClick={() => {
                sendMutation.mutate(value);
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="flex-grow">
          <p className="sh-xs flex items-center gap-1.5 bg-bg-50 px-5 py-1.5 text-text-600">
            Your Friend Requests
            {data?.length ? (
              <span className="flex size-4 items-center justify-center rounded-full bg-red-500 p-[0.1875rem] text-[10px] font-bold leading-none text-white">
                {data?.length}
              </span>
            ) : null}
          </p>
          <div className="relative flex max-h-[300px] min-h-[100px] flex-col gap-2 overflow-auto">
            <Loading isLoading={isFetching} size={32} />
            {data?.length ? (
              data.map((friend) => (
                <div key={friend.id} className="flex items-center gap-3 p-4">
                  <div className="relative size-8 overflow-auto rounded-full bg-bg-200">
                    {friend.image_url ? (
                      <Image
                        src={friend.image_url}
                        alt={friend.username}
                        fill
                        sizes="2rem"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-grow items-center gap-2">
                    <p className="label-sm flex-grow">{friend.username}</p>
                    <div className="flex gap-2">
                      <Button
                        size="xxs"
                        variant="neutral_stroke"
                        text="Ignore"
                        onClick={() => {
                          responseMutation.mutate({
                            username: friend.username,
                            status: "ignore",
                          });
                        }}
                      />
                      <Button
                        size="xxs"
                        variant="primary_filled"
                        text="Accept"
                        onClick={() => {
                          responseMutation.mutate({
                            username: friend.username,
                            status: "accept",
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="pg-sm mt-5 text-center text-text-400">
                You have no friend requests.
              </p>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
