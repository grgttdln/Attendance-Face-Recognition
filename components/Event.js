"use client";
import React, { useEffect, useState } from "react";
import { collection, getDoc, doc, onSnapshot } from "firebase/firestore"; // Import onSnapshot for real-time updates
import { db } from "../firebase/config";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Events(props) {
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPressed, setIsPressed] = useState(false); // Tracks whether attendance tracking has started
  const [isPastDue, setIsPastDue] = useState(false); // Tracks if the event is past due
  const [message, setMessage] = useState("");

  // Function to format time from "HH:mm" to "h:mm AM/PM"
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  // Function to format date from "YYYY-MM-DD" to "Month Day, Year"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle CSV export
  const handleExportCSV = () => {
    if (!event || !event?.name) {
      console.error("Event title is not available");
      return;
    }

    const headers = ["#", "Name", "Status", "Time"];
    const rows = attendees.map((attendee, index) => [
      index + 1,
      attendee.id,
      attendee.status || "N/A",
      attendee.time || "Not checked in",
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const fileName = `${event.name} - Attendees.csv`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle PDF export
  const handleExportPDF = () => {
    if (!event || !event?.name) {
      console.error("Event title is not available");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(event.name, 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${formatDate(event.date)}`, 20, 30);
    doc.text(
      `Time: ${formatTime(event.startTime)} - ${formatTime(event.endTime)}`,
      20,
      40
    );

    const tableData = attendees.map((attendee, index) => [
      index + 1,
      attendee.id,
      attendee.status || "N/A",
      attendee.time || "Not checked in",
    ]);

    doc.autoTable({
      head: [["#", "Name", "Status", "Time"]],
      body: tableData,
      startY: 50,
    });

    const fileName = `${event.name} - Attendees.pdf`;
    doc.save(fileName);
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
          const eventData = eventDoc.data();
          setEvent({
            id: eventDoc.id,
            ...eventData,
          });

          const eventDate = new Date(eventData.date);
          if (eventDate < new Date() || eventData.status === true) {
            setIsPastDue(true);
          }
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

    const fetchAttendees = () => {
      if (!props.eventId) return;

      // Use onSnapshot for real-time updates
      const attendeesCollection = collection(
        db,
        "events",
        props.eventId,
        "attendees"
      );
      const unsubscribe = onSnapshot(
        attendeesCollection,
        (snapshot) => {
          const attendeesList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAttendees(attendeesList);
        },
        (error) => {
          console.error("Error fetching attendees: ", error);
          setError("Failed to load attendees data");
        }
      );

      return unsubscribe; // Return the unsubscribe function
    };

    fetchEvent();
    const unsubscribeAttendees = fetchAttendees();

    return () => unsubscribeAttendees(); // Cleanup on component unmount
  }, [props.eventId]);

  const processAttendanceStart = async () => {
    console.log("Attendance tracking started");
    try {
      const response = await fetch("/api/run_python", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: event.name, action: "start" }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData}`
        );
      }
    } catch (error) {
      console.error("Error processing attendance:", error);
      setMessage(`Error: ${error.message}`);
      setError(`Failed to process attendance: ${error.message}`);
    }
  };

  const processAttendanceEnd = async () => {
    console.log("Attendance tracking ended");
    try {
      const response = await fetch("/api/run_python", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "terminate" }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData}`
        );
      }

      const result = await response.json();
      console.log("Attendance tracking termination result:", result);
    } catch (error) {
      console.error("Error ending attendance:", error);
      setMessage(`Error: ${error.message}`);
      setError(`Failed to terminate attendance process: ${error.message}`);
    }
  };

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
        <h1
          className="text-xl font-medium text-white mb-8"
          style={{ fontFamily: "Poppins" }}
        >
          Presenza
        </h1>

        <h1
          className="text-2xl font-semibold text-white mb-1"
          style={{ fontFamily: "Poppins" }}
        >
          {event?.title || props.eventId}
        </h1>

        <div className="w-full flex justify-between font-semibold text-white">
          <p>{formatDate(event?.date) || "Date not available"}</p>
          <p>{`${
            formatTime(event?.startTime) || "Start Time not available"
          } - ${formatTime(event?.endTime) || "End Time not available"}`}</p>
        </div>
      </div>

      {/* Attendees Section */}
      <div>
        <h2
          className="text-lg font-medium mb-4"
          style={{ fontFamily: "Poppins" }}
        >
          Attendees
        </h2>
        <table className="w-full text-left table-auto border-collapse shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="border-b-2 border-gray-300 p-4">#</th>
              <th className="border-b-2 border-gray-300 p-4">Name</th>
              <th className="border-b-2 border-gray-300 p-4">Status</th>
              <th className="border-b-2 border-gray-300 p-4">Time</th>
            </tr>
          </thead>
          <tbody>
            {attendees.length > 0 ? (
              attendees.map((attendee, index) => (
                <tr
                  key={attendee.id}
                  className="bg-gray-100 hover:bg-gray-200 transition duration-200"
                >
                  <td className="border-b border-gray-300 p-4">{index + 1}</td>
                  <td className="border-b border-gray-300 p-4">
                    {attendee.id}
                  </td>
                  <td className=" flex items-center border-b border-gray-300 p-4">
                    <div
                      className={`w-4 h-4 inline-block mr-2 ${
                        attendee.status === "attended"
                          ? "bg-green-500"
                          : attendee.status === "absent"
                          ? "bg-red-500"
                          : attendee.status === "late"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                    {attendee.status || "N/A"}
                  </td>
                  <td className="border-b border-gray-300 p-4">
                    {attendee.time || "Not checked in"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="border-b border-gray-300 p-4 text-center text-gray-500"
                >
                  No attendees yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isPastDue && (
        <button
          onClick={handleExportCSV}
          className="bg-blue-900 text-white hover:bg-white hover:text-blue-900 w-full lg:w-full text-lg py-3 rounded-lg font-medium transition-colors duration-300 ease-in-out mt-4"
          style={{ fontFamily: "Poppins" }}
        >
          Export CSV
        </button>
      )}

      {/* Export PDF Button */}
      {isPastDue && (
        <button
          onClick={handleExportPDF}
          className="bg-blue-900 text-white hover:bg-white hover:text-blue-900 w-full lg:w-full text-lg py-3 rounded-lg font-medium transition-colors duration-300 ease-in-out mt-4"
          style={{ fontFamily: "Poppins" }}
        >
          Export as PDF
        </button>
      )}

      {/* Attendance Control Buttons */}
      {!isPastDue && !isPressed && (
        <button
          className="bg-blue-900 text-white hover:bg-white hover:text-blue-900 w-full lg:w-full text-lg py-3 rounded-lg font-medium transition-colors duration-300 ease-in-out mt-4"
          style={{ fontFamily: "Poppins" }}
          onClick={() => {
            setIsPressed(true);
            processAttendanceStart();
          }}
        >
          Start Attendance Tracking
        </button>
      )}

      {/* End Event Button */}
      {isPressed && !isPastDue && (
        <button
          className="bg-red-600 text-white hover:bg-white hover:text-red-600 w-full lg:w-full text-lg py-3 rounded-lg font-medium transition-colors duration-300 ease-in-out mt-4"
          style={{ fontFamily: "Poppins" }}
          onClick={() => {
            setIsPressed(false);
            processAttendanceEnd();
          }}
        >
          End Event
        </button>
      )}

      {/* Messages */}
      {message && <div className="mt-4 text-red-600">{message}</div>}
    </div>
  );
}
