import Button from "@/components/primitives/Button";
import { validateRequest } from "@/lib/auth";
import { bogart } from "@/lib/utils";
import { User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();

  if (user) redirect("/");

  return (
    <div className="grid flex-grow grid-rows-[1fr,3fr,1fr] px-12 py-6">
      <div className="flex items-baseline justify-center self-start sm:justify-between">
        <Link
          className={`${bogart.className} text-2xl text-main-base hover:text-main-darker`}
          href="/"
        >
          memo
        </Link>
        <p className="pg-sm hidden items-center gap-1.5 text-text-600 sm:flex">
          <span>Have an account?</span>
          <Link
            href="/sign-in"
            className="font-medium text-main-base underline underline-offset-2 shadow-xs hover:text-main-darker"
          >
            Sign in
          </Link>
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 self-center">
        <div className="card w-full max-w-[300px] !gap-6 !p-7">
          <div className="flex flex-col items-center">
            <div className="w-fit rounded-full bg-[linear-gradient(180deg,rgba(113,119,132,0.1)_0%,rgba(113,119,132,0)_100%)] p-3.5">
              <div className="w-fit rounded-full border bg-bg-0 p-3.5 shadow-xs">
                <User2 size={28} className="text-text-600" />
              </div>
            </div>
            <h6 className="mt-2">Sign up to memo</h6>
            <p className="pg-md mt-1 text-text-600">Select a sign up method.</p>
          </div>
          <div className="border-t" />
          <div className="flex flex-col gap-3">
            <Button
              size="md"
              variant="neutral_stroke"
              text="Sign up with GitHub"
              href="/api/auth/github"
              icon_left={
                <Image
                  src="/github.svg"
                  width={20}
                  height={20}
                  quality={100}
                  alt="GitHub logo"
                />
              }
            />
            <Button
              size="md"
              variant="neutral_stroke"
              text="Sign up with Google"
              href="/api/auth/google"
              icon_left={
                <Image
                  src="/google.svg"
                  width={20}
                  height={20}
                  alt="Google logo"
                  quality={100}
                />
              }
            />
          </div>
        </div>
        <p className="pg-sm flex items-center gap-1.5 text-text-600 sm:hidden">
          <span>Have an account?</span>
          <Link
            href="/sign-in"
            className="font-medium text-main-base underline underline-offset-2 shadow-xs hover:text-main-darker"
          >
            Sign in
          </Link>
        </p>
      </div>
      <p className="pg-sm self-end text-center text-text-600 sm:text-start">
        memo by{" "}
        <Link
          href="https://ambe.dev"
          className="font-medium text-main-base underline underline-offset-2 shadow-xs hover:text-main-darker"
        >
          ambe
        </Link>
        .
      </p>
    </div>
  );
}
