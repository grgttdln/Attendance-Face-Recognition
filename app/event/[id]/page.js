"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Event from "@/components/Event";
import { doc, getDoc } from "firebase/firestore"; // Changed imports

export default function Home() {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").pop().replace("%20", " ");

  return (
    <div className="flex">
      <Sidebar />
      <Event eventId={lastSegment} />
    </div>
  );
}
