"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Events(props) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  // Function to format date from "YYYY-MM-DD" to "Month Day, Year"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!props.eventId) {
        setError("No event ID provided");
        setLoading(false);
        return;
      }

      try {
        const eventRef = doc(db, "events", props.eventId);
        const eventDoc = await getDoc(eventRef);

        if (eventDoc.exists()) {
          setEvent({
            id: eventDoc.id,
            ...eventDoc.data(),
          });
        } else {
          setError("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event: ", error);
        setError("Failed to load event data");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [props.eventId]);

  if (loading) {
    return (
      <div className="flex-1 p-10 pt-16 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-blue-900">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-10 pt-16 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-10 pt-16 bg-gray-100 min-h-screen">
      {/* Title */}
      <div className="bg-blue-900 mb-8 shadow-md p-6 rounded-lg flex flex-col items-start text-left border border-gray-200 hover:shadow-xl transition-shadow">
        {/* Header */}
        <h1
          className="text-xl font-medium text-white mb-8"
          style={{ fontFamily: "Poppins" }}
        >
          Presenza
        </h1>

        {/* Event Title */}
        <h1
          className="text-2xl font-semibold text-white mb-1"
          style={{ fontFamily: "Poppins" }}
        >
          {event?.title || props.eventId}
        </h1>

        {/* Date and Time Information */}
        <div className="w-full flex justify-between font-semibold text-white">
          {/* Event Date */}
          <p>{formatDate(event?.date) || "Date not available"}</p>
          {/* Time Range */}
          <p>
            {formatTime(event?.startTime) || "Start Time not available"} -{" "}
            {formatTime(event?.endTime) || "End Time not available"}
          </p>
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
