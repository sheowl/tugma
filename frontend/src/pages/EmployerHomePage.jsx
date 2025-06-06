import React, { useState } from "react";
import EmployerSideBar from "../components/EmployerSideBar";
import EmployerApplicantHeader from "../components/EmployerApplicantHeader";

const EmployerHomePage = () => {
  return (
    <div className="min-h-screen bg-[#FF8032] flex items-start overflow-hidden">
      <EmployerSideBar />
      {/* Main Content Area */}
      <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-2 sm:p-4 md:p-6 shadow-md w-full max-w-full">
        <EmployerApplicantHeader />
        {/* Your content goes here */}
      </div>
    </div>
  );
};

export default EmployerHomePage;
