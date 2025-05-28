import { useState } from "react";

type Device = {
  deviceid: string;
  devicename: string;
  devicedescription: string;
  status: string;
  comments: string;
};

type SearchBarProps = {
  setResults: (devices: Device[]) => void;
};

export default function SearchBar({ setResults }: SearchBarProps) {
  const [input, setInput] = useState("");

  const fetchData = (value: string) => {
    if (!value) {
        setResults([]);
        return;
        }
    fetch("https://gimme-gear.onrender.com/dbui")
      .then((response) => response.json())
      .then((json) => {
        const results = json.devices.filter((device: Device) =>
          device.devicename.toLowerCase().includes(value.toLowerCase())
        );
        setResults(results); 
      })
      .catch(console.error);
  };

  const handleChange = (value: string) => {
    setInput(value);
    fetchData(value);
  };
  return (
    <div className="bg-[white] w-full rounded-[10px] h-[2.5rem] px-[15px] flex">
      <input
        type="text"
        placeholder="Type to search"
        className="bg-transparent h-full w-full border-none text-[1.25rem] text-[black] outline-none"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}
