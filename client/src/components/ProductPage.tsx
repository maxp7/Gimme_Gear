import { useLocation } from "react-router-dom";
import { useState } from "react";
import CalenderFilter from "./CalenderFilter";
import NavBar from "./NavBar/NavBar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

type Device = {
  deviceid: string;
  devicename: string;
  devicedescription: string;
  status: string;
  comments: string;
};
type CartItem = {
  deviceid: string;
  devicename: string;
  startDate?: string;
  endDate?: string;
};


export default function ProductPage() {
  const location = useLocation();
  const { result } = location.state as { result: Device }; 
  const imageName = result.devicename.toLowerCase().replace(/\s+/g, "-");
   const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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
    <div>
        <NavBar/>
        <CalenderFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      <div className="font-bold">
        <div className=" w-[100vw] flex">
        <img className="w-[47%] m-8 rounded-[20px]" src={`/${imageName}.jpg`} />
    <div className="w-[47%] m-4">
  <FullCalendar
    plugins={[dayGridPlugin]}
    initialView="dayGridMonth"
    height={500}
    selectable
    editable
  />
</div>

</div>
        <br />     
        {result.devicename} 
        <br />
        {result.devicedescription} 
        <br />
        <button
    disabled={!startDate || !endDate}
    onClick={(event) => {
      event.stopPropagation();
      addToCart(result, startDate, endDate);

    }}
    className={`ml-2 px-2 py-1 rounded text-white ${
      startDate && endDate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
    }`}
  >Add to reservation
  </button>

      </div>
    </div>
  );
}
