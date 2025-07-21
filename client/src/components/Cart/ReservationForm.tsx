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
  const [error, setError] = useState<string>("");
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "matrikelnumber") {
      // allow only digits
      if (!/^\d*$/.test(value)) return;
      if (value.length > 7) return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setError(""); // clear error on change

    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrivacyAccepted(e.target.checked);
    setError(""); // clear error if they check it
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{7}$/.test(formData.matrikelnumber)) {
      setError("Matrikelnummer muss genau 7 Ziffern sein.");
      return;
    }

    if (!privacyAccepted) {
      setError("Bitte akzeptieren Sie die Datenschutzerklärung.");
      return;
    }

    const users = {
      firstname: formData.firstname,
      secondname: formData.secondname,
      matrikelnumber: formData.matrikelnumber,
      email: formData.email,
    };

    try {
      await fetch(`${API_BASE_URL}/users/addUser`, {
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
      onSubmitSuccess();
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        flex flex-col gap-3
        bg-white rounded-lg shadow-lg p-4
        text-black max-h-[800px] overflow-auto
      `}
    >
      <h3 className="text-xl font-semibold border-b border-gray-300 pb-2">Reservierungsdetails</h3>

      <div className="flex flex-col gap-1">
        <label htmlFor="firstname" className="text-sm font-medium">Vorname*</label>
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

      <div className="flex flex-col gap-1">
        <label htmlFor="secondname" className="text-sm font-medium">Nachname*</label>
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

      <div className="flex flex-col gap-1">
        <label htmlFor="matrikelnumber" className="text-sm font-medium">Matrikelnummer*</label>
        <input
          id="matrikelnumber"
          name="matrikelnumber"
          type="text"
          required
          value={formData.matrikelnumber}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          placeholder="z.B. 0123457"
        />
        {error && (
          <span className="text-red-600 text-sm">{error}</span>
        )}
      </div>


      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">E-Mail*</label>
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
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="privacy"
          checked={privacyAccepted}
          onChange={handlePrivacyChange}
          className="border rounded accent-white bg-white"
        />
        <label htmlFor="privacy" className="text-sm">
          Ich habe die <a href="/datenschutz" target="_blank" className="text-black-600 underline">Datenschutzerklärung</a> gelesen und akzeptiere sie.
        </label>
      </div>

      {error && (
        <span className="text-red-600 text-sm">{error}</span>
      )}

      <div>
        <h4 className="font-semibold mb-1">Geräte zur Reservierung:</h4>
        <ul className="list-disc list-inside max-h-32 overflow-auto border p-2 rounded bg-gray-50">
          {cart.map(({ deviceid, devicename, startDate, endDate }) => (
            <li key={deviceid} className="text-sm">
              <strong>{devicename}</strong> (ID: {deviceid}){" "}
              {startDate && endDate && (
                <em>
                  von {new Date(startDate).toLocaleDateString()} bis {new Date(endDate).toLocaleDateString()}
                </em>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="submit"
          className="flex-1 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors font-medium"
        >
          Reservieren
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors font-medium"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
