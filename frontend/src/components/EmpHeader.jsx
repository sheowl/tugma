import React from "react";
import TugmaLogo from "../assets/TugmaLogo.svg";

const EmpHeader = () => (
  <>
    <div className="absolute top-20 left-40 pl-24">
      <img src={TugmaLogo} alt="Logo" className="w-[520px] h-[126px]" />
    </div>
    <div className="absolute top-[130px] right-60 text-2xl text-[#3C3B3B] font-semibold">
      Looking for work?{" "}
      <a href="/applicant-email-registration" className="text-[#E66F24] hover:underline font-semibold">
        Apply as talent
      </a>
    </div>
  </>
);

export default EmpHeader;
