import ButtonsLeft from "./ButtonsLeft";
import ButtonsRight from "./ButtonsRight";
import SearchBarContainer from "./SearchBar/SearchBarContainer";
import { useState } from "react";
import DropDown from "../DropDown/DropDown";
import AdminLogin from "../AdminLogin";
import Cart from "../Cart/Cart";

export default function NavBar() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoginDropdownVisible, setIsLoginDropdownVisible] = useState(false);
  const [isCartDropdownVisible, setIsCartDropdownVisible] = useState(false);
  const hideDropdown = () => setIsDropdownVisible(false);

  return (
    <div
      className="relative h-[6rem]"
      onMouseLeave={hideDropdown}
    >
      <div className="flex m-4 gap-8">
        <ButtonsLeft
          isDropdownVisible={isDropdownVisible}
          setIsDropdownVisible={setIsDropdownVisible}
        />
        <div
          className=" h-[6rem] w-[80%]
  "
          onMouseEnter={hideDropdown}>
          <SearchBarContainer />
        </div>
        <ButtonsRight
          isLoginDropdownVisible={isLoginDropdownVisible}
          setIsLoginDropdownVisible={setIsLoginDropdownVisible}
          isCartnDropdownVisible={isCartDropdownVisible}
          setIsCartDropdownVisible={setIsCartDropdownVisible}
        />
      </div>
      <DropDown isVisible={isDropdownVisible} />
      <AdminLogin
        isLoginVisible={isLoginDropdownVisible}
        setIsLoginVisible={setIsLoginDropdownVisible} />
      <Cart
  isCartVisible={isCartDropdownVisible}
  setIsCartVisible={setIsCartDropdownVisible}
/>

    </div>
  );
}
