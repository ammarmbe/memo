import Home from "@/components/home/Home";
import Sidebar from "@/components/home/Sidebar";

export default function Page() {
  return (
    <main className="flex min-h-0 flex-grow">
      <Sidebar />
      <Home />
    </main>
  );
}
