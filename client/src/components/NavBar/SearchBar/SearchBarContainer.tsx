import { useState } from "react";
import SearchBar from "./SearchBar";
import SearchResultsList from "./SearchResultsList";

type Device = {
  deviceid: string;
  devicename: string;
  devicedescription: string;
  status: string;
  comments: string;
};

export default function SearchBarContainer() {
  const [results, setResults] = useState<Device[]>([]); 
  const [input, setInput] = useState("");
    const clearResults = () => {
    setResults([]);
    setInput("");
  };
  return (
    <div>
       <SearchBar input={input} setInput={setInput} setResults={setResults} />
      <SearchResultsList results={results} clearResults={clearResults} />
    </div>
  )
}
