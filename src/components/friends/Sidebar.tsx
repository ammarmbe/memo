import { UserPlus2 } from "lucide-react";
import Link from "next/link";
import Button from "../primitives/Button";

export default function Sidebar() {
  return (
    <div className="flex h-screen min-w-[250px] flex-col gap-5 border-r p-5">
      <div className="flex flex-col gap-1">
        <h2 className="label-lg">Friends</h2>
        <p className="pg-sm text-text-600">Your list of friends.</p>
      </div>
      <Button
        size="md"
        variant="neutral_stroke"
        text="Find Friends"
        icon_left={<UserPlus2 size={20} />}
      />
      <div className="border-t" />
      <div className="flex flex-grow flex-col gap-2">
        <p className="sh-xs py-1 text-text-400">Friends</p>
        <nav className="flex flex-col gap-1">
          <Link
            href="/?active=1"
            className="relative flex items-center gap-2 rounded-8 p-2 text-text-600 transition-all hover:bg-bg-50"
          >
            <div className="size-5 rounded-full bg-bg-200" />
            Name
          </Link>
          <Link
            href="/?active=2"
            className="relative flex items-center gap-2 rounded-8 p-2 text-text-600 transition-all hover:bg-bg-50"
          >
            <div className="size-5 rounded-full bg-bg-200" />
            Name
          </Link>
        </nav>
      </div>
    </div>
  );
}
