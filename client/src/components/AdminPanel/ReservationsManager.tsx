import React, { useState, useEffect } from "react";
import AdminCalendar from "./AdminCalendar";
import ReservationDetailsModal from "./ReservationsDetailsModal.tsx";

interface Reservation {
  reservationnumber: number;
  matrikelnumber: number;
  startdate: string;
  enddate: string;
  status: string;
  deviceid: string;
  devicename: string;
  firstname: string;
  secondname: string;
  email: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ReservationsManager: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const token = localStorage.getItem("authToken");

  const fetchReservations = () => {
    if (!token) return;

    fetch(`${API_BASE_URL}/admin/reservations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setReservations(data.reservations || []))
      .catch((err) => console.error("API fetch error:", err));
  };

  useEffect(() => {
    fetchReservations();
  }, [token]);

  const handleEventClick = (reservationData: Partial<Reservation>) => {
    setSelectedReservation(reservationData as Reservation);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedReservation(null);
  };

  const handleSaveReservation = (updatedReservation: Reservation) => {
    if (!token) return;

    const payload = {
      startdate: updatedReservation.startdate,
      enddate: updatedReservation.enddate,
      status: updatedReservation.status,
    };

    fetch(`${API_BASE_URL}/admin/reservations/${updatedReservation.reservationnumber}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(() => {
        fetchReservations();
        setModalOpen(false);
        setSelectedReservation(null);
      })
      .catch((err) => console.error("Update error:", err));
  };

  const handleDelete = async (reservationnumber: number) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/reservations/${reservationnumber}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const err = await response.json();
        alert(`Failed to delete reservation: ${err.error || response.statusText}`);
        return;
      }
      setReservations((prev) => prev.filter((r) => r.reservationnumber !== reservationnumber));
      setSelectedReservation(null);
      setModalOpen(false);
    } catch (error) {
      alert("Error deleting reservation");
      console.error(error);
    }
  };

  const events = reservations.map((r) => ({
    id: r.reservationnumber,
    title: `${r.firstname} ${r.secondname} - ${r.devicename}`,
    start: r.startdate,
    end: r.enddate,
    allDay: true,
    extendedProps: r,
  }));

  return (
    <div className="text-black">
      <h2 className="text-xl text-black font-semibold mb-4">Reservierungen</h2>

      <div className="w-[90vw] md:w-[80vw] flex justify-center mb-6">
        <AdminCalendar events={events} onEventClick={handleEventClick} />
      </div>

      <h3 className="text-lg font-semibold mb-2 md:ml-4">Alle Reservierungen</h3>


        <table className="w-full text-black table-auto border-collapse border border-gray-300 md:ml-4">
          <thead className="hidden md:table-header-group">
            <tr>
              <th className="border border-gray-300 p-2">Reservierungsnummer</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Gerät</th>
              <th className="border border-gray-300 p-2">Startdatum</th>
              <th className="border border-gray-300 p-2">Enddatum</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Aktionen</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {reservations.map((r) => (
              <tr
                key={r.reservationnumber}
                className="block md:table-row border border-gray-300 mb-4 md:mb-0 p-2 md:p-0 rounded md:rounded-none bg-white shadow md:shadow-none"
              >
                <td className="block md:table-cell md:border border-gray-300 p-2">
                  <span className="font-semibold md:hidden">Reservierungsnummer: </span>
                  {r.reservationnumber}
                </td>
                <td className="block md:table-cell md:border border-gray-300 p-2">
                  <span className="font-semibold md:hidden">Name: </span>
                  {r.firstname} {r.secondname}
                </td>
                <td className="block md:table-cell md:border border-gray-300 p-2">
                  <span className="font-semibold md:hidden">Gerät: </span>
                  {r.devicename}
                </td>
                <td className="block md:table-cell md:border border-gray-300 p-2">
                  <span className="font-semibold md:hidden">Startdatum: </span>
                  {r.startdate}
                </td>
                <td className="block md:table-cell md:border border-gray-300 p-2">
                  <span className="font-semibold md:hidden">Enddatum: </span>
                  {r.enddate}
                </td>
                <td className="block md:table-cell md:border border-gray-300 p-2">
                  <span className="font-semibold md:hidden">Status: </span>
                  {r.status}
                </td>
                <td className="block md:table-cell md:border border-gray-300 p-2">
                  <div className="flex gap-2 justify-start md:justify-center">
                    <button
                      className="text-sm border p-2 rounded hover:bg-gray-100"
                      onClick={() => {
                        setSelectedReservation(r);
                        setModalOpen(true);
                      }}
                    >
                      Bearbeiten
                    </button>
                    <button
                      className="text-white text-sm bg-black p-2 rounded hover:bg-black/80"
                      onClick={() => handleDelete(r.reservationnumber)}
                    >
                      Löschen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      {modalOpen && selectedReservation && (
        <ReservationDetailsModal
          reservation={selectedReservation}
          onClose={closeModal}
          onSave={handleSaveReservation}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ReservationsManager;
