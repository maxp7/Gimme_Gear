import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import NavBar from "./NavBar/NavBar";
import CalenderFilter from "./CalenderFilter";

type Device = {
  deviceid: string;
  devicename: string;
  devicedescription: string;
  full_description: string;
  status: string;
  comments: string;
  owner: string;
  location: string;
};

type CartItem = {
  deviceid: string;
  devicename: string;
  owner?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
};


interface Reservation {
  reservationnumber: string;
  matrikelnumber: number;
  startdate: string;
  enddate: string;
  status: string;
  deviceid: string;
  devicename: string;
  firstname: string;
  secondname: string;
  email: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function formatDateToLocalISO(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}


export default function ProductPage() {
  const location = useLocation();
  const { result } = location.state as { result: Device };
  const imageName = result.devicename.toLowerCase().replace(/\s+/g, "-");
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
const [startDate, endDate] = dateRange;


  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const addToCart = (device: Device, startDate?: Date | null, endDate?: Date | null) => {
  if (!startDate || !endDate) {
    setToastMessage("Bitte Start- und Enddatum auswählen");
    return;
  }

  const start = startDate.getTime();
  const end = endDate.getTime();

  const hasConflict = reservations.some(r => {
    const rStart = new Date(r.startdate).getTime();
    const rEnd = new Date(r.enddate).getTime();
    return !(end < rStart || start > rEnd);
  });

  if (hasConflict) {
    setToastMessage("Gerät ist im gewählten Zeitraum bereits reserviert");
    return;
  }

  const currentCart: CartItem[] = JSON.parse(localStorage.getItem("deviceCart") || "[]");
  const exists = currentCart.some(item => item.deviceid === device.deviceid);

  if (!exists) {
    currentCart.push({
      deviceid: device.deviceid,
      devicename: device.devicename,
      owner: device.owner,
      location: device.location,
      startDate: formatDateToLocalISO(startDate),
      endDate: formatDateToLocalISO(endDate),
    });
    localStorage.setItem("deviceCart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setToastMessage("Zum Warenkorb hinzugefügt");
  } else {
    setToastMessage("Bereits im Warenkorb");
  }
};

useEffect(() => {
  if (!result?.devicename) return;

  fetch(`${API_BASE_URL}/product-reservations?devicename=${encodeURIComponent(result.devicename)}`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((data) => setReservations(data.reservations || []))
    .catch((err) => {
      console.error("API fetch error:", err);
    });
}, [result.devicename]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);



  return (
    <div className="overflow-y">
      <NavBar onDropdownChange={setIsDropdownVisible} />
      <div ref={calendarRef} className="mt-6 ml-6">
              <CalenderFilter
            
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            isOpen={isCalendarOpen}
            onOpenChange={setIsCalendarOpen}
            
      /></div>
      <div className="mt-6 ml-6"></div>
      <div className="font-bold">
        <div className="w-[100vw] sm:flex">
          <div className="md:w-[47%] m-2 md:m-4">
            <img className=" md:hidden w-[80%] rounded-[20px]" src={`/images/devices/${imageName}.svg`} />
            <div className="text-black md:mb-4">
              <br />
              <div className="text-2xl mx-4 md:m-4">{result.devicename}</div>
              <br />
              <div className="m-4 md:m-4 md:max-w-[50ch]">
                {result.full_description}
              </div>
              
              <div className="m-4">Besitzer: {result.owner}</div>
              <div className="m-4">Ort: {result.location}</div>
            </div>

            <button
            
  onClick={() => {
    if (!startDate || !endDate) {
      calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsCalendarOpen(true); // открыть календарь
    } else {
      addToCart(result, startDate, endDate);
    }
  }}
  
  className="ml-4 mb-8 px-4 py-2 bg-black text-white rounded disabled:opacity-50 hover:cursor-pointer hover:opacity-85"
>
  {startDate && endDate ? "Zum Warenkorb hinzufügen" : "Datum auswählen"}
</button>

          </div>

          <img className="hidden md:block w-[40%] m-8 rounded-[20px]" src={`/images/devices/${imageName}.svg`} />

          {isDropdownVisible && (
            <div className="fixed top-[6.5rem] md:top-[8.5rem]  inset-0 z-40 backdrop-blur-sm bg-black/10 transition-all duration-500"></div>
          )}
        </div>
      </div>
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-black font-bold text-white px-4 py-2 rounded shadow z-[100]">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
