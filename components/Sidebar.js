"use client";

import { FiGrid, FiLogOut, FiClock, FiMenu } from "react-icons/fi";
import { BiParty } from "react-icons/bi"; // Import BiParty icon
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current path

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to check if the link is active and return appropriate class
  const isActive = (link) => (pathname === link ? "bg-blue-100" : "");

  return (
    <>
      {/* Placeholder div to occupy sidebar space on large screens */}
      <div className="hidden lg:block w-72 min-h-screen"></div>
      <div className="lg:hidden block top-0 left-0 h-full p-4 bg-transparent"></div>

      {/* Toggle Button for Small Screens */}
      <div className="lg:hidden fixed top-0 left-0 h-full p-4 bg-white z-50 shadow-md">
        <button onClick={toggleSidebar} className="text-blue-900 text-3xl">
          <FiMenu />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`min-h-screen bg-white shadow-lg rounded-tr-3xl rounded-br-3xl p-6 flex flex-col fixed lg:fixed z-50 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 w-72 lg:top-0 lg:left-0`}
      >
        {/* Logo and Sidebar Title */}
        <div className="flex items-center space-x-4">
          <Image
            src="/image.png"
            alt="Logo"
            width={75} // Default size for larger screens
            height={75} // Default size for larger screens
            className="lg:w-[75px] lg:h-[75px] w-[50px] h-[50px]" // Smaller for small screens
          />
          <span
            className="text-3xl font-semibold text-blue-800 mt-1 lg:text-xl" // Smaller text for small screens
            style={{ fontFamily: "Poppins", textAlign: "center" }}
          >
            Presenza
          </span>
        </div>

        {/* Sidebar Navigation */}
        <div className="mt-10 flex flex-col space-y-4">
          <span
            className="text-gray-500 text-sm pl-4 lg:text-sm"
            style={{ fontFamily: "Poppins" }}
          >
            OVERVIEW
          </span>

          {/* Dashboard Button */}
          <Link href="/dashboard">
            <button
              className={`btn btn-ghost flex items-center gap-3 text-blue-900 lg:text-lg text-base font-bold w-full py-3 px-4 rounded-lg ${isActive(
                "/dashboard"
              )}`}
              style={{ justifyContent: "flex-start", fontFamily: "Poppins" }}
            >
              <FiGrid className="lg:text-2xl text-xl" />{" "}
              <span className="lg:text-base text-sm">Dashboard</span>
            </button>
          </Link>

          {/* Events Button */}
          <Link href="/events">
            <button
              className={`btn btn-ghost flex items-center gap-3 text-blue-900 lg:text-lg text-base font-bold w-full py-3 px-4 rounded-lg ${isActive(
                "/events"
              )}`}
              style={{ justifyContent: "flex-start", fontFamily: "Poppins" }}
            >
              <BiParty className="lg:text-2xl text-xl" />{" "}
              <span className="lg:text-base text-sm">Events</span>
            </button>
          </Link>

          {/* History Button */}
          <Link href="/history">
            <button
              className={`btn btn-ghost flex items-center gap-3 text-blue-900 lg:text-lg text-base font-bold w-full py-3 px-4 rounded-lg ${isActive(
                "/history"
              )}`}
              style={{ justifyContent: "flex-start", fontFamily: "Poppins" }}
            >
              <FiClock className="lg:text-2xl text-xl" />{" "}
              <span className="lg:text-base text-sm">History</span>
            </button>
          </Link>
        </div>

        {/* Logout Button - Positioned at the Bottom */}
        <div className="mt-auto">
          <Link href="/">
            <button
              className="btn btn-ghost flex items-center gap-5 text-red-600 lg:text-lg text-base font-semibold w-full py-3 px-4 rounded-lg"
              style={{ justifyContent: "flex-start", fontFamily: "Poppins" }}
            >
              <FiLogOut className="lg:text-2xl text-xl" />{" "}
              <span className="lg:text-base text-sm">Log out</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Overlay for small screens when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-40"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
