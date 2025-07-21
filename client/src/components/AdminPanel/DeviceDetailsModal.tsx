import React, { useState, useEffect, useRef } from "react";

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

interface DeviceDetailsModalProps {
  device: Device;
  onSave: (updatedDevice: Device) => void;
  onClose: () => void;
}

const DeviceDetailsModal: React.FC<DeviceDetailsModalProps> = ({
  device,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Device>(device);
  const modalRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setFormData(device);
  }, [device]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        className="bg-white p-6 text-black rounded shadow-lg w-[90vw] max-w-md overflow-auto max-h-[90vh]"
      >
        <h3 className="text-lg font-semibold mb-4">Edit Device</h3>

        <label className="flex flex-col mb-3">
          Device ID
          <input
            type="text"
            name="deviceid"
            value={formData.deviceid}
            onChange={handleChange}
            className="border rounded px-2 py-1 mt-1"
            required
          />
        </label>

        <label className="flex flex-col mb-3">
          Device Name
          <input
            type="text"
            name="devicename"
            value={formData.devicename}
            onChange={handleChange}
            className="border rounded px-2 py-1 mt-1"
            required
          />
        </label>

        <label className="flex flex-col mb-3">
          Description
          <textarea
            name="devicedescription"
            value={formData.devicedescription || ""}
            onChange={handleChange}
            className="border rounded px-2 py-1 mt-1"
            rows={3}
          />
        </label>

        <label className="flex flex-col mb-3">
          Status
          <input
            type="text"
            name="status"
            value={formData.status || ""}
            onChange={handleChange}
            className="border rounded px-2 py-1 mt-1"
          />
        </label>

        <label className="flex flex-col mb-3">
          Comments
          <textarea
            name="comments"
            value={formData.comments || ""}
            onChange={handleChange}
            className="border rounded px-2 py-1 mt-1"
            rows={2}
          />
        </label>

        <label className="flex flex-col mb-3">
          Owner
          <input
            type="text"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            className="border rounded px-2 py-1 mt-1"
            required
          />
        </label>

        <label className="flex flex-col mb-3">
          Location
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="border rounded px-2 py-1 mt-1"
            required
          />
        </label>

        <label className="flex flex-col mb-4">
          Full Description
          <textarea
            name="full_description"
            value={formData.full_description || ""}
            onChange={handleChange}
            className="border rounded px-2 py-1 mt-1"
            rows={3}
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-900"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeviceDetailsModal;
