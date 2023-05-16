import React from "react";

import logo from "../images/logo.png";

const Footer = () => (
  <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
    <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
      <div className="flex flex-[0.5] justify-center items-center">
        <img src={logo} alt="logo" className="w-32" />
      </div>
      <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
        <p className="text-white text-base text-center mx-2 cursor-pointer" onClick={()=>window.open("/", "_self")}>Homepage</p>
        <p className="text-white text-base text-center mx-2 cursor-pointer" onClick={()=>window.open("https://pancakeswap.finance/swap?outputCurrency=0x34c475EefEF0446B3729c3880Ad69D9fFC9941CC", "_blank")}>Exchange</p>
        <p className="text-white text-base text-center mx-2 cursor-pointer" onClick={()=>window.open("https://pancakeswap.finance/swap?outputCurrency=BNB&inputCurrency=0x55d398326f99059fF775485246999027B3197955", "_blank")}>Liquidity</p>
      </div>
    </div>

    <div className="flex justify-center items-center flex-col mt-5">
      <p className="text-white text-sm text-center">Come join us and hear for the unexpected miracle</p>
      <p className="text-white text-sm text-center font-medium mt-2">SmartChainVentures@gmail.com</p>
    </div>

    <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5 " />

    <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
      <p className="text-white text-left text-xs">SmartChainVentures</p>
      <p className="text-white text-right text-xs">All rights reserved</p>
    </div>
  </div>
);

export default Footer;
