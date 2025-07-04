import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface Reservation {
  reservationnumber: string;
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

const ReservationsUI: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationFormData, setReservationFormData] = useState<
    Omit<Reservation, "reservationnumber" | "status" | "devicename">
  >({
    matrikelnumber: 0,
    startdate: "",
    enddate: "",
    deviceid: "",
    firstname: "",
    secondname: "",
    email: "",
  });

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
      .catch((err) => {
        console.error("API fetch error:", err);
      });
  };

  useEffect(() => {
    fetchReservations();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReservationFormData((prev) => ({
      ...prev,
      [name]: name === "matrikelnumber" ? parseInt(value) : value,
    }));
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch(`${API_BASE_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservationFormData),
    })
      .then((res) => {
        if (!res.ok) {
          console.error(`Server error: ${res.status}`);
          return res.text().then((text) => console.error("Error page:", text));
        }
        return res.json();
      })
      .then((data) => {
        if (data?.reservation) {
          console.log("Reservation added:", data.reservation);
          fetchReservations();
        } else if (data?.error) {
          console.error("Failed to add reservation:", data.error);
        }
        setReservationFormData({
          matrikelnumber: 0,
          startdate: "",
          enddate: "",
          deviceid: "",
          firstname: "",
          secondname: "",
          email: "",
        });
      })
      .catch((err) => console.error("POST error:", err));
  };

  const events = reservations.map((r) => ({
    id: r.reservationnumber,
    title: `${r.firstname} ${r.secondname} - ${r.devicename}`,
    start: r.startdate,
    end: r.enddate,
    allDay: true,
    extendedProps: {
      firstname: r.firstname,
      secondname: r.secondname,
      devicename: r.deviceid,
      status: r.status,
      email: r.email,
    },
  }));

  const renderEventContent = (arg: EventContentArg) => (
    <div>
      <strong>{arg.event.title}</strong>
    </div>
  );

  return (
    <div>
      <h2>Admin Calendar</h2>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={false}
        editable={false}
        events={events}
        eventContent={renderEventContent}
      />

      <h3>Add New Reservation</h3>

      <form
        onSubmit={handleReservationSubmit}
        style={{
          display: "grid",
          gap: "0.5rem",
          maxWidth: "400px",
          marginTop: "1rem",
        }}
      >
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          value={reservationFormData.firstname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="secondname"
          placeholder="Last Name"
          value={reservationFormData.secondname}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={reservationFormData.email}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="matrikelnumber"
          placeholder="Matrikel Number"
          value={reservationFormData.matrikelnumber || ""}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="deviceid"
          placeholder="Device ID"
          value={reservationFormData.deviceid}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="startdate"
          value={reservationFormData.startdate}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="enddate"
          value={reservationFormData.enddate}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Reservation</button>
      </form>
    </div>
  );
};

export default ReservationsUI;
