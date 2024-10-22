import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import FormEvent from "@/components/Form";

export default function Create() {
  return (
    <div className="flex">
      <Sidebar />
      <FormEvent />
    </div>
  );
}
