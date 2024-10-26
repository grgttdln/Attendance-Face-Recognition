"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; // Firestore imports
import { db } from "../firebase/config"; // Your Firebase configuration
import Cards from "./Cards"; // Import the Cards component

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
          .filter((event) => {
            // Combine date and time for accurate comparison
            const eventDateTime = new Date(`${event.date}T${event.endTime}`);
            return eventDateTime < new Date() || event.status === true;
          })
          .sort((a, b) => {
            // Sort by date and time in descending order
            const dateA = new Date(`${a.date}T${a.endTime}`);
            const dateB = new Date(`${b.date}T${b.endTime}`);
            return dateB - dateA;
          });

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
      <div className="bg-blue-900 mb-10 shadow-md p-6 rounded-xl flex flex-col items-start text-left border border-gray-200 hover:shadow-xl transition-shadow">
        <h1 className="text-1xl font-medium text-white mb-3" style={{ fontFamily: "Poppins" }}>
          Presenza
        </h1>
        <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "Poppins" }}>
          Event History
        </h1>
      </div>

      {/* Past Events Section */}
      <div className="bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.length > 0 ? (
            pastEvents.map((event) => (
              <Cards
                key={event.id}
                title={event.name}
                eTime={event.endTime}
                sTime={event.startTime}
                status={event.status}
                date={event.date}
              />
            ))
          ) : (
            <p>No past events found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
