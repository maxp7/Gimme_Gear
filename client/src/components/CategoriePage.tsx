import { useParams } from "react-router-dom";
import SearchBarContainer from "./SearchBarContainer";
import CalenderFilter from "./CalenderFilter";
export default function CategoryPage() {
  const { name } = useParams();


  return (
    <div className="p-4">
      <SearchBarContainer/>
      <CalenderFilter/>
      <h1 className="text-[50px] font-bold mb-4">{name}</h1>
    </div>
  );
}
