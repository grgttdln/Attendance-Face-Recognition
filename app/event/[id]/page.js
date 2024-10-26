"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Event from "@/components/Event";
import { doc, getDoc } from "firebase/firestore"; // Changed imports

export default function Home() {
  const pathname = usePathname();
  console.log(pathname);
  const lastSegment = decodeURIComponent(pathname.split("/").pop());
  console.log(lastSegment);

  return (
    <div className="flex">
      <Sidebar />
      <Event eventId={lastSegment} />
    </div>
  );
}
