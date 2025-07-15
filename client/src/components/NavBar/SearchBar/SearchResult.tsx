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
      className="py-2 px-4 cursor-pointer text-[black] font-bold hover:text-[black]/80 hover:bg-[grey]/5"
      onClick={handleClick}
    >
      <div className="pl-10">{result.devicename} - {result.status}</div>
    </div>
  );
}
