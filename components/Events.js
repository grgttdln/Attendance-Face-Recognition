"use client";

import React from "react";
import Image from "next/image"; // Correct import for Next.js Image component

export default function Events() {
  return (
    <div className="flex-1 p-10 pt-16 bg-gray-100 min-h-screen">
      {/* Title */}
      <div className="bg-blue-900 mb-10 shadow-md p-6 rounded-lg flex flex-col items-start text-left border border-gray-200 hover:shadow-xl transition-shadow">
        <h1 className="text-1xl font-medium text-white mb-3" style={{ fontFamily: "Poppins" }}>
          Events
        </h1>
        <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "Poppins" }}>
            All Upcoming Events
        </h1>
      </div>


      {/* Upcoming Events Section */}
      <div className="bg-transparent">
        <h2 className="text-2xl font-semibold text-blue-800 mb-6" style={{ fontFamily: "Poppins" }}>
          Your Upcoming Events
        </h2>

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Event Card */}
        <button
            className="bg-white shadow-md p-6 rounded-lg flex flex-col items-center border border-gray-200 hover:shadow-xl transition-shadow"
            style={{ fontFamily: "Poppins" }}
        >
            <Image
            src="https://via.placeholder.com/400x250"
            width={400}
            height={250}
            alt="Event Image"
            className="mb-4"
            />
            <h3 className="text-xl font-bold text-blue-900 mb-2 text-left w-full">Event Title 1</h3>
            <div className="w-full text-gray-600 text-left">
            <p>
                January 1, 2024 &nbsp; 10:00 - 12:00 PM
            </p>
            </div>
        </button>




        {/* Event Card */}
        <button
            className="bg-white shadow-md p-6 rounded-lg flex flex-col items-center border border-gray-200 hover:shadow-xl transition-shadow"
            style={{ fontFamily: "Poppins" }}
        >
            <Image
            src="https://via.placeholder.com/400x250"
            width={400}
            height={250}
            alt="Event Image"
            className="mb-4"
            />
            <h3 className="text-xl font-bold text-blue-900 mb-2 text-left w-full">Event Title 2</h3>
            <div className="w-full text-gray-600 text-left">
            <p>
                October 3, 2024 &nbsp; 10:00 - 12:00 PM
            </p>
            </div>
        </button>


          {/* Event Card */}
        {/* Event Card */}
        <button
            className="bg-white shadow-md p-6 rounded-lg flex flex-col items-center border border-gray-200 hover:shadow-xl transition-shadow"
            style={{ fontFamily: "Poppins" }}
        >
            <Image
            src="https://via.placeholder.com/400x250"
            width={400}
            height={250}
            alt="Event Image"
            className="mb-4"
            />
            <h3 className="text-xl font-bold text-blue-900 mb-2 text-left w-full">Event Title 3</h3>
            <div className="w-full text-gray-600 text-left">
            <p>
                November 5, 2024 &nbsp; 10:00 - 12:00 PM
            </p>
            </div>
        </button>

        </div>
      </div>
    </div>
  );
}
