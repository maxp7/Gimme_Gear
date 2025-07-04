import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CalendarDialog from "./CalendarDialog";
interface Reservation {
  reservationnumber: number;
  startdate: string;
  enddate: string;
  status: string;
  comment: string | null;
  deviceid: number;
  devicename: string;
  matrikelnumber: string;
  firstname: string;
  secondname: string;
  email: string;
}
interface EventFormData {
  title: string;
  room: string;
  note: string;
}

const AdminCalendar: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectInfo, setSelectInfo] = useState<DateSelectArg | null>(null);

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    room: "",
    note: "",
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
      title: formData.title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      extendedProps: {
        room: formData.room,
        note: formData.note,
      },
    });

    setFormData({ title: "", room: "", note: "" });
    setOpen(false);
  };
useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch('/reservations/admin/reservations');
        if (!response.ok) throw new Error('Failed to fetch reservations');
        const data = await response.json();

        // Map reservations to FullCalendar event format
        const mappedEvents = data.reservations.map((res: Reservation) => ({
          id: res.reservationnumber.toString(),
          title: `${res.devicename} - ${res.firstname} ${res.secondname}`,
          start: res.startdate,
          end: res.enddate,
          allDay: false,  // set according to your needs
          extendedProps: {
            comment: res.comment,
            matrikelnumber: res.matrikelnumber,
            status: res.status,
          }
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error('Error loading reservations:', error);
      }
    }
    fetchReservations();
  }, []);
  return (
    <div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        select={handleDateSelect}
        events={events} // <-- use fetched events here
        eventContent={(arg) => {
          const { comment, matrikelnumber, status } = arg.event.extendedProps;
          return (
            <div>
              <div>
                <strong>{arg.event.title}</strong>
              </div>
              <div>Matrikelnummer: {matrikelnumber}</div>
              <div>Status: {status}</div>
              {comment && <div>Kommentar: {comment}</div>}
            </div>
          );
        }}
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
