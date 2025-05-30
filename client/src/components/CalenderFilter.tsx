import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
type CalenderFilterProps = {
  imgSrc: string;
  altText?: string;
  categoryName: string;
};

export default function CalenderFilter() {
const [startDate, setStartDate] = useState<Date | null>(null);
const [endDate, setEndDate] = useState<Date | null>(null);
console.log(startDate, endDate);
  return (
    
    <div >
      <DatePicker
      selected={startDate}
      onChange={(date: Date | null) => setStartDate(date)}
      placeholderText="Select start date"
      dateFormat="yyyy-MM-dd"
      className="border p-2 rounded"
    />
    <DatePicker
      selected={endDate}
      onChange={(date: Date | null) => setEndDate(date)}
      placeholderText="Select end date"
      dateFormat="yyyy-MM-dd"
      className="border p-2 rounded"
    />
    </div>
  );
}
