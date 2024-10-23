"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { MdDateRange } from "react-icons/md";
import { LuCalendarClock } from "react-icons/lu";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function FormEvent() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); 

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !date || !startTime || !endTime) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a document with a unique ID based on name and timestamp
      const customDocId = name;
      await setDoc(doc(db, "events", customDocId), {
        name,
        date,
        startTime,
        endTime,
        status: false,
        createdAt: new Date().toISOString(),
      });

      alert("Event successfully created!");

      // Clear form fields after successful submission
      setName("");
      setDate("");
      setStartTime("");
      setEndTime("");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error creating event: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 p-4 md:p-10 pt-8 md:pt-16 bg-gray-100 min-h-screen"
    >
      <div>
        {/* Title */}
        <div className="bg-blue-900 mb-8 shadow-md p-6 rounded-lg flex flex-col items-start text-left border border-gray-200 hover:shadow-xl transition-shadow">
          <h2
            className="text-lg md:text-xl font-medium text-white mb-2"
            style={{ fontFamily: "Poppins" }}
          >
            Create an Event
          </h2>
          <h1
            className="text-xl md:text-2xl font-semibold text-white "
            style={{ fontFamily: "Poppins" }}
          >
            Add Event Details
          </h1>
        </div>

        {/* Event Title Section */}
        <div className="space-y-6">
          <div className="bg-white shadow-md p-6 md:p-8 rounded-xl">
            <p
              className="text-left text-lg md:text-xl font-medium text-blue-900 mb-4"
              style={{ fontFamily: "Poppins" }}
            >
              What's the name of your event?
            </p>
            <input
              type="text"
              placeholder="Event Title *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-4 bg-white text-blue-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none transition-all"
              style={{ fontFamily: "Poppins" }}
            />
          </div>

          <div className="bg-white shadow-md p-6 md:p-8 rounded-xl">
            <p
              className="text-left text-lg md:text-xl font-medium text-blue-900 mb-4"
              style={{ fontFamily: "Poppins" }}
            >
              When does your event start and end?
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Date Input */}
              <div className="flex items-center bg-gray-100 rounded-lg p-4 flex-1">
                <MdDateRange className="text-blue-900 mr-2" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-transparent border-none outline-none text-blue-900"
                  style={{ fontFamily: "Poppins" }}
                />
              </div>

              {/* Start Time Input */}
              <div className="flex items-center bg-gray-100 rounded-lg p-4 flex-1">
                <LuCalendarClock className="text-blue-900 mr-2" />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full bg-transparent border-none outline-none text-blue-900"
                  style={{ fontFamily: "Poppins" }}
                />
              </div>

              {/* End Time Input */}
              <div className="flex items-center bg-gray-100 rounded-lg p-4 flex-1">
                <LuCalendarClock className="text-blue-900 mr-2" />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full bg-transparent border-none outline-none text-blue-900"
                  style={{ fontFamily: "Poppins" }}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-4 md:p-6 rounded-lg font-semibold text-lg transition-all duration-300
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-white text-blue-900 hover:bg-blue-900 hover:text-white shadow-md"
              }`}
            style={{ fontFamily: "Poppins" }}
          >
            {isSubmitting ? "Creating Event..." : "+ Add Event"}
          </button>
        </div>
      </div>
    </form>
  );
}
