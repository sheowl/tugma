import React from "react";
import TugmaLogo from "../assets/TugmaLogo.svg";

const EmpHeader = () => (
  <>
    <div className="absolute top-8 left-4 pl-4 sm:top-12 sm:left-16 sm:pl-12 md:top-20 md:left-40 md:pl-24">
      <img src={TugmaLogo} alt="Logo" className="w-40 h-16 sm:w-60 sm:h-20 md:w-[192px] md:h-[60px]" />
    </div>
    <div className="absolute top-16 right-4 text-xs sm:top-20 sm:right-16 sm:text-sm md:top-24 md:right-60 md:text-base text-[#3C3B3B] font-semibold">
      Looking for work?{" "}
      <a href="/applicant-email-registration" className="text-[#E66F24] hover:underline">
        Apply as talent
      </a>
    </div>
  </>
);

export default EmpHeader;
