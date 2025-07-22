import React from "react";

interface CalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    matrikelnumber: number;
    startdate: string;
    enddate: string;
    deviceid: string;
    firstname: string;
    secondname: string;
    email: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      matrikelnumber: number;
      startdate: string;
      enddate: string;
      deviceid: string;
      firstname: string;
      secondname: string;
      email: string;
    }>
  >;
  onSubmit: () => void;
}

const CalendarDialog: React.FC<CalendarDialogProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-[gray]/70"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-5 max-h-[85vh] w-[50vw] max-w-[700px] overflow-auto rounded-lg bg-white p-4 text-black shadow-lg">
        <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-4 text-center">
          Buchung erstellen
        </h2>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
            onOpenChange(false);
          }}
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Matrikelnummer</label>
            <input
              type="number"
              value={formData.matrikelnumber || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  matrikelnumber: Number(e.target.value),
                })
              }
              placeholder="z.B. 0123456"
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Startdatum</label>
            <input
              type="date"
              value={formData.startdate}
              onChange={(e) =>
                setFormData({ ...formData, startdate: e.target.value })
              }
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Enddatum</label>
            <input
              type="date"
              value={formData.enddate}
              onChange={(e) =>
                setFormData({ ...formData, enddate: e.target.value })
              }
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Gerät ID</label>
            <input
              value={formData.deviceid}
              onChange={(e) =>
                setFormData({ ...formData, deviceid: e.target.value })
              }
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Vorname</label>
            <input
              value={formData.firstname}
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nachname</label>
            <input
              value={formData.secondname}
              onChange={(e) =>
                setFormData({ ...formData, secondname: e.target.value })
              }
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div className="flex gap-3 mt-2 justify-end">
            <button
              type="submit"
              className="py-2 px-4 bg-black text-white rounded hover:bg-gray-800 transition-colors font-medium"
            >
              Speichern
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors font-medium"
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarDialog;
