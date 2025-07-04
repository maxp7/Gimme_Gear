import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CalendarDialog from "./CalendarDialog";

interface EventFormData {
  title: string;
  room: string;
  note: string;
}

const AdminCalendar: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
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

  return (
    <div>
      
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        select={handleDateSelect}
        events={[]}
        eventContent={(arg) => {
          const { room, note } = arg.event.extendedProps;
          return (
            <div>
              <div>
                <strong>{arg.event.title}</strong>
              </div>
              {room && <div>Room: {room}</div>}
              {note && <div>Note: {note}</div>}
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
