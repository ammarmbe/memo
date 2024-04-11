"use client";
import Button from "@/components/primitives/Button";
import Input from "@/components/primitives/Input";
import Loading from "@/components/primitives/Loading";
import { toast } from "@/components/primitives/toast/use-toast";
import { useUser } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, UserCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Settings() {
  const [editing_username, set_editing_username] = useState(false);
  const queryClient = useQueryClient();
  const { user, isFetching } = useUser();
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm<{
    username: string;
  }>({
    defaultValues: {
      username: user?.username || "",
    },
  });

  const usernameMutation = useMutation({
    mutationFn: async (username: string) => {
      const res = await fetch("/api/user", {
        method: "PATCH",
        body: JSON.stringify({ username }),
      });

      if (res.status === 409) {
        throw new Error("Username already taken.");
      }

      return res.status;
    },
    onError: (error) => {
      setError("username", {
        type: "manual",
        message: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<{ username: string }> = async (data) => {
    const status = await usernameMutation.mutateAsync(data.username);
    await queryClient.invalidateQueries({
      queryKey: ["user"],
    });

    if (status === 200) set_editing_username(false);
  };

  const imageMutation = useMutation({
    mutationFn: async (image: File) => {
      const formData = new FormData();
      formData.append("file", image);

      if (image.size > 5 * 1024 * 1024) {
        throw new Error("Images must be under 5MB.");
      }

      const res = await fetch("/api/user/image", {
        method: "POST",
        body: formData,
      });

      return res.status;
    },
    onError: (error) => {
      toast({
        color: "orange",
        position: "center",
        saturation: "high",
        size: "sm",
        title: error.message,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  useEffect(() => {
    user?.username && setValue("username", user?.username);
  }, [setValue, user]);

  if (!user) router.push("/sign-up");

  return (
    <div className="flex flex-grow flex-col">
      <div className="grid grid-rows-[auto,auto] gap-x-3.5 gap-y-1 px-8 py-5 sm:grid-cols-[auto,1fr]">
        <div className="row-span-2 hidden w-fit rounded-full border p-3 sm:block">
          <UserCircle2 size={24} className="text-text-600" />
        </div>
        <p className="sm:label-lg label-sm">Your Profile</p>
        <p className="sm:pg-sm pg-xs text-text-600">
          Customize your username and profile picture.
        </p>
      </div>
      <div className="border-t" />
      <div className="relative flex flex-col px-8">
        <Loading isLoading={isFetching} />
        <div className="grid gap-5 py-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <p className="label-sm">Username</p>
            <p className="pg-sm text-text-600">
              Your username is how people add you as a friend.
            </p>
          </div>
          {editing_username ? (
            <div className="min-h-12">
              <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                <Input
                  size="sm"
                  error={errors.username}
                  {...register("username", {
                    required: "Username is required.",
                    minLength: {
                      value: 4,
                      message: "Username must be at least 3 characters.",
                    },
                    maxLength: {
                      value: 20,
                      message: "Username must be at most 20 characters.",
                    },
                    validate: (value) =>
                      /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(
                        value,
                      ) ||
                      "Username must contain only letters, numbers, underscores, and dots.",
                  })}
                />
                <Button
                  text="Save"
                  type="submit"
                  size="sm"
                  variant="neutral_stroke"
                  disabled={usernameMutation.isPending}
                />
              </form>
              {errors.username?.message ? (
                <div className="pg-xs mt-1.5 text-error-base">
                  {errors.username?.message}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="pg-sm">{user?.username ?? "–"}</p>
              <button
                onClick={() => set_editing_username(true)}
                className="label-sm flex w-fit gap-0.5 text-main-base hover:text-main-darker"
              >
                Edit{" "}
                <span className="inline-block p-0.5">
                  <ChevronRight size={16} />
                </span>
              </button>
            </div>
          )}
        </div>
        <div className="border-t" />
        <div className="grid gap-5 py-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <p className="label-sm">Profile Picture</p>
            <p className="pg-sm text-text-600">
              150x150px recommended. Max size 5MB.
            </p>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative size-12 overflow-hidden rounded-full bg-bg-200">
              {user?.image_url ? (
                <Image
                  src={user.image_url}
                  alt={`${user.username}'s profile picture`}
                  fill
                  sizes="3rem"
                  quality={100}
                />
              ) : null}
            </div>
            <input
              type="file"
              hidden
              ref={fileRef}
              onChange={async (e) => {
                const file = e.target.files?.[0];

                if (file) imageMutation.mutate(file);
              }}
            />
            <Button
              size="xs"
              variant="neutral_stroke"
              text="Upload"
              onClick={() => {
                fileRef.current?.click();
              }}
              disabled={imageMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
