import { useNavigate } from "react-router-dom";


type DropDownProps = {
  isVisible: boolean;
};

export default function DropDown({ isVisible }: DropDownProps) {
    const navigate = useNavigate();
  return (
    
    <div
      className={`
        absolute top-[3.5rem] h-[3rem] bg-gray-400/25 p-2 left-4 right-4 shadow rounded-[20px] 
        transition-all duration-300 ease-out z-50 
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}
      `}
    >
      <ul className="flex flex-row gap-6 justify-between px-24 text-xl">

<li className="cursor-pointer text-white hover:font-bold"
onClick={() => navigate(`/VR-Headsets`)}>VR-Headsets</li>
<li className="cursor-pointer text-white hover:font-bold"
onClick={() => navigate(`/Laptops`)}>Laptops</li>
<li className="cursor-pointer text-white hover:font-bold"
onClick={() => navigate(`/Equipment`)}>Equipment</li>
<li className="cursor-pointer text-white hover:font-bold"
onClick={() => navigate(`/Audio & Lighting`)}>Audio & Lighting</li>
<li className="cursor-pointer text-white hover:font-bold"
onClick={() => navigate(`/More`)}>More</li>

      </ul>
    </div>
  );
}
