import { clsx, type ClassValue } from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

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
