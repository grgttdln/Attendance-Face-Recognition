"use client";

import { FiGrid, FiLogOut, FiClock, FiMenu } from "react-icons/fi";
import { BiParty } from "react-icons/bi"; // Import BiParty icon
import Image from "next/image";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle Button for Small Screens */}
      <div className="lg:hidden p-4">
        <button onClick={toggleSidebar} className="text-blue-900 text-3xl">
          <FiMenu />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`h-screen bg-white shadow-lg rounded-tr-3xl rounded-br-3xl p-6 flex flex-col fixed lg:static z-50 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 w-72`}
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
        <div className="mt-10 flex flex-col space-y-8">
          <span className="text-gray-500 text-sm pl-4 lg:text-sm" style={{ fontFamily: "Poppins" }}>
            OVERVIEW
          </span>

          {/* Dashboard Button */}
          <button
            className="btn btn-ghost flex items-center gap-3 text-blue-900 lg:text-lg text-base font-bold"
            style={{ justifyContent: "flex-start", fontFamily: "Poppins" }}
          >
            <FiGrid className="lg:text-2xl text-xl" /> {/* Smaller icons for small screens */}
            <span className="lg:text-base text-sm">Dashboard</span> {/* Smaller text for small screens */}
          </button>

          {/* Events Button with BiParty Icon */}
          <button
            className="btn btn-ghost flex items-center gap-3 text-blue-900 lg:text-lg text-base font-bold"
            style={{ justifyContent: "flex-start", fontFamily: "Poppins" }}
          >
            <BiParty className="lg:text-2xl text-xl" /> {/* BiParty icon */}
            <span className="lg:text-base text-sm">Events</span> {/* Smaller text for small screens */}
          </button>

          {/* History Button */}
          <button
            className="btn btn-ghost flex items-center gap-3 text-blue-900 lg:text-lg text-base font-bold"
            style={{ justifyContent: "flex-start", fontFamily: "Poppins" }}
          >
            <FiClock className="lg:text-2xl text-xl" /> {/* Smaller icons for small screens */}
            <span className="lg:text-base text-sm">History</span> {/* Smaller text for small screens */}
          </button>

          {/* Logout Button on Small Screens */}
          <div className="lg:hidden">
            <button
              className="btn btn-ghost flex items-center gap-5 text-red-600 lg:text-lg text-base font-semibold"
              style={{ justifyContent: "flex-start", fontFamily: "Poppins" }}
            >
              <FiLogOut className="lg:text-2xl text-xl" /> {/* Smaller icons for small screens */}
              <span className="lg:text-base text-sm">Log out</span> {/* Smaller text for small screens */}
            </button>
          </div>
        </div>

        {/* Logout Button on Large Screens */}
        <div className="mt-auto hidden lg:block">
          <button
            className="btn btn-ghost flex items-center gap-5 text-red-600 lg:text-lg text-base font-semibold"
            style={{ justifyContent: "flex-start", fontFamily: "Poppins" }}
          >
            <FiLogOut className="lg:text-2xl text-xl" /> {/* Smaller icons for small screens */}
            <span className="lg:text-base text-sm">Log out</span> {/* Smaller text for small screens */}
          </button>
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
