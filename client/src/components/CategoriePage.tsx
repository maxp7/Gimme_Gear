import { useParams, useNavigate } from "react-router-dom";
import SearchBarContainer from "./SearchBarContainer";
import CalenderFilter from "./CalenderFilter";
import { useEffect, useState } from 'react';
import Cart from "./Cart";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type Device = {
  deviceid: string;
  devicename: string;
  devicedescription?: string;
  status: string;
  comments?: string;
};

type CartItem = {
  deviceid: string;
  devicename: string;
  startDate?: string;  
  endDate?: string;
};


export default function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const validCategories = ['Laptops', 'VR Headsets', 'Equipment', 'Audio & Lighting']; 
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!name) return;
    if (!name || !validCategories.includes(name)) {
    navigate('/')
  }
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
  }, [name, startDate, endDate]);

  const handleClick = (device: Device) => {
    navigate("/product", { state: { result: device } });
  };

const addToCart = (device: Device, startDate?: Date | null, endDate?: Date | null) => {
  const currentCart: CartItem[] = JSON.parse(localStorage.getItem("deviceCart") || "[]");
  const exists = currentCart.some(item => item.deviceid === device.deviceid);
  if (!exists) {
    currentCart.push({
      deviceid: device.deviceid,
      devicename: device.devicename,
      startDate: startDate ? startDate.toISOString().split("T")[0] : undefined,
      endDate: endDate ? endDate.toISOString().split("T")[0] : undefined,
    });
    localStorage.setItem("deviceCart", JSON.stringify(currentCart));

    window.dispatchEvent(new Event("cartUpdated"));
  }
};



  return (
    <div className="p-4">
      <Cart />
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
 <li
  key={device.deviceid}
  onClick={() => handleClick(device)}
  className="cursor-pointer"
>
  {device.devicename}
  {device.devicedescription && ` — ${device.devicedescription}`}
  <button
    disabled={!startDate || !endDate}
    onClick={(event) => {
      event.stopPropagation();
      addToCart(device, startDate, endDate);
    }}
    className={`ml-2 px-2 py-1 rounded text-white ${
      startDate && endDate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
    }`}
  >
    Add to reservation
  </button>
  {!startDate || !endDate ? (
    <span className="text-sm text-red-600 ml-2">Please select start and end dates</span>
  ) : null}
</li>

))}

          </ul>
        )}
      </div>
    </div>
  );
}
