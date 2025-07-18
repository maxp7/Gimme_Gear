import ButtonsLeft from "./ButtonsLeft";
import ButtonsRight from "./ButtonsRight";
import SearchBarContainer from "./SearchBar/SearchBarContainer";
import { useState } from "react";
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

  // Always use this helper to change dropdown
  const handleDropdown = (visible: boolean) => {
    setIsDropdownVisible(visible);
    onDropdownChange?.(visible); // inform parent
  };

  const hideDropdown = () => handleDropdown(false);

  return (
    <div
      className="relative h-[6rem]"
      onMouseLeave={hideDropdown} // <- already correct
    >
      <div className="flex m-4 gap-8">
        <ButtonsLeft
          isDropdownVisible={isDropdownVisible}
          setIsDropdownVisible={handleDropdown} // pass handleDropdown
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
      />
    </div>
  );
}
