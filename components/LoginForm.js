"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple check for credentials (for demo purposes)
    if (username === "admin" && password === "password") {
      router.push("/dashboard");
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-20">
        {/* Left side with the image and text */}
        <div className="flex flex-col items-start mr-24"> {/* Ensured the entire div uses items-start */}
          <Image
            src="/image.png"
            alt="Logo"
            width={500}
            height={500}
          />
          
          <div className="flex flex-col items-start mt-4"> {/* Wrapped text in a div to maintain left alignment */}
            <h1 className="text-5xl font-semibold text-blue-900 text-center mt-4" style={{ fontFamily: 'Poppins' }}>
              Presenza
            </h1>
            <p className="text-xl font-medium text-blue-800 text-left mt-4 mb-6" style={{ fontFamily: 'Poppins' }}>
              Where your face is your pass.
            </p>
          </div>
        </div>
        {/* Right side with login form */}
        <div className="w-full max-w-md">
          

          {/* Login Form */}
          <div className="bg-white shadow-lg rounded-lg p-10">
            <h2 className="text-xl font-semibold text-left text-black mb-4" style={{ fontFamily: 'Poppins' }}>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-black" style={{ fontFamily: 'Poppins' }}>Email</span>
                </label>
                <input
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input border-blue-400 bg-white text-black w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text text-black" style={{ fontFamily: 'Poppins' }}>Password</span>
                </label>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input border-blue-400 bg-white text-black w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="form-control">
                <button
                  type="submit"
                  className="btn btn-primary w-full bg-blue-600 border-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </main>
  );
}