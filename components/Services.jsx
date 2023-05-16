import React from "react";
import { BsBarChartLineFill, BsFileBarGraphFill, BsShieldFillCheck } from "react-icons/bs";
import { BiBarChart, BiBarChartAlt, BiBarChartAlt2, BiBarChartSquare, BiCoin, BiCoinStack, BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";

const ServiceCard = ({ color, title, icon, subtitle }) => (
  <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl">
    <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
      {icon}
    </div>
    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-1 text-white text-lg">{title}</h3>
      <p className="mt-1 text-white text-sm md:w-9/12">
        {subtitle}
      </p>
    </div>
  </div>
);

const Services = () => (
  <div className="flex w-full justify-center items-center gradient-bg-services">
    <div className="flex sm:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
      <div className="flex-1 flex flex-col justify-start items-start">
        <h1 className="text-white text-3xl sm:text-5xl py-2 ">
          Why Vault
        </h1>
        <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
        Smart Chain Ventures offers a unique investment opportunity for investors to gain exposure to a diversified portfolio of cash flowing assets while earning passive income through our innovative Vault system. Our team of experts is dedicated to maximizing returns while minimizing risks, and we are confident in our ability to deliver results for our investors. With a clear investment strategy and a strong community of investors, we believe Smart Chain Ventures is positioned for long-term success.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-start items-center">
        <ServiceCard
          color="bg-[#7269ff]"
          title="Security Guarantee"
          icon={<BsShieldFillCheck fontSize={20} className="text-white" />}
          subtitle="Security is guaranteed. We always maintain privacy and transparency in this growing web 3.0 industry.           "
        />
        <ServiceCard
          color="bg-[#7269ff]"
          title="Sustainability"
          icon={<BsBarChartLineFill fontSize={20} className="text-white" />}
          subtitle="Sustainability in an unstable market is a must. We aim to bring a sustainable market to an unstable enviroment. "
        />
        <ServiceCard
          color="bg-[#7269ff]"
          title="Vaulting Period"
          icon={<BiCoinStack fontSize={20} className="text-white" />}
          subtitle="When investors pair their BNB with SCV, they will be eligible to receive dividends for a period of 18 months at an estimated 8% monthly return rate."
        />
      </div>
    </div>
  </div>
);

export default Services;
