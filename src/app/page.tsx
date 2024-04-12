import Home from "@/components/home/Home";
import Sidebar from "@/components/home/Sidebar";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();

  if (user === null) {
    redirect("/sign-up");
  }

  return (
    <main className="flex min-h-0 flex-grow">
      <Sidebar />
      <Home />
    </main>
  );
}
