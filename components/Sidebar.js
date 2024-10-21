import { FiGrid, FiLogOut, FiLayers } from "react-icons/fi";


export default function Sidebar() {
return (
    <>
      <div className="h-screen w-1/4 bg-black rounded-tr-3xl rounded-br-3xl p-6 flex flex-col">
        {/* Sidebar Content */}
        <div className="flex flex-col space-y-4">
          <span className="text-gray-500 text-sm pl-4">OVERVIEW</span>

          {/* Dashboard Button */}
          <button
           //  onClick={handleDashboard}
            className="btn btn-ghost flex items-center gap-2 text-blue-700 text-lg"
          >
            <FiGrid className="text-2xl" />
            <span>Dashboard</span>
          </button>

          {/* Cards Button */}
          <button
            // onClick={handleCards}
            className="btn btn-ghost flex items-center gap-2 text-blue-700 text-lg"
          >
            <FiLayers className="text-2xl" />
            <span>Cards</span>
          </button>
        </div>

        {/* Logout Button */}
        <div className="mt-auto">
          <button
           //  onClick={handleLogout}
            className="btn btn-ghost flex items-center gap-2 text-red-600 text-lg"
          >
            <FiLogOut className="text-2xl" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </>
)


}


