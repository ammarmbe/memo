import { useQuery } from "@tanstack/react-query";
import { clsx, type ClassValue } from "clsx";
import { User } from "lucia";
import localFont from "next/font/local";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

export const bogart = localFont({
  src: [
    {
      path: "../../public/BogartBold-Italic.ttf",
      style: "italic",
      weight: "bold",
    },
    {
      path: "../../public/BogartSemibold-Italic.ttf",
      style: "italic",
      weight: "600",
    },
  ],
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useActive() {
  const router = useRouter();
  const pathname = usePathname();
  const sP = useSearchParams();
  const searchParams = useMemo(
    () => new URLSearchParams(Object.fromEntries(sP.entries())),
    [sP],
  );

  const current = useMemo(() => searchParams.get("active"), [searchParams]);

  const set = (value: string) => {
    searchParams.set("active", value);

    router.push(pathname + "?" + searchParams.toString());
  };

  const clear = () => {
    searchParams.delete("active");

    router.push(pathname + "?" + searchParams.toString());
  };

  return { current, set, clear };
}

export function useUser() {
  const { data, isFetching } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/user");
      return res.json() as Promise<User | null>;
    },
  });

  return {
    user: data,
    isFetching,
  };
}

export function formatDate(date?: string) {
  if (!date) return undefined;

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));
}
