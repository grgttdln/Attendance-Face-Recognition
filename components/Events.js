"use client";
import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
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
  
          const currentDate = new Date();
  
          // Update events that have ended by checking if currentDate is after event's end time
          const updatedEventList = await Promise.all(
            eventList.map(async (event) => {
              const eventEndDateTime = new Date(`${event.date} ${event.endTime}`);
              
              // If event has ended and status is still false, update status to true
              if (eventEndDateTime < currentDate && event.status === false) {
                const eventDocRef = doc(db, "events", event.id);
                await updateDoc(eventDocRef, { status: true });
                return { ...event, status: true };
              }
              return event;
            })
          );
  
          // Filter events to show only ongoing or upcoming ones (status: false)
          const filteredEvents = updatedEventList
            .filter(
              (event) =>
                new Date(`${event.date} ${event.endTime}`) >= currentDate &&
                event.status === false
            )
            .sort((a, b) =>
              new Date(`${a.date} ${a.startTime}`) - new Date(`${b.date} ${b.startTime}`)
            );
  
          setEvents(filteredEvents);
        } catch (error) {
          console.error("Error fetching or updating events: ", error);
        }
      };
  
      fetchAndCheckEvents();
    }, []);

  return (
    <div className="flex-1 p-10 pt-16 bg-gray-100 min-h-screen">
      <div className="bg-blue-900 mb-10 shadow-md p-6 rounded-lg flex flex-col items-start text-left border border-gray-200 hover:shadow-xl transition-shadow">
        <h1 className="text-1xl font-medium text-white mb-3" style={{ fontFamily: "Poppins" }}>
          Presenza
        </h1>
        <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "Poppins" }}>
          All Upcoming and Ongoing Events
        </h1>
      </div>

      <div className="bg-transparent">
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
