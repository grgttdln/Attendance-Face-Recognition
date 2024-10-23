"use client";
import React, { useEffect, useState } from "react";
import { collection, getDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Events(props) {
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPressed, setIsPressed] = useState(false);

  function extractTimeOnly(timestamp) {
    const date = new Date(timestamp.seconds * 1000);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

    const fetchAttendees = async () => {
      if (!props.eventId) return;

      try {
        const attendeesCollection = collection(
          db,
          "events",
          props.eventId,
          "attendees"
        );
        const attendeesSnapshot = await getDocs(attendeesCollection);
        const attendeesList = attendeesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAttendees(attendeesList);
      } catch (error) {
        console.error("Error fetching attendees: ", error);
        setError("Failed to load attendees data");
      }
    };

    fetchEvent();
    fetchAttendees();
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
          <p>{formatDate(event?.date) || "Date not available"}</p>
          <p>
            {formatTime(event?.startTime) || "Start Time not available"} -{" "}
            {formatTime(event?.endTime) || "End Time not available"}
          </p>
        </div>
      </div>

      {/* Event Attendees Table */}
      {isPressed && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2
            className="text-lg font-medium mb-4"
            style={{ fontFamily: "Poppins" }}
          >
            Attendees
          </h2>
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">#</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {attendees.length > 0 ? (
                attendees.map((attendee) => (
                  <tr key={attendee.id} className="bg-gray-100">
                    <td className="border p-2">{attendee.id || "N/A"}</td>
                    <td className="border p-2">{attendee.name || "N/A"}</td>
                    <td className="border p-2 flex items-center">
                      <div
                        className={`w-4 h-4 inline-block mr-2 ${
                          attendee.status === "Present"
                            ? "bg-green-500"
                            : attendee.status === "Absent"
                            ? "bg-red-500"
                            : attendee.status === "Late"
                            ? "bg-yellow-500"
                            : "bg-gray-500" // Default color for "N/A" or unknown status
                        }`}
                      ></div>
                      {attendee.status || "N/A"}
                    </td>
                    <td className="border p-2">
                      {attendee.checkInTime
                        ? formatTime(attendee.checkInTime)
                        : "Not checked in"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border p-2 text-center">
                    No attendees yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Start Attendance Tracking and End Event Buttons */}
      <div className="mb-10">
        {!isPressed ? (
          <button
            className="bg-blue-900 text-white hover:bg-white hover:text-blue-900 w-full lg:w-full text-lg py-3 rounded-lg font-medium transition-colors duration-300 ease-in-out"
            style={{ fontFamily: "Poppins" }}
            onClick={() => setIsPressed(true)}
          >
            Start Attendance Tracking
          </button>
        ) : (
          <button
            className="bg-red-600 text-white hover:bg-white hover:text-red-600 w-full lg:w-full text-lg py-3 rounded-lg font-medium transition-colors duration-300 ease-in-out"
            style={{ fontFamily: "Poppins" }}
            onClick={() => setIsPressed(false)}
          >
            End Event
          </button>
        )}
      </div>
    </div>
  );
}
