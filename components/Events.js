"use client";
import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"; // Add updateDoc and doc imports
import { db } from "../firebase/config";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAndCheckEvents = async () => {
      try {
        const eventsCollection = collection(db, "events");
        const eventSnapshot = await getDocs(eventsCollection);
        const eventList = eventSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Loop through each event and check if the event date has passed
        const updatedEventList = await Promise.all(
          eventList.map(async (event) => {
            if (new Date(event.date) < new Date() && event.status === false) {
              // If the event date is past due and status is false, update the status to true in Firestore
              const eventDocRef = doc(db, "events", event.id);
              await updateDoc(eventDocRef, { status: true });
              return { ...event, status: true }; // Update local event status to true
            }
            return event;
          })
        );

        // Filter the events to only include upcoming events with status false
        const filteredEvents = updatedEventList.filter(
          (event) => new Date(event.date) >= new Date() && event.status === false
        );

        setEvents(filteredEvents); // Set the filtered and updated events
      } catch (error) {
        console.error("Error fetching or updating events: ", error);
      }
    };

    fetchAndCheckEvents();
  }, []);

  return (
    <div className="flex-1 p-10 pt-16 bg-gray-100 min-h-screen">
      {/* Title */}
      <div className="bg-blue-900 mb-10 shadow-md p-6 rounded-lg flex flex-col items-start text-left border border-gray-200 hover:shadow-xl transition-shadow">
        <h1 className="text-1xl font-medium text-white mb-3" style={{ fontFamily: "Poppins" }}>
          Presenza
        </h1>
        <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "Poppins" }}>
          All Upcoming Events
        </h1>
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-transparent">
        {/* <h2 className="text-2xl font-semibold text-blue-800 mb-6" style={{ fontFamily: "Poppins" }}>
          Your Upcoming Events
        </h2> */}

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map((event) => (
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
            <p>No upcoming events found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
