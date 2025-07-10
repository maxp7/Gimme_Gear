import SearchResult from "./SearchResult";

type Device = {
  deviceid: string;
  devicename: string;
  devicedescription: string;
  status: string;
  comments: string;
};

type SearchResultsListProps = {
  results: Device[];
};

export default function SearchResultsList({ results }: SearchResultsListProps) {
  return (
    <div>
      <div className="my-4 w-[100%] bg-gray-400/25
            rounded-[20px]">
        {results.map((device) => (
          <SearchResult key={device.deviceid} result={device} />
        ))}
      </div>
    </div>
  );
}
