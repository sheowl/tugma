import React, { useState } from "react";
import Card from '../components/Card.jsx';
import EmployerSideBar from "../components/EmployerSideBar";
import EmployerApplicantHeader from "../components/EmployerApplicantHeader";

const EmployerApplicants = () => {

  return (
    <div className="min-h-screen bg-[#FF8032] flex items-start overflow-hidden">
      <EmployerSideBar />
        {/* Main Content Area */}
          <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-2 sm:p-4 md:p-6 shadow-md w-full max-w-full">
            <EmployerApplicantHeader />
            <div className="pl-[112px] pr-[118px] mb-10">
            </div> 
          </div>
      </div>
  );
};

export default EmployerApplicants