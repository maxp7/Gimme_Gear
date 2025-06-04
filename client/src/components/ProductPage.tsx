import { useLocation } from "react-router-dom";
import { useState } from "react";
import SearchBarContainer from "./SearchBarContainer";
import CalenderFilter from "./CalenderFilter";
type Device = {
  deviceid: string;
  devicename: string;
  devicedescription: string;
  status: string;
  comments: string;
};



export default function ProductPage() {
  const location = useLocation();
  const { result } = location.state as { result: Device }; 
  const imageName = result.devicename.toLowerCase().replace(/\s+/g, "-");
   const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  return (
    <div>
        <SearchBarContainer/>
        <CalenderFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      <div className="font-bold">
        <img src={`/${imageName}.jpg`} />
        <br />     
        {result.devicename} 
        <br />
        {result.devicedescription} 
        <br />
        {result.status}

      </div>
    </div>
  );
}
