import { useLocation } from "react-router-dom";
import  { useState, useEffect, useRef } from "react";
import NavBar from "./NavBar/NavBar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

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

// Utility: Format Date to local YYYY-MM-DD string (no timezone shift)
function formatDateToLocalISO(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Utility: Add one day to a date string (for inclusive end dates in FullCalendar)
function addOneDay(dateStr: string) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return formatDateToLocalISO(d);
}

export default function ProductPage() {
  const location = useLocation();
  const { result } = location.state as { result: Device };
  const imageName = result.devicename.toLowerCase().replace(/\s+/g, "-");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const calendarRef = useRef<FullCalendar | null>(null);

  const [selectedRange, setSelectedRange] = useState<{start: string, end: string} | null>(null);

  

  // Add to cart saves local date strings without timezone shifts
  const addToCart = (device: Device, startDate?: Date | null, endDate?: Date | null) => {
    const currentCart: CartItem[] = JSON.parse(localStorage.getItem("deviceCart") || "[]");
    const exists = currentCart.some((item) => item.deviceid === device.deviceid);
    if (!exists) {
      currentCart.push({
        deviceid: device.deviceid,
        devicename: device.devicename,
        startDate: startDate ? formatDateToLocalISO(startDate) : undefined,
        endDate: endDate ? formatDateToLocalISO(endDate) : undefined,
      });
      localStorage.setItem("deviceCart", JSON.stringify(currentCart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  // Fetch reservations on mount or device change
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


  const handleDateClick = (arg: any) => {
  const clickedDate = arg.date;

  if (!startDate || (startDate && endDate)) {
    // Start a new selection
    setStartDate(clickedDate);
    setEndDate(null);
    setSelectedRange(null);
  } else if (startDate && !endDate) {
    if (clickedDate >= startDate) {
      setEndDate(clickedDate);
      setSelectedRange({
        start: formatDateToLocalISO(startDate),
        end: formatDateToLocalISO(clickedDate),
      });
    } else {
      // Restart if clicked earlier date
      setStartDate(clickedDate);
      setEndDate(null);
      setSelectedRange(null);
    }
  }
};


  return (
    <div className="overflow-y">
      <NavBar onDropdownChange={setIsDropdownVisible} />
      <div className="mt-6 ml-6"></div>
      <div className="font-bold">
        <div className="w-[100vw] flex">
          <div className="w-[47%] m-4">
            <div className="text-black mb-4">
              <br />
              <div className="text-2xl m-4">{result.devicename}</div>
              <br />
              <div className="m-4 max-w-[50ch]">
                {result.full_description}
              </div>
              <div className="m-4">Owner: {result.owner}</div>
              <div className="m-4">Device is now by: {result.location}</div>
            </div>

            <button
              disabled={!startDate || !endDate}
              onClick={(event) => {
                event.stopPropagation();
                addToCart(result, startDate, endDate);
              }}
              className={`m-2 mt-12 px-2 py-1 rounded text-black transition ${
                startDate && endDate
                  ? "cursor-pointer font-bold hover:underline"
                  : "cursor-not-allowed opacity-50"
              }`}
            >
              {startDate && endDate
                ? `Add to cart`
                : !startDate || !endDate
                ? `Select date`
                : ""}
            </button>
          </div>

          <img className="w-[40%] m-8 rounded-[20px]" src={`/${imageName}.svg`} />

          {isDropdownVisible && (
            <div className="fixed top-[8.5rem] inset-0 z-40 backdrop-blur-sm bg-black/10 transition-all duration-500"></div>
          )}
        </div>

        <div className="w-[80vw] m-auto">
          <FullCalendar
  ref={calendarRef}
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  height={500}
  selectable={true} // optional — remove if you only want click-to-select
  editable={false}
  headerToolbar={{
    left: "",
    center: "title",
    right: "prev,next",
  }}
  buttonText={{ month: "Month" }}
  events={[
    ...reservations.map((r) => ({
      id: r.reservationnumber,
      title: `${r.firstname} ${r.secondname}`,
      start: r.startdate,
      end: addOneDay(r.enddate),
      extendedProps: { status: r.status, deviceid: r.deviceid },
    })),
    ...(selectedRange
      ? [{
          id: "selectedRange",
          title: "Your reservation",
          start: selectedRange.start,
          end: addOneDay(selectedRange.end),
          backgroundColor: "#1976d2",
          borderColor: "#1976d2",
          rendering: "background",
        }]
      : [])
  ]}
  dayCellContent={(arg) => (
    <div style={{ color: "black", fontWeight: "bold" }}>{arg.dayNumberText}</div>
  )}
  dateClick={handleDateClick}
/>

        </div>
      </div>
    </div>
  );
}
