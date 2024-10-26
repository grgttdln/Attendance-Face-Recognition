"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Cards(props) {
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

  // State to store the image source
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    // Check if an image has already been assigned for this card
    const savedImage = localStorage.getItem(`card-image-${props.title}`);
    
    if (savedImage) {
      // Use the saved image if it exists
      setImageSrc(savedImage);
    } else {
      // Otherwise, generate a new random image, save it, and set it in state
      const randomImageNumber = Math.floor(Math.random() * 10) + 1;
      const newImageSrc = `/${randomImageNumber}.png`;
      localStorage.setItem(`card-image-${props.title}`, newImageSrc);
      setImageSrc(newImageSrc);
    }
  }, [props.title]);

  return (
    <>
      {/* Upcoming Events Section */}
      <Link href={`/event/${props.title}`}>
        <div className="bg-transparent">
          <button
            className="bg-white shadow-md p-6 rounded-lg flex flex-col items-center border border-gray-200 hover:shadow-xl transition-shadow"
            style={{ fontFamily: "Poppins" }}
          >
            {imageSrc && (
              <Image
                src={imageSrc}
                width={400}
                height={250}
                alt="Event Image"
                className="mb-4"
              />
            )}
            <h3 className="text-xl font-bold text-blue-900 mb-2 text-left w-full">
              {props.title}
            </h3>
            <div className="w-full flex justify-between text-gray-600">
              <p>{formatDate(props.date)}</p>
              <p>
                {formatTime(props.sTime)} - {formatTime(props.eTime)}
              </p>
            </div>
          </button>
        </div>
      </Link>
    </>
  );
}
