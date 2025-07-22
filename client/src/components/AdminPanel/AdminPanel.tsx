import React, { useState } from "react";
import ReservationsManager from "./ReservationsManager";
import UsersManager from "./UserManager";
import DeviceManager from "./DeviceManager";
import NavBar from "../NavBar/NavBar";

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"reservations" | "users" | "devices">("reservations");

  return (
    <div><NavBar />
      <div className="flex min-h-screen">
        <nav className="w-48 p-4 flex flex-col gap-2 mt-4">
          <button
            className={`p-2 rounded text-black hover:cursor-pointer ${activeTab === "reservations" ? "bg-black text-white" : "hover:bg-[black]/70 hover:text-white hover:cursor-pointer"}`}
            onClick={() => setActiveTab("reservations")}
          >
            Reservierungen
          </button>
          <button
            className={`p-2 rounded text-black hover:cursor-pointer ${activeTab === "users" ? "bg-black text-white" : "hover:bg-[black]/70 hover:text-white hover:cursor-pointer"}`}
            onClick={() => setActiveTab("users")}
          >
            Benutzer
          </button>
          <button
            className={`p-2 rounded text-black hover:cursor-pointer ${activeTab === "devices" ? "bg-black text-white" : "hover:bg-[black]/70 hover:text-white hover:cursor-pointer"}`}
            onClick={() => setActiveTab("devices")}
          >
            Geräte
          </button>
        </nav>

        <main className="flex-1 p-6 bg-white">
          {activeTab === "reservations" && <ReservationsManager />}
          {activeTab === "users" && <UsersManager />}
          {activeTab === "devices" && <div><DeviceManager /></div>}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
