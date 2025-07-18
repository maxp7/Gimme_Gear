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
  const validCategories = ['Laptops', 'VR-Brille', 'Zubehör', 'Ton & Licht'];
const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
const [startDate, endDate] = dateRange;
const [isDropdownVisible, setIsDropdownVisible] = useState(false);
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
  return `/images/devices/${safeName}.svg`;
  
};



  return (
    <div className="text-black">
      <NavBar onDropdownChange={setIsDropdownVisible}/>
      <div className="mt-6 ml-6">
        <CalenderFilter
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      
/></div>
      {isDropdownVisible && (
        <div className="fixed top-[8.5rem] inset-0 z-40 backdrop-blur-sm bg-black/1 transition-all duration-500"></div>
      )}

<div className="p-4">
  <h1 className="text-4xl font-bold m-4">{name}</h1>
  {loading && <p className="m-4">Verfügbarkeit wird geprüft...</p>}
  {error && <p className="text-red-500">{error}</p>}

  {devices.length === 0 && !loading && <p>No available devices.</p>}

  <div className="grid grid-cols-1 md:grid-cols-3">
    {devices.map(device => (
      <div
        key={device.deviceid}
        onClick={() => handleClick(device)}
        className="cursor-pointer p-4 flex justify-between items-center m-4 hover:scale-105 transition-transform"
      >
        <div className="flex items-center gap-4">
          <img 
            src={getImageUrl(device.devicename)} 
            alt={device.devicename} 
            className="w-24 h-24 object-cover rounded shadow"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.png'; 
            }}
          />
          <div>
            <div className="font-semibold">{device.devicename}</div>
            {device.devicedescription && (
              <div className="text-sm text-gray-600">{device.devicedescription}</div>
            )}
            <div>Besitzer: {device.owner}</div>
          </div>
        </div>
<button
  disabled={!startDate || !endDate}
  onClick={(event) => {
    event.stopPropagation();
    addToCart(device, startDate, endDate);
  }}
  className={`ml-4 px-2 py-1 rounded text-black transition ${
    startDate && endDate
      ? "cursor-pointer font-bold hover:underline"
      : "cursor-not-allowed opacity-50"
  }`}
>
  {startDate && endDate ? "Add to cart" : "Datum auswählen"}
</button>

      </div>
    ))}
  </div>
</div>

     
    </div>
  );
}
