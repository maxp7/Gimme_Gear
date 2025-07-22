import { CiSearch } from "react-icons/ci";

type Device = {
  deviceid: string;
  devicename: string;
  devicedescription: string;
  status: string;
  comments: string;
};
type SearchBarProps = {
  input: string;
  setInput: (value: string) => void;
  setResults: (devices: Device[]) => void;
};

export default function SearchBar({ input, setInput, setResults }: SearchBarProps) {
  const fetchData = (value: string) => {
    if (!value) {
      setResults([]);
      return;
    }
    fetch("https://gimme-gear.onrender.com/devices/getDevices")
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
    <div className="bg-[white] w-full rounded-[20px] h-[3rem] px-[15px] flex justify items-center">
      <div className="flex flex-row">
        <CiSearch className="text-black text-2xl mr-1"/>
      <input
      
        type="text"
        placeholder="Wonach suchst du?"
        className="bg-transparent h-full w-full border-none text-[1.25rem] text-[black] outline-none"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
      </div>
    </div>
  );
}
