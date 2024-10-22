"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Cards(props) {
  const formatTime = (timeString) => {};

  return (
    <>
      {/* Upcoming Events Section */}
      <Link href={`/event/${props.title}`}>
        <div className="bg-transparent">
          <button
            className="bg-white shadow-md p-6 rounded-lg flex flex-col items-center border border-gray-200 hover:shadow-xl transition-shadow"
            style={{ fontFamily: "Poppins" }}
          >
            <Image
              src="https://via.placeholder.com/400x250"
              width={400}
              height={250}
              alt="Event Image"
              className="mb-4"
            />
            <h3 className="text-xl font-bold text-blue-900 mb-2 text-left w-full">
              {props.title}
            </h3>
            <div className="w-full flex justify-between text-gray-600">
              <p>{props.date}</p>
              <p>
                {props.sTime}-{props.eTime}
              </p>
            </div>
          </button>
        </div>
      </Link>
    </>
  );
}
