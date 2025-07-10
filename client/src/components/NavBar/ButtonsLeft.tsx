import { useNavigate } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";

type ButtonsLeftProps = {
  isDropdownVisible: boolean;
  setIsDropdownVisible: (visible: boolean) => void;
};

export default function ButtonsLeft({
  setIsDropdownVisible,
}: ButtonsLeftProps) {
  const navigate = useNavigate();

  const showDropdown = () => setIsDropdownVisible(true);

  return (
    <div className="relative w-[150px] h-[3rem] rounded-[20px] bg-gray-400/25 flex items-center justify-around p-2">
      <button onMouseEnter={showDropdown} className="focus:outline-none">
        <GiHamburgerMenu className="w-6 h-6 text-white" />
      </button>
      <button onClick={() => navigate("/")} className="focus:outline-none">
        <FiHome className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
