import React from "react";
import * as Dialog from "@radix-ui/react-dialog";

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
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-10" />
<Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh]  max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-900 p-[25px] z-20">
			

          <Dialog.Title className="text-center text-lg font-medium mb-4">Create Reservation</Dialog.Title>


         <fieldset className="flex gap-5 items-center mb-4">
  <label className="w-[120px] text-right">Matrikelnummer</label>
  <input
    type="number"
    value={formData.matrikelnumber}
    onChange={(e) =>
      setFormData({ ...formData, matrikelnumber: Number(e.target.value) })
    }
    className="flex h-[35px] max-w-[300px] border border-gray-400 rounded-md px-2.5"
  />
</fieldset>

<fieldset className="flex gap-5 items-center mb-4">
  <label className="w-[120px] text-right">Start Date</label>
  <input
    type="date"
    value={formData.startdate}
    onChange={(e) =>
      setFormData({ ...formData, startdate: e.target.value })
    }
    className="flex h-[35px] max-w-[300px] border border-gray-400 rounded-md px-2.5"
  />
</fieldset>

<fieldset className="flex gap-5 items-center mb-4">
  <label className="w-[120px] text-right">End Date</label>
  <input
    type="date"
    value={formData.enddate}
    onChange={(e) =>
      setFormData({ ...formData, enddate: e.target.value })
    }
    className="flex h-[35px] max-w-[300px] border border-gray-400 rounded-md px-2.5"
  />
</fieldset>

<fieldset className="flex gap-5 items-center mb-4">
  <label className="w-[120px] text-right">Device ID</label>
  <input
    value={formData.deviceid}
    onChange={(e) =>
      setFormData({ ...formData, deviceid: e.target.value })
    }
    className="flex h-[35px] max-w-[300px] border border-gray-400 rounded-md px-2.5"
  />
</fieldset>

<fieldset className="flex gap-5 items-center mb-4">
  <label className="w-[120px] text-right">First Name</label>
  <input
    value={formData.firstname}
    onChange={(e) =>
      setFormData({ ...formData, firstname: e.target.value })
    }
    className="flex h-[35px] max-w-[300px] border border-gray-400 rounded-md px-2.5"
  />
</fieldset>

<fieldset className="flex gap-5 items-center mb-4">
  <label className="w-[120px] text-right">Second Name</label>
  <input
    value={formData.secondname}
    onChange={(e) =>
      setFormData({ ...formData, secondname: e.target.value })
    }
    className="flex h-[35px] max-w-[300px] border border-gray-400 rounded-md px-2.5"
  />
</fieldset>

<fieldset className="flex gap-5 items-center mb-4">
  <label className="w-[120px] text-right">Email</label>
  <input
    type="email"
    value={formData.email}
    onChange={(e) =>
      setFormData({ ...formData, email: e.target.value })
    }
    className="flex h-[35px] max-w-[300px] border border-gray-400 rounded-md px-2.5"
  />
</fieldset>


          <div className="flex justify-end mt-6 gap-2">
            <Dialog.Close asChild>
              <button
                onClick={onSubmit}
                className="px-4 h-[25px] text-sm rounded-md bg-green-400 hover:bg-green-500"
              >
                Save
              </button>
            </Dialog.Close>

            <Dialog.Close asChild>
              <button
                className="px-4 h-[25px] text-sm rounded-md bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CalendarDialog;