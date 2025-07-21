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
  clearResults: () => void;
};

export default function SearchResultsList({ results, clearResults }: SearchResultsListProps) {
  return (
    <div className="my-4 relative w-full bg-white rounded-2xl z-20">
      {results.map((device) => (
        <SearchResult
          key={device.deviceid}
          result={device}
          clearResults={clearResults}
        />
      ))}
    </div>
  );
}
