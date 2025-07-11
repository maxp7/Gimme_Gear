import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import CalenderFilter from "./CalenderFilter";
import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type Device = {
  deviceid: string;
  devicename: string;
  devicedescription?: string;
  status: string;
  owner: string;
  location: string;
  comments?: string;
};

type CartItem = {
  deviceid: string;
  devicename: string;
  startDate?: string;
  endDate?: string;
  owner: string;
  location: string;
};


export default function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const validCategories = ['Laptops', 'VR-Headsets', 'Equipment', 'Audio & Lighting', 'More'];
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
    const encodedName = encodeURIComponent(device.devicename);
    navigate(`/product/${encodedName}`, { state: { result: device } });
  };

  const addToCart = (device: Device, startDate?: Date | null, endDate?: Date | null) => {
    if (!startDate || !endDate) {
      alert("Please select start and end dates.");
      return;
    }

    const currentCart: CartItem[] = JSON.parse(localStorage.getItem("deviceCart") || "[]");

    const index = currentCart.findIndex(item => item.deviceid === device.deviceid);
    if (index !== -1) {
      // Update existing item dates
      currentCart[index].startDate = startDate.toISOString().split("T")[0];
      currentCart[index].endDate = endDate.toISOString().split("T")[0];
    } else {
      // Add new item
      currentCart.push({
        deviceid: device.deviceid,
        devicename: device.devicename,
        owner: device.owner,
        location: device.location,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });
    }
    localStorage.setItem("deviceCart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

const getImageUrl = (devicename: string) => {
  const safeName = devicename.replace(/\s+/g, '-').toLowerCase();
  console.log(safeName)
  return `/images/devices-small/${safeName}.jpg`;
  
};



  return (
    <div>
      <NavBar />
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

        <ul>
  {devices.length === 0 && <li>No available devices.</li>}

  {devices.map(device => (
    <li
      key={device.deviceid}
      onClick={() => handleClick(device)}
      className="cursor-pointer p-4 border-b flex justify-between items-center"
    >
      <div className="flex items-center gap-4">
        <img 
          src={getImageUrl(device.devicename)} 
          alt={device.devicename} 
          className="w-24 h-24 object-cover rounded shadow"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/device-images/placeholder.jpg'; 
          }}
        />
        <div>
          <div className="font-semibold">{device.devicename}</div>
          {device.devicedescription && (
            <div className="text-sm text-gray-600">{device.devicedescription}</div>
          )}
        </div>
      </div>

      <button
        disabled={!startDate || !endDate}
        onClick={(event) => {
          event.stopPropagation();
          addToCart(device, startDate, endDate);
        }}
        className={`ml-2 px-2 py-1 rounded text-white ${startDate && endDate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
      >
        Add to reservation
      </button>
    </li>
  ))}
</ul>
      </div>
    </div>
  );
}
