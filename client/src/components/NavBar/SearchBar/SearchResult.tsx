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
};
 
export default function SearchResult({ result }: SearchResultProps) {
    const navigate = useNavigate();

    const handleClick = () => {
  const encodedName = encodeURIComponent(result.devicename);
  navigate(`/product/${encodedName}`, { state: { result } });
};

  return (
    <div
      className="py-2 px-4 cursor-pointer text-[white] hover:font-bold"
      onClick={handleClick}
    >
      <div>{result.devicename} - {result.status}</div>
    </div>
  );
}
