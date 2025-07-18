import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { de } from 'date-fns/locale';

type Props = {
  dateRange: [Date | null, Date | null];
  onDateRangeChange: (range: [Date | null, Date | null]) => void;
};

export default function CalenderFilter({
  dateRange,
  onDateRangeChange,
}: Props) {
  const [startDate, endDate] = dateRange;

  return (
    <div className="flex m-4 gap-4 text-black">
      <DatePicker
        showIcon
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          if (Array.isArray(update) && update.length === 2) {
            onDateRangeChange(update as [Date | null, Date | null]);
          }
        }}
        isClearable
        placeholderText=" Datum hinzufügen"
        dateFormat="dd-MM-yy"
        locale={de}
        className="border rounded w-54 p-4 text-black"
      />
    </div>
  );
}
