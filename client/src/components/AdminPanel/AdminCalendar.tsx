import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CalendarDialog from "./CalendarDialog";
import type { DateSelectArg} from "@fullcalendar/core";
import { de } from "date-fns/locale";

interface EventFormData {
  matrikelnumber: number;
  startdate: string;
  enddate: string;
  deviceid: string;
  firstname: string;
  secondname: string;
  email: string;
}
interface Reservation {
  reservationnumber: number;
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


interface AdminCalendarProps {
  events: any[];
  onEventClick?: (reservationData: Partial<Reservation>) => void; 
}

const AdminCalendar: React.FC<AdminCalendarProps> = ({ events, onEventClick }) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [open, setOpen] = useState(false);
  const [selectInfo, setSelectInfo] = useState<DateSelectArg | null>(null);

  const [formData, setFormData] = useState<EventFormData>({
    matrikelnumber: 0,
    startdate: "",
    enddate: "",
    deviceid: "",
    firstname: "",
    secondname: "",
    email: "",
  });

  const handleDateSelect = (info: DateSelectArg) => {
    setSelectInfo(info);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!selectInfo) return;

    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    calendarApi.addEvent({
      title: `${formData.firstname} ${formData.secondname}`,
      start: formData.startdate,
      end: formData.enddate,
      allDay: selectInfo.allDay,
      extendedProps: {
        matrikelnumber: formData.matrikelnumber,
        deviceid: formData.deviceid,
        email: formData.email,
      },
    });

    setFormData({
      matrikelnumber: 0,
      startdate: "",
      enddate: "",
      deviceid: "",
      firstname: "",
      secondname: "",
      email: "",
    });
    setOpen(false);
  };
  

  return (
    <div className="w-[95vw] p-4">
      <FullCalendar
        height={700}
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        select={handleDateSelect}
        events={events}
        
        eventClick={(info) => {
  info.jsEvent.preventDefault();

  const reservationData = info.event.extendedProps as Partial<Reservation>;

  if (onEventClick) {
    onEventClick(reservationData);
  }
}}

        locale={de}
        eventContent={(arg) => <div>{arg.event.title}</div>}
      />

      <CalendarDialog
        open={open}
        onOpenChange={setOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AdminCalendar;
