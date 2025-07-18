import { useNavigate } from "react-router-dom";


type DropDownProps = {
  isVisible: boolean;
};

export default function DropDown({ isVisible }: DropDownProps) {
    const navigate = useNavigate();
  return (
    
    <div
      className={`
        absolute top-[3.5rem] h-[2.5rem] p-1.5 left-4 right-4
        transition-all duration-300 ease-out z-50 
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}
      `}
    >
      <ul className="flex flex-row gap-6 justify-between sm:px-24 px-2 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">

<li className="cursor-pointer text-[black] text-shadow-sm hover:scale-110"
onClick={() => navigate(`/Laptops`)}>Laptops</li>
<li className="cursor-pointer text-[black] text-shadow-sm hover:scale-110"
onClick={() => navigate(`/VR-Brille`)}>VR-Brille</li>
<li className="cursor-pointer text-[black] text-shadow-sm hover:scale-110"
onClick={() => navigate(`/Ton & Licht`)}>Ton & Licht</li>
<li className="cursor-pointer text-[black] text-shadow-sm hover:scale-110"
onClick={() => navigate(`/Zubehör`)}>Zubehör</li>



      </ul>
    </div>
  );
}
