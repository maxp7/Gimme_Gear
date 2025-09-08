import React, { useState } from "react";
import ReservationsManager from "./ReservationsManager";
import UsersManager from "./UserManager";
import DeviceManager from "./DeviceManager";
import NavBar from "../NavBar/NavBar";

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"reservations" | "users" | "devices">("reservations");

  return (
    <div className="min-h-screen flex flex-col max-w-[95vw]">
      <NavBar />

      <div className="flex flex-col md:flex-row flex-1">
        <nav className="flex mt-4 md:flex-col w-full md:w-48 p-2 md:p-4 gap-2 bg-white md:bg-transparent overflow-x-auto md:overflow-visible">
          <button
            className={`flex-1 md:flex-none p-2 rounded text-black text-center md:text-left whitespace-nowrap ${
              activeTab === "reservations" ? "bg-black text-white" : "hover:bg-black/70 hover:text-white"
            }`}
            onClick={() => setActiveTab("reservations")}
          >
            Reservierungen
          </button>
          <button
            className={`flex-1 md:flex-none p-2 rounded text-black text-center md:text-left whitespace-nowrap ${
              activeTab === "users" ? "bg-black text-white" : "hover:bg-black/70 hover:text-white"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Benutzer
          </button>
          <button
            className={`flex-1 md:flex-none p-2 rounded text-black text-center md:text-left whitespace-nowrap ${
              activeTab === "devices" ? "bg-black text-white" : "hover:bg-black/70 hover:text-white"
            }`}
            onClick={() => setActiveTab("devices")}
          >
            Geräte
          </button>
        </nav>

        {/* Основной контент */}
        <main className="flex-1 p-4 md:p-6 bg-white overflow-x-auto">
          {activeTab === "reservations" && <ReservationsManager />}
          {activeTab === "users" && <UsersManager />}
          {activeTab === "devices" && <DeviceManager />}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
