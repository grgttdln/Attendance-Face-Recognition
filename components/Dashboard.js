"use client";

import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import Link from "next/link";

export default function Dashboard() {
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

  // Get current date and time
  const currentDate = new Date();

  return (
    <div className="flex-1 p-10 pt-16 bg-gray-100 min-h-screen overflow-hidden">
      {/* Title */}
      <div className="bg-blue-900 mb-10 shadow-md p-6 rounded-xl flex flex-col items-start text-left border border-gray-200 hover:shadow-xl transition-shadow">
        <h1
          className="text-1xl font-medium text-white mb-3"
          style={{ fontFamily: "Poppins" }}
        >
          Presenza
        </h1>
        <h1
          className="text-2xl font-semibold text-white"
          style={{ fontFamily: "Poppins" }}
        >
          Seamlessly track attendance with advanced facial recognition
          technology, ensuring accurate, secure, and effortless check-ins for
          every event.
        </h1>
      </div>

      {/* Create Event Button */}
      <div className="mb-10">
        <Link href="/create">
          <button
            className="bg-white shadow-md text-blue-900 hover:bg-blue-900 hover:text-white w-full lg:w-full text-lg py-8 rounded-lg font-bold transition-colors duration-300 ease-in-out"
            style={{ fontFamily: "Poppins" }}
          >
            + Create an Event
          </button>
        </Link>
      </div>

      {/* Ongoing Events Section */}
      <div className="bg-transparent">
        <h2
            className="text-2xl font-semibold text-blue-800 mb-6"
            style={{ fontFamily: "Poppins" }}
          >
            Ongoing Events
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events &&
            events
              .filter((event) => {
                // Combine date and time for comparison
                const eventStart = new Date(`${event.date} ${event.startTime}`);
                const eventEnd = new Date(`${event.date} ${event.endTime}`);

                // Check if current time is between event start and end time
                return (
                  currentDate >= eventStart &&
                  currentDate <= eventEnd &&
                  event.status === false
                );
              })
              .sort((a, b) => new Date(`${a.date} ${a.startTime}`) - new Date(`${b.date} ${b.startTime}`)) // Sort by date and time
              .map((event) => (
                <Cards
                  key={event.id}
                  title={event.name}
                  eTime={event.endTime}
                  sTime={event.startTime}
                  status={event.status}
                  date={event.date}
                />
              ))}

          {/* Display message if there are no ongoing events */}
          {events.filter((event) => {
            const eventStart = new Date(`${event.date} ${event.startTime}`);
            const eventEnd = new Date(`${event.date} ${event.endTime}`);
            return (
              currentDate >= eventStart &&
              currentDate <= eventEnd &&
              event.status === false
            );
          }).length === 0 && (
            <p className="text-gray-500 text-lg col-span-full text-center">
              No ongoing events.
            </p>
          )}
        </div>

        <h2
          className="text-2xl font-semibold text-blue-800 mb-6 mt-10"
          style={{ fontFamily: "Poppins" }}
        >
          Your Upcoming Events
        </h2>

        {/* Upcoming Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events &&
            events
              .filter((event) => {
                const eventStart = new Date(`${event.date} ${event.startTime}`);
                return eventStart > currentDate && event.status === false;
              })
              .sort((a, b) => new Date(`${a.date} ${a.startTime}`) - new Date(`${b.date} ${b.startTime}`)) // Sort by date and time
              .map((event) => (
                <Cards
                  key={event.id}
                  title={event.name}
                  eTime={event.endTime}
                  sTime={event.startTime}
                  status={event.status}
                  date={event.date}
                />
              ))}

          {/* Display message if there are no upcoming events */}
          {events.filter((event) => {
            const eventStart = new Date(`${event.date} ${event.startTime}`);
            return eventStart > currentDate && event.status === false;
          }).length === 0 && (
            <p className="text-gray-500 text-lg col-span-full text-center">
              No upcoming events.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
