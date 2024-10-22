import { FiLogOut } from "react-icons/fi";
import { BiParty } from "react-icons/bi";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdHistory } from "react-icons/md";
import Link from "next/link";


export default function Sidebar() {
return (
    <>
      <div className="h-screen w-1/4 bg-white shadow-xl rounded-tr-3xl rounded-br-3xl p-6 flex flex-col">
        {/* Sidebar Content */}
        <div className="flex flex-col space-y-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 mt-2 ml-5 mb-8">
            <img
              src="/image.png"
              alt="logo"
              className="w-16 h-16 rounded-full"
            />
            <span className="text-3xl p-2 text-blue-900 font-bold">Presenza</span>
          </div>
          

          <span className="text-gray-500 text-sm pl-4 mb-4">OVERVIEW</span>
          <div className="mt-auto">
          {/* Dashboard Button */}
          <Link href="/dashboard">
          <button
           //  onClick={handleDashboard}
            className="btn btn-ghost flex items-center pr-20 gap-2 text-blue-900 text-lg mb-4"
          >
            <LuLayoutDashboard className="text-2xl" />
            <span>Dashboard</span>
          </button>
          </Link>

          {/* Cards Button */}
          <Link href="/events">
          <button
            // onClick={handleCards}
            className="btn btn-ghost flex items-center pr-20 gap-2 text-blue-900 text-lg mb-4"
          >
            <BiParty className="text-2xl" />
            <span>Events</span>
          </button>
          </Link>

          {/* History Button */}
          <Link href="/history">
          <button
            // onClick={handleCards}
            className="btn btn-ghost flex items-center pr-20 gap-2 text-blue-900 text-lg mb-4"
          >
            <MdHistory className="text-2xl" />
            <span>History</span>
          </button>
          </Link>


          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-auto">
          <Link href="/">
          <button
           //  onClick={handleLogout}
            className="btn btn-ghost flex items-center gap-2 text-red-600 text-lg"
          >
            <FiLogOut className="text-2xl" />
            <span>Log out</span>
          </button>
          </Link>
        </div>
      </div>
    </>
)


}


