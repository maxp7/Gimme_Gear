import React, { useState, useEffect, useRef } from "react";

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

interface ReservationDetailsModalProps {
  reservation: Reservation;
  onClose: () => void;
  onSave: (updatedReservation: Reservation) => void;
  onDelete: (reservationnumber: number) => void;
}

const ReservationDetailsModal: React.FC<ReservationDetailsModalProps> = ({
  reservation,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Reservation>(reservation);
 const modalRef = useRef<HTMLFormElement>(null);


  useEffect(() => {
    setFormData(reservation);
  }, [reservation]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "matrikelnumber" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      onDelete(formData.reservationnumber);
    }
  };


useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [onClose]);

  return (
    <div className="fixed bg-[gray]/70 inset-0 flex justify-center items-center z-10">
    <form
      ref={modalRef}
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-6 w-[90vw] max-w-md max-h-[98vh] overflow-y-auto
                 flex flex-col gap-4"
    >
        <h2 className="text-2xl font-semibold text-black mb-2">Reservierung bearbeiten</h2>

        <label className="flex flex-col text-sm text-gray-700">
          Reservierungsnummer
          <input
            className="border rounded px-2 py-1 mt-1"
            type="text"
            name="reservationnumber"
            value={formData.reservationnumber}
            readOnly
          />
        </label>

        <label className="flex flex-col text-sm text-gray-700">
          Status
          <select
            className="border rounded px-2 py-1 mt-1"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Reserviert">Reserviert</option>
            <option value="Bestätigt">Bestätigt</option>
            <option value="Verliehen">Verliehen</option>
          </select>
        </label>

        <label className="flex flex-col text-sm text-gray-700">
          Gerät ID
          <input
            className="border rounded px-2 py-1 mt-1"
            type="text"
            name="deviceid"
            value={formData.deviceid}
            onChange={handleChange}
            required
          />
        </label>

        <label className="flex flex-col text-sm text-gray-700">
          Gerätname
          <input
            className="border rounded px-2 py-1 mt-1"
            type="text"
            name="devicename"
            value={formData.devicename}
            onChange={handleChange}
            required
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col text-sm text-gray-700">
            Startdatum
            <input
              className="border rounded px-2 py-1 mt-1"
              type="date"
              name="startdate"
              value={formData.startdate}
              onChange={handleChange}
              required
            />
          </label>

          <label className="flex flex-col text-sm text-gray-700">
            Enddatum
            <input
              className="border rounded px-2 py-1 mt-1"
              type="date"
              name="enddate"
              value={formData.enddate}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label className="flex flex-col text-sm text-gray-700">
          Vorname
          <input
            className="border rounded px-2 py-1 mt-1"
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </label>

        <label className="flex flex-col text-sm text-gray-700">
          Nachname
          <input
            className="border rounded px-2 py-1 mt-1"
            type="text"
            name="secondname"
            value={formData.secondname}
            onChange={handleChange}
            required
          />
        </label>

        <label className="flex flex-col text-sm text-gray-700">
          E-mail
          <input
            className="border rounded px-2 py-1 mt-1"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="flex flex-col text-sm text-gray-700">
          Matrikelnummer
          <input
            className="border rounded px-2 py-1 mt-1"
            type="number"
            name="matrikelnumber"
            value={formData.matrikelnumber}
            onChange={handleChange}
            required
          />
        </label>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
            onClick={onClose}
          >
            Abbrechen
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
            onClick={handleDelete}
          >
            Löschen
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-900 transition"
          >
            Speichern
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationDetailsModal;
