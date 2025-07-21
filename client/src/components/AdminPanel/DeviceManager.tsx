import React, { useEffect, useState } from "react";
import DeviceDetailsModal from "./DeviceDetailsModal";

interface Device {
  deviceid: string;
  devicename: string;
  devicedescription?: string;
  status?: string;
  comments?: string;
  owner: string;
  location: string;
  full_description?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const DeviceManager: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [addingDevice, setAddingDevice] = useState(false);

  useEffect(() => {
  fetch(`${API_BASE_URL}/devices/getDevices`)
    .then((res) => res.json())
    .then((data) => {
  console.log("API data:", data);
  setDevices(Array.isArray(data) ? data : data.devices || []);
})

    .catch((err) => console.error("Failed to fetch devices:", err));
}, []);


  const handleDelete = async (deviceid: string) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/devices/deleteDevice/${deviceid}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete device");

        setDevices((prev) => prev.filter((d) => d.deviceid !== deviceid));
      } catch (err) {
        console.error("Error deleting device:", err);
        alert("Could not delete device");
      }
    }
  };

  const handleSave = async (device: Device) => {
    if (addingDevice) {
      try {
        const res = await fetch(`${API_BASE_URL}/devices/addDevice`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(device),
        });
        if (!res.ok) throw new Error("Failed to add device");
        setDevices((prev) => [...prev, device]);
      } catch (err) {
        console.error(err);
        alert("Failed to add device");
      } finally {
        setAddingDevice(false);
        setEditingDevice(null);
      }
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/devices/updateDevice/${device.deviceid}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(device),
        });
        if (!res.ok) throw new Error("Failed to update device");

        setDevices((prev) =>
          prev.map((d) => (d.deviceid === device.deviceid ? device : d))
        );
        setEditingDevice(null);
      } catch (err) {
        console.error(err);
        alert("Failed to update device");
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl text-black font-semibold mb-4">Geräte</h2>

      <button
        onClick={() => {
          setAddingDevice(true);
          setEditingDevice({
            deviceid: "",
            devicename: "",
            devicedescription: "",
            status: "",
            comments: "",
            owner: "",
            location: "",
            full_description: "",
          });
        }}
        className="px-4 py-2 rounded bg-black text-white mb-4 hover:cursor-pointer hover:bg-[black]/70"
      >
        Add Device
      </button>

      <table className="w-full text-black table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Device ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Owner</th>
            <th className="border border-gray-300 p-2">Location</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.deviceid} className="hover:bg-gray-100 text-center">
              <td className="border border-gray-300 p-2">{device.deviceid}</td>
              <td className="border border-gray-300 p-2">{device.devicename}</td>
              <td className="border border-gray-300 p-2">{device.owner}</td>
              <td className="border border-gray-300 p-2">{device.location}</td>
              <td className="border border-gray-300 p-2">{device.status || "-"}</td>
              <td className="border border-gray-300 p-2 space-x-2">
                <div className="flex justify-center items-center">
                  <button
                    className="text-sm border p-2 rounded border-gray-300 shadow-md hover:bg-gray-100 hover:cursor-pointer"
                    onClick={() => {
                      setEditingDevice(device);
                      setAddingDevice(false);
                    }}
                  >
                    Bearbeiten
                  </button>
                  <button
                    className="text-white text-sm bg-[black] p-2 mx-1 rounded hover:cursor-pointer hover:bg-[black]/80"
                    onClick={() => handleDelete(device.deviceid)}
                  >
                    Löschen
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingDevice && (
        <DeviceDetailsModal
          device={editingDevice}
          onSave={handleSave}
          onClose={() => {
            setEditingDevice(null);
            setAddingDevice(false);
          }}
        />
      )}
    </div>
  );
};

export default DeviceManager;
