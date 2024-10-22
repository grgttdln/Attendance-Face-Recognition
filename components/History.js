"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore"; // Firestore imports
import { db } from "../firebase/config"; // Your Firebase configuration
import Link from "next/link"; // Import Link for navigation

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function History() {
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        const eventsCollection = collection(db, "events");
        const eventSnapshot = await getDocs(eventsCollection);
        const eventList = eventSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((event) => new Date(event.date) < new Date());
        setPastEvents(eventList);
      } catch (error) {
        console.error("Error fetching event history: ", error);
      }
    };

    fetchPastEvents();
  }, []);

  return (
    <div className="flex-1 p-10 pt-16 bg-gray-100 min-h-screen">
      {/* Title */}
      <div className="bg-blue-900 mb-10 shadow-md p-6 rounded-lg flex flex-col items-start text-left border border-gray-200 hover:shadow-xl transition-shadow">
        <h1
          className="text-1xl font-medium text-white mb-3"
          style={{ fontFamily: "Poppins" }}
        >
          History
        </h1>
        <h1
          className="text-2xl font-semibold text-white"
          style={{ fontFamily: "Poppins" }}
        >
          Event History
        </h1>
      </div>

      {/* Past Events Section */}
      <div className="bg-transparent">
        <h2
          className="text-2xl font-semibold text-blue-800 mb-6"
          style={{ fontFamily: "Poppins" }}
        >
          Your Past Events
        </h2>

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.length > 0 ? (
            pastEvents.map((event) => (
              <Link key={event.id} href={`/historyevents?id=${event.id}`}>
                <button
                  className="bg-white shadow-md p-6 rounded-lg flex flex-col items-center border border-gray-200 hover:shadow-xl transition-shadow"
                  style={{ fontFamily: "Poppins" }}
                >
                  <Image
                    src={event.image || "https://via.placeholder.com/400x250"}
                    width={400}
                    height={250}
                    alt={event.name}
                    className="mb-4"
                  />
                  <h3 className="text-xl font-bold text-blue-900 mb-2 text-left w-full">
                    {event.name}
                  </h3>
                  <div className="w-full text-gray-600 text-left">
                    <p>
                      {new Date(event.date).toLocaleDateString()} &nbsp;
                      {formatTime(event.startTime)} -{" "}
                      {event.endTime ? formatTime(event.endTime) : ""}
                    </p>
                  </div>
                </button>
              </Link>
            ))
          ) : (
            <p>No past events found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
