import { useState, useEffect } from 'react';
import SearchBarContainer from "./NavBar/SearchBar/SearchBarContainer";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type Device = {
  deviceid: string;
  devicename: string;
  devicedescription?: string;
  status: string;
  owner:string;
  location: string;
  comments?: string;
};

export default function DBUI() {
  const [devices, setDevices] = useState<Device[]>([]);
const [formData, setFormData] = useState<Device>({
  deviceid: '',               
  devicename: '',
  devicedescription: '',
  status: '',
  comments: '',
  owner: '',
  location: '',
});

  // Load devices on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/dbui`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setDevices(data.devices || []);
      })
      .catch(err => console.error('API fetch error:', err));
  }, []);


const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: name === 'deviceid' ? String(value) : value,
  }));
};


  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/dbui`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
  if (data.device) {
    setDevices(prev => [...prev, data.device]);
  } else {
    console.error('Failed to add device:', data.error);
  }
  
  // Clear form anyway if you want
  setFormData({
    deviceid: '',
    devicename: '',
    devicedescription: '',
    status: '',
    comments: '',
    owner: '',
  location: '',
  });
})

      .catch(err => console.error('POST error:', err));
  };
const handleDelete = async (deviceid: string) => {

  try {
    const res = await fetch(`${API_BASE_URL}/dbui/${deviceid}`, { method: 'DELETE' });
const data = await res.json();
if (!res.ok) {
  console.error('Delete failed:', data.error);
  alert(`Failed to delete device: ${data.error}`);
  return;
}   

    // Remove device from state
    setDevices(prev => prev.filter(d => d.deviceid !== deviceid));
  } catch (err) {
    console.error('Delete error:', err);
    alert('Error deleting device');
  }
};

  return (
    <div>
      <SearchBarContainer />
      <h2>Devices</h2>
      <ul>
        {devices.map(device => (
          <li key={device.deviceid}>
            {device.deviceid} -{device.devicename} – {device.status}-{device.devicedescription} – {device.owner} – {device.location} {device.comments}
          </li>
        ))}
      </ul>

      <h3>Add New Device</h3>
      <form onSubmit={handleSubmit}>
        <input
            type="text"
            name="deviceid"
            placeholder="Device ID"
            value={formData.deviceid}
            onChange={handleChange}
            required
        />

        <input
          type="text"
          name="devicename"
          placeholder="Device Name"
          value={formData.devicename}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="devicedescription"
          placeholder="Description"
          value={formData.devicedescription}
          onChange={handleChange}
        />
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="">Status</option>
          <option value="Available">Available</option>
          <option value="Reserved">Maintenance</option>
        </select>
        <input
          type="text"
          name="owner"
          placeholder="Owner"
          value={formData.owner}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Locatio "
          value={formData.location}
          onChange={handleChange}
        />
        <input
          type="text"
          name="comments"
          placeholder="Comments"
          value={formData.comments}
          onChange={handleChange}
        />
        <button type="submit">Add Device</button>
      </form>
<ul>
  {devices.map(device => (
    <li key={device.deviceid}>
      {device.devicename} – {device.status}{' '}
      <button onClick={() => handleDelete(device.deviceid)}>Delete</button>
    </li>
  ))}
</ul>

    </div>
  );
}
