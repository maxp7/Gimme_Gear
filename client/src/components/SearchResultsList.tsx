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
      <div className="mt-4 w-full">
        {results.map((device) => (
          <SearchResult key={device.deviceid} result={device} />
        ))}
      </div>
    </div>
  );
}
