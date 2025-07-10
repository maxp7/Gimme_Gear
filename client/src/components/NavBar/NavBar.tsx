import ButtonsLeft from "./ButtonsLeft";
import ButtonsRight from "./ButtonsRight";
import SearchBarContainer from "./SearchBar/SearchBarContainer";
import { useState } from "react";
import DropDown from "../DropDown/DropDown";

export default function NavBar() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const hideDropdown = () => setIsDropdownVisible(false);

  return (
    <div
      className="relative h-[8rem]" 
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
        <ButtonsRight />
      </div>
      <DropDown isVisible={isDropdownVisible} />
    </div>
  );
}
