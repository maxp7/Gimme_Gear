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
       <div className="flex h-[3rem] w-[80%]
  ">
            <SearchBar setResults={setResults} />
            <SearchResultsList results = {results} />
       </div>
    )
}