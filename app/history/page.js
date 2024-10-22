import Sidebar from "@/components/Sidebar";
import History from '@/components/History';

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <History />
    </div>
  );
}