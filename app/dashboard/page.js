import Sidebar from "@/components/Sidebar";
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <Dashboard />
    </div>
  );
}