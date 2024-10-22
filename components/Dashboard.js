"use client";

import React from "react";

export default function Dashboard() {
  return (
    <div className="flex-1 p-10 pt-16 bg-gray-100 min-h-screen">
      {/* Title */}
      <div className="bg-blue-900 mb-10 shadow-md p-6 rounded-lg flex flex-col items-start text-left border border-gray-200 hover:shadow-xl transition-shadow">
        <h1 className="text-1xl font-medium text-white mb-3" style={{ fontFamily: "Poppins" }}>
          Dashboard
        </h1>
        <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "Poppins" }}>
          Seamlessly track attendance with advanced facial recognition technology, ensuring accurate, secure, and effortless check-ins for every event.
        </h1>
      </div>

      {/* Create Event Button */}
      <div className="mb-10">
        <button
          className="bg-white shadow-md text-blue-900 hover:bg-blue-900 hover:text-white w-full lg:w-full text-lg py-8 rounded-lg font-bold transition-colors duration-300 ease-in-out"
          style={{ fontFamily: "Poppins" }}
        >
          Create an Event +
        </button>
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
            className="bg-white shadow-md p-6 rounded-lg flex flex-col items-start text-left border border-gray-200 hover:shadow-xl transition-shadow"
            style={{ fontFamily: "Poppins" }}
          >
            <h3 className="text-xl font-bold text-blue-900 mb-2">Event Title 1</h3>
            <div className="w-full flex justify-between text-gray-600">
              <p>January 1, 2024</p>
              <p>10:00 - 12:00 PM</p>
            </div>
          </button>

          {/* Event Card */}
          <button
            className="bg-white shadow-md p-6 rounded-lg flex flex-col items-start text-left border border-gray-200 hover:shadow-xl transition-shadow"
            style={{ fontFamily: "Poppins" }}
          >
            <h3 className="text-xl font-bold text-blue-900 mb-2">Event Title 2</h3>
            <div className="w-full flex justify-between text-gray-600">
              <p>October 3, 2024</p>
              <p>10:00 - 12:00 PM</p>
            </div>
          </button>

          {/* Event Card */}
          <button
            className="bg-white shadow-md p-6 rounded-lg flex flex-col items-start text-left border border-gray-200 hover:shadow-xl transition-shadow"
            style={{ fontFamily: "Poppins" }}
          >
            <h3 className="text-xl font-bold text-blue-900 mb-2">Event Title 3</h3>
            <div className="w-full flex justify-between text-gray-600">
              <p>November 5, 2024</p>
              <p>10:00 - 12:00 PM</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
