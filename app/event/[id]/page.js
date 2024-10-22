import Sidebar from "@/components/Sidebar";
import Event from "@/components/Event";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <Event />
    </div>
  );
}
