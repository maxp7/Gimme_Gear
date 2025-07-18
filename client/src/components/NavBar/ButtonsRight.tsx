import { useEffect, useState } from "react";
import { FiLogIn, FiShoppingCart } from "react-icons/fi";

type ButtonsRightProps = {
  isDropdownVisible: boolean;
  setIsDropdownVisible: (visible: boolean) => void;
  isCartnDropdownVisible: boolean;
  setIsCartDropdownVisible: (visible: boolean) => void;
};

export default function ButtonsRight({
  isDropdownVisible,
  setIsDropdownVisible,
  isCartnDropdownVisible,
  setIsCartDropdownVisible
}: ButtonsRightProps) {

  const toggleLoginDropdown = () => setIsDropdownVisible(!isDropdownVisible);
  const toggleCartDropdown = () => setIsCartDropdownVisible(!isCartnDropdownVisible);

  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("deviceCart") || "[]");
    setCartCount(cart.length);
  };

  useEffect(() => {
    // Initialize on mount
    updateCartCount();

    // Listen for cartUpdated
    const handler = () => updateCartCount();
    window.addEventListener("cartUpdated", handler);

    return () => {
      window.removeEventListener("cartUpdated", handler);
    };
  }, []);

  

  return (
    <div className="relative w-[150px] h-[3rem] rounded-[20px] flex items-center justify-around p-2">
      <button
        onClick={toggleLoginDropdown}
        title="Login"
        className="text-2xl"
      >
        <FiLogIn className="text-[black] hover:cursor-pointer hover:scale-110" />
      </button>

      <button
        onClick={toggleCartDropdown}
        title="Cart"
        className="text-2xl text-black relative"
      >
        <FiShoppingCart className="text-[black] hover:cursor-pointer hover:scale-110" />
        {cartCount > 0 && (
          <span className="absolute left-4 bottom-3 text-black text-xs font-bold border-2 border-black rounded-full px-1.5 bg-white">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}
