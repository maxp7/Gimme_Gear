import { useParams, useNavigate } from "react-router-dom";
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

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!name) return;

    const params = new URLSearchParams();

    if (startDate) {
      params.append("start", startDate.toISOString().split("T")[0]);
}
    if (endDate) {
      params.append("end", endDate.toISOString().split("T")[0]);
}


    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/${name}?${params.toString()}`)
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

  }, [name, startDate, endDate]); // Fetch again if dates change
  const navigate = useNavigate();
  const handleClick = (device: Device) => {
    navigate("/product", { state: { result:device } }); 
  }
  return (
    <div className="p-4">
      <SearchBarContainer />
      <CalenderFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <div className="p-4">
        <h1 className="text-4xl font-bold mb-4">{name}</h1>

        {loading && <p>Loading devices...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <ul>
            {devices.length === 0 && <li>No available devices.</li>}
            {devices.map(device => (
              <li key={device.deviceid} onClick={()=>handleClick(device)} className="cursor-pointer">
                {device.devicename}
                {device.devicedescription && ` — ${device.devicedescription}`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
