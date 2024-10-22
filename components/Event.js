"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, "events");
        const eventSnapshot = await getDocs(eventsCollection);
        const eventList = eventSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventList); // Set the fetched events
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex-1 p-10 pt-16 bg-gray-100 min-h-screen">
      {/* Title */}
      <div className="bg-blue-900 mb-8 shadow-md p-6 rounded-lg flex flex-col items-start text-left border border-gray-200 hover:shadow-xl transition-shadow">
        <h1
          className="text-1xl font-medium text-white mb-8"
          style={{ fontFamily: "Poppins" }}
        >
          Presenza
        </h1>
        <h1
          className="text-2xl font-semibold text-white mb-1"
          style={{ fontFamily: "Poppins" }}
        >
          EVENT NAME *
        </h1>
        <div className="w-full flex justify-between font-semibold text-white">
          <p>January 1, 2024</p>
          <p>10:00 - 12:00 PM</p>
        </div>
      </div>

      {/* Start Attendance Tracking Button */}
      <div className="mb-10">
        <button
          className="bg-blue-900 text-white hover:bg-white hover:text-blue-900 w-full lg:w-full text-lg py-3 rounded-lg font-medium transition-colors duration-300 ease-in-out"
          style={{ fontFamily: "Poppins" }}
        >
          Start Attendance Tracking
        </button>
      </div>
    </div>
  );
}
