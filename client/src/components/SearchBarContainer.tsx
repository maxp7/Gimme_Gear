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


    return(
       <div className="p-[5vh] w-[40%] mx-auto flex flex-col items-center min-w-[200px]">
            <SearchBar setResults={setResults} />
            <SearchResultsList results = {results} />
       </div>
    )
}