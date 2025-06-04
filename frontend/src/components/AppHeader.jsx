import React from "react";
import TugmaLogo from "../assets/TugmaLogo.svg";

const AppHeader = () => (
  <>
    <div className="absolute top-20 left-40 pl-24">
      <img src={TugmaLogo} alt="Logo" className="w-[520px] h-[126px]" />
    </div>
    <div className="absolute top-[130px] right-60 text-2xl text-[#3C3B3B] font-semibold">
      Here to hire applicants?{" "}
      <a href="/employer-email-registration" className="text-[#16367D] hover:underline font-semibold">
        Join as an Employer
      </a>
    </div>
  </>
);

export default AppHeader;
