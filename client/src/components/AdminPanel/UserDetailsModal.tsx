import React, { useState, useEffect, useRef } from "react";

interface User {
  matrikelnumber: number;
  firstname: string;
  secondname: string;
  email: string;
}

interface UserDetailsModalProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<User>(user);
  const modalRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "matrikelnumber" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
    <div className="fixed inset-0 text-black bg-[gray]/70 flex justify-center items-center z-50">
      <form
      ref={modalRef}
        onSubmit={handleSubmit}
        className="bg-white p-6 text-black rounded shadow-lg w-[90vw] max-w-md"
      >
        <h3 className="text-lg font-semibold mb-4">Besitzer bearbeiten</h3>

        <label className="flex flex-col mb-3">
          Matrikelnummer
          <input
            type="number"
            name="matrikelnumber"
            value={formData.matrikelnumber}
            onChange={handleChange}
            className="border rounded px-2 py-1 mt-1"
            required
          />
        </label>

        <label className="flex flex-col mb-3">
          Vorname
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="border rounded px-2 py-1 mt-1"
            required
          />
        </label>

        <label className="flex flex-col mb-3">
          Nachname
          <input
            type="text"
            name="secondname"
            value={formData.secondname}
            onChange={handleChange}
            className="border rounded px-2 py-1 mt-1"
            required
          />
        </label>

        <label className="flex flex-col mb-4">
          E-mail
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded px-2 py-1 mt-1"
            required
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            onClick={onClose}
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-900"
          >
            Speichern
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDetailsModal;
