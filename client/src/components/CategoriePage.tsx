import { useParams } from "react-router-dom";
import SearchBarContainer from "./SearchBarContainer";
import CalenderFilter from "./CalenderFilter";
import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type Device = {
  deviceid: string;
  devicename: string;
  devicedescription?: string;
  status: string;
  comments?: string;
};

export default function CategoryPage() {

  const { name } = useParams<{ name: string }>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;

    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/${name}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setDevices(data.devices || []);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load devices');
      })
      .finally(() => setLoading(false));
  }, [name]);


  return (
    <div className="p-4">
      <SearchBarContainer/>
      <CalenderFilter/>
       <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">{name}</h1>

      {loading && <p>Loading devices...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ul>
          {devices.length === 0 && <li>No available devices.</li>}
          {devices.map(device => (
            <li key={device.deviceid}>
              {device.devicename} — {device.status}
              {device.devicedescription && ` — ${device.devicedescription}`}
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
}
