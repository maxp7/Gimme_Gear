import ButtonsLeft from "./ButtonsLeft";
import ButtonsRight from "./ButtonsRight";
import SearchBarContainer from "./SearchBar/SearchBarContainer";
import { useState, useEffect } from "react";
import DropDown from "../DropDown/DropDown";
import LoginDropDown from "../DropDown/LoginDropDown"
import Cart from "../Cart/Cart";

type NavBarProps = {
  onDropdownChange?: (visible: boolean) => void;
};


export default function NavBar({ onDropdownChange }: NavBarProps) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoginDropdownVisible, setIsLoginDropdownVisible] = useState(false);
  const [isCartDropdownVisible, setIsCartDropdownVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleDropdown = (visible: boolean) => {
    setIsDropdownVisible(visible);
    onDropdownChange?.(visible); 
  };
  
  const hideDropdown = () => handleDropdown(false);
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);
  return (
    <div
      className="relative h-[5rem] md:h-[8rem]"
      onMouseLeave={hideDropdown}
    >
      <div className="flex m-4 gap-8">
        <ButtonsLeft
          isDropdownVisible={isDropdownVisible}
          setIsDropdownVisible={handleDropdown} 
        />
        <div
          className="h-[6rem] w-[80%]"

        >
          <SearchBarContainer />
        </div>
        <ButtonsRight
          isDropdownVisible={isLoginDropdownVisible}
          setIsDropdownVisible={setIsLoginDropdownVisible}
          isCartnDropdownVisible={isCartDropdownVisible}
          setIsCartDropdownVisible={setIsCartDropdownVisible}
        />
      </div>

      <DropDown isVisible={isDropdownVisible} />
      <LoginDropDown
        isLoginVisible={isLoginDropdownVisible}
        isDropdownVisible={isDropdownVisible}
        setIsLoginVisible={setIsLoginDropdownVisible}
      />

      <Cart
        isCartVisible={isCartDropdownVisible}
        setIsCartVisible={setIsCartDropdownVisible}
        setToastMessage={setToastMessage}
      />
      
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-black font-bold text-white px-4 py-2 rounded shadow z-[100] whitespace-pre-line">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
