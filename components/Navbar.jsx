import React from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

import logo from "../images/logo.png";

const NavBarItem = ({ title, classprops, cb }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`} onClick={cb}>{title}</li>
);

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={logo} alt="logo" className="w-32 cursor-pointer" />
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
          <NavBarItem title={"Homepage"} cb={()=>window.open("/", "_self")} />
          <NavBarItem title={"Exchange"} cb={()=>window.open("https://pancakeswap.finance/swap?outputCurrency=0x34c475EefEF0446B3729c3880Ad69D9fFC9941CC", "_blank")}/>
        <li className="bg-[#7269ff] py-2 px-14 mx-4 rounded-full cursor-pointer hover:bg-[#7269ff]"
        onClick={()=>window.open("https://pancakeswap.finance/swap?outputCurrency=BNB&inputCurrency=0x55d398326f99059fF775485246999027B3197955", "_blank")}>
          Buy BNB
        </li>
      </ul>
      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
        )}
        {toggleMenu && (
          <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
        )}
        {toggleMenu && (
          <ul
            onClick={()=>window.open("https://pancakeswap.finance/swap?outputCurrency=0x34c475EefEF0446B3729c3880Ad69D9fFC9941CC", "_blank")}
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2"><AiOutlineClose onClick={() => setToggleMenu(True)} /></li>
            {["Homepage", "Exchange",].map(
              (item, index) => <NavBarItem key={item + index} title={item} classprops="my-2 text-lg" />,
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
