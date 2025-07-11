import { FiLogIn } from "react-icons/fi";
import { FiShoppingCart } from "react-icons/fi";

type ButtonsRightProps = {
  isLoginDropdownVisible: boolean;
  setIsLoginDropdownVisible: (visible: boolean) => void;
  isCartnDropdownVisible: boolean;
  setIsCartDropdownVisible: (visible: boolean) => void;
};

export default function ButtonsRight({
  isLoginDropdownVisible,
  setIsLoginDropdownVisible,
  isCartnDropdownVisible,
  setIsCartDropdownVisible
}: ButtonsRightProps) {

  const toggleLoginDropdown = () => setIsLoginDropdownVisible(!isLoginDropdownVisible);
  const toggleCartDropdown = () => setIsCartDropdownVisible(!isCartnDropdownVisible);

  return (
    <div className="relative w-[150px] h-[3rem] rounded-[20px] bg-gray-400/25 flex items-center justify-around p-2">
      <button
        onClick={toggleLoginDropdown}
        title="Login"
        className="text-2xl"
      >
        <FiLogIn />
      </button>

      <button
        onClick={toggleCartDropdown}
        title="Cart"
        className="text-2xl"
      >
        <FiShoppingCart />
      </button>
    </div>
  );
}
