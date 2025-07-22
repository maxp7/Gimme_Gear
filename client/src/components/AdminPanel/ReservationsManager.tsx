import React, { useState, useEffect } from "react";
import AdminCalendar from "./AdminCalendar";
import ReservationDetailsModal from "./ReservationsDetailsModal.tsx";  // <-- import modal

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


  const token = localStorage.getItem("authToken");

  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
const [modalOpen, setModalOpen] = useState(false);


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
      .catch((err) => {
        console.error("API fetch error:", err);
      });
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
    .then((data) => {
      console.log("Reservation updated:", data);
      fetchReservations();
      setModalOpen(false);
      setSelectedReservation(null);
    })
    .catch((err) => {
      console.error("Update error:", err);
    });
};





const events = reservations.map((r) => ({
  id: r.reservationnumber,
  title: `${r.firstname} ${r.secondname} - ${r.devicename}`,
  start: r.startdate,
  end: r.enddate,
  allDay: true,
  extendedProps: {
    reservationnumber: r.reservationnumber,
    matrikelnumber: r.matrikelnumber,
    deviceid: r.deviceid,
    devicename: r.devicename,      
    startdate: r.startdate,
    enddate: r.enddate,
    status: r.status,
    firstname: r.firstname,
    secondname: r.secondname,
    email: r.email,
  },
}));

const handleDelete = async (reservationnumber: number) => {
  if (!token) return;

  try {
    const response = await fetch(`${API_BASE_URL}/admin/reservations/${reservationnumber}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const err = await response.json();
      alert(`Failed to delete reservation: ${err.error || response.statusText}`);
      return;
    }
    setReservations((prev) =>
      prev.filter((r) => r.reservationnumber !== reservationnumber)
    );
    setSelectedReservation(null);
    setModalOpen(false);

  } catch (error) {
    alert('Error deleting reservation');
    console.error(error);
  }
};

  return (
    <div className="text-black">
      <h2 className="text-xl text-black font-semibold mb-4">Reservierungen</h2>
      <div className="w-[80vw] flex justify-center">
        <AdminCalendar events={events} onEventClick={handleEventClick} />
      </div>
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
