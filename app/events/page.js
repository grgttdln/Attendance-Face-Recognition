import Sidebar from "@/components/Sidebar";
import Events from '@/components/Events';

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <Events />
    </div>
  );
}