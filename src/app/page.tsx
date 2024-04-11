import Home from "@/components/home/Home";
import Sidebar from "@/components/home/Sidebar";

export default function Page() {
  return (
    <main className="flex flex-grow">
      <Sidebar />
      <Home />
    </main>
  );
}
