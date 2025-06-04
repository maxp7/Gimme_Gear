// CalenderFilter.tsx
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
};

export default function CalenderFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: Props) {
  return (
    <div className="flex gap-4">
      <DatePicker
        selected={startDate}
        onChange={onStartDateChange}
        placeholderText="Select start date"
        dateFormat="yyyy-MM-dd"
        className="border p-2 rounded"
      />
      <DatePicker
        selected={endDate}
        onChange={onEndDateChange}
        placeholderText="Select end date"
        dateFormat="yyyy-MM-dd"
        className="border p-2 rounded"
      />
    </div>
  );
}
