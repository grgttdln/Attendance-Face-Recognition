"use client";
import React, { useEffect, useState } from "react";
import { collection, getDoc, doc, getDocs } from "firebase/firestore";
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

  // Function to format time from "HH:mm" to "h:mm AM/PM"
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

  const handleExportCSV = () => {
    console.log(event);
    if (!event || !event?.name) {
      console.error("Event title is not available");
      return;
    }
  
    // Define the CSV header
    const headers = ["#", "Name", "Status", "Time"];
  
    // Map the attendees to CSV format
    const rows = attendees.map((attendee, index) => [
      index + 1, // Serial number
      attendee.id, // Attendee's ID or Name
      attendee.status || "N/A", // Status (Checked-in or not)
      attendee.time || "Not checked in", // Time of check-in
    ]);
  
    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((e) => e.join(","))
      .join("\n");
  
    // Create a blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
    // Generate the file name: EventName - Attendees.csv
    const fileName = `${event.name} - Attendees.csv`;
  
    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    
    // Append link to the body (required for Firefox)
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up and remove the link
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (!event || !event?.name) {
      console.error("Event title is not available");
      return;
    }

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Title of the PDF
    doc.setFontSize(18);
    doc.text(event.name, 20, 20);

    // Event date and time
    doc.setFontSize(12);
    doc.text(`Date: ${formatDate(event.date)}`, 20, 30);
    doc.text(
      `Time: ${formatTime(event.startTime)} - ${formatTime(event.endTime)}`,
      20,
      40
    );

    // Prepare attendees table for the PDF
    const tableData = attendees.map((attendee, index) => [
      index + 1, // Serial number
      attendee.id, // Attendee's ID or Name
      attendee.status || "N/A", // Status (Checked-in or not)
      attendee.time || "Not checked in", // Time of check-in
    ]);

    // Add the table using jsPDF AutoTable plugin
    doc.autoTable({
      head: [["#", "Name", "Status", "Time"]],
      body: tableData,
      startY: 50,
    });

    // Generate the file name: EventName - Attendees.pdf
    const fileName = `${event.name} - Attendees.pdf`;

    // Save the PDF
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

          // Check if the event is past due or the status is true
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
        <h1 className="text-xl font-medium text-white mb-8" style={{ fontFamily: "Poppins" }}>
          Presenza
        </h1>

        <h1 className="text-2xl font-semibold text-white mb-1" style={{ fontFamily: "Poppins" }}>
          {event?.title || props.eventId}
        </h1>

        <div className="w-full flex justify-between font-semibold text-white">
          <p>{formatDate(event?.date) ? formatDate(new Date(event.date).toLocaleDateString()) : "Date not available"}</p>
          <p>
            {formatTime(event?.startTime) || "Start Time not available"} - {formatTime(event?.endTime) || "End Time not available"}
          </p>
        </div>
      </div>

      {/* Attendees Table */}
      {isPressed || isPastDue ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-4" style={{ fontFamily: "Poppins" }}>
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
                attendees.map((attendee, index) => (
                  <tr key={attendee.id} className="bg-gray-100">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{attendee.id}</td>
                    <td className="border p-2">{attendee.status || "N/A"}</td>
                    <td className="border p-2">{attendee.time || "Not checked in"}</td>
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

          {/* Export CSV Button */}
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
        </div>
      ) : null}

      {/* Start Attendance Tracking Button */}
      {!isPastDue && !isPressed && (
        <button
          className="bg-blue-900 text-white hover:bg-white hover:text-blue-900 w-full lg:w-full text-lg py-3 rounded-lg font-medium transition-colors duration-300 ease-in-out"
          style={{ fontFamily: "Poppins" }}
          onClick={() => setIsPressed(true)}
        >
          Start Attendance Tracking
        </button>
      )}

      {/* End Event Button */}
      {isPressed && !isPastDue && (
        <button
          className="bg-red-600 text-white hover:bg-white hover:text-red-600 w-full lg:w-full text-lg py-3 rounded-lg font-medium transition-colors duration-300 ease-in-out mt-4"
          style={{ fontFamily: "Poppins" }}
          onClick={() => setIsPressed(false)}
        >
          End Event
        </button>
      )}
    </div>
  );
}
