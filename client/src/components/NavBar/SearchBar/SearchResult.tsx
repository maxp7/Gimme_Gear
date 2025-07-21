import { useNavigate } from "react-router-dom";

type Device = {
  deviceid: string;
  devicename: string;
  devicedescription: string;
  status: string;
  comments: string;
};
type SearchResultProps = {
  result: Device;
  clearResults: () => void;
};

export default function SearchResult({ result, clearResults }: SearchResultProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    clearResults();
    const encodedName = encodeURIComponent(result.devicename);
    navigate(`/product/${encodedName}`, { state: { result } });
  };

  const imagePath = `/images/devices/${result.devicename.toLowerCase().replace(/\s+/g, "-")}.svg`;

  return (
    <div
      className="z-50 py-2 px-4 cursor-pointer text-black hover:text-black/80 hover:bg-gray-100 rounded flex items-center gap-3 overflow-auto"
      onClick={handleClick}
    >
      <img
        src={imagePath}
        alt={result.devicename}
        className="w-12 h-12 rounded object-cover flex-shrink-0"
      />

      <div className="flex flex-col">
        <span className="font-semibold text-md">{result.devicename}</span>
        <span className="text-sm text-gray-600 line-clamp-2">{result.devicedescription}</span>
      </div>
    </div>
  );
}
