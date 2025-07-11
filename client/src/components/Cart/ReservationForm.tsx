import React, { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type CartItem = {
  deviceid: string;
  devicename: string;
  startDate?: string;
  endDate?: string;
};

type ReservationFormData = {
  firstname: string;
  secondname: string;
  matrikelnumber: string;
  email: string;
};

type Reservation = {
  matrikelnumber: number;
  startdate: string;
  enddate: string;
  deviceid: string;
  devicename: string;
  firstname: string;
  secondname: string;
  email: string;
};

type ReservationFormProps = {
  cart: CartItem[];
  onSubmitSuccess: () => void;
  onCancel: () => void;
};

export default function ReservationForm({ cart, onSubmitSuccess, onCancel }: ReservationFormProps) {
  const [formData, setFormData] = useState<ReservationFormData>({
    firstname: "",
    secondname: "",
    matrikelnumber: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const users = {
      firstname: formData.firstname,
      secondname: formData.secondname,
      matrikelnumber: formData.matrikelnumber,
      email: formData.email,
    };

    try {
      await fetch(`${API_BASE_URL}/addUsers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users),
      });

      for (const item of cart) {
        const reservation: Reservation = {
          matrikelnumber: Number(formData.matrikelnumber),
          startdate: item.startDate || '',
          enddate: item.endDate || '',
          deviceid: item.deviceid,
          devicename: item.devicename,
          firstname: formData.firstname,
          secondname: formData.secondname,
          email: formData.email,
        };

        const res = await fetch(`${API_BASE_URL}/reservations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reservation),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error(`Failed for ${item.deviceid}:`, errorData.error);
        }
      }

      console.log("All reservations submitted.");
      onSubmitSuccess();
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded bg-black-500">
      <h3 className="text-lg font-semibold mb-2">Reservation Details</h3>

      <div>
        <label htmlFor="firstname">First Name*</label>
        <input
          id="firstname"
          name="firstname"
          type="text"
          required
          value={formData.firstname}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div>
        <label htmlFor="secondname">Second Name*</label>
        <input
          id="secondname"
          name="secondname"
          type="text"
          required
          value={formData.secondname}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div>
        <label htmlFor="matrikelnumber">Matrikel Number*</label>
        <input
          id="matrikelnumber"
          name="matrikelnumber"
          type="text"
          required
          value={formData.matrikelnumber}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div>
        <label htmlFor="email">Email*</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div>
        <h4 className="font-semibold mb-1">Devices to reserve:</h4>
        <ul className="list-disc list-inside max-h-40 overflow-auto border p-2 rounded bg-black-400">
          {cart.map(({ deviceid, devicename, startDate, endDate }) => (
            <li key={deviceid}>
              <strong>{devicename}</strong> (ID: {deviceid}){" "}
              {startDate && endDate && (
                <em>
                  from {startDate} to {endDate}
                </em>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Submit Reservation
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500">
          Cancel
        </button>
      </div>
    </form>
  );
}
