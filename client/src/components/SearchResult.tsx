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
    navigate("/product", { state: { result } }); 
  };
  return (
    <div
      className="p-2 border-b cursor-pointer hover:bg-gray-100"
      onClick={handleClick}
    >
      <div className="font-bold">{result.devicename} - {result.status}</div>
    </div>
  );
}
