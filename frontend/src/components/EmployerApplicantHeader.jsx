import React, { useState } from "react";
import Dropdown from "./Dropdown";

const sortOptions = [
  { label: "Best Match", value: "best" },
  { label: "Most Recent", value: "recent" },
];

const filterOptions = [
  { label: "High", value: "high" },
  { label: "Average", value: "average" },
  { label: "Low", value: "low" },
];

const statusOptions = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Rejected", value: "rejected" },
];

const filterContent = (
  <div className="p-4 w-80 text-[14px] font-semibold grid grid-cols-2 gap-2">
    {/* First column: By Match Score, By Status */}
    <div className="flex flex-col gap-6 items-start">
        <div className="font-semibold text-[#6B7280] mb-1 mt-2">By Match Score</div>
        <div className="h-12" />
        <div className="font-semibold text-[#6B7280] mb-1">By Status</div>
    </div>
    {/* Second column: High, Average, Low */}
    <div className="flex flex-col gap-1 justify-start items-start">
      {filterOptions.map((opt) => (
        <div key={opt.value} className="hover:bg-[#FF8032]/10 hover:text-[#FF8032] p-1 mt-1 rounded cursor-pointer transition-colors" >
          {opt.label}
        </div>
      ))}
      <div className="h-2" />
      {statusOptions.map((opt) => (
        <div key={opt.value} className="hover:bg-[#FF8032]/10 hover:text-[#FF8032] p-1 rounded cursor-pointer transition-colors" >
          {opt.label}
        </div>
      ))}
    </div>
  </div>
);

const EmployerApplicantHeader = () => {
  const [selectedSort, setSelectedSort] = useState(sortOptions[0].value);

  return (
    <div className="mt-6 bg-white relative">
      <div className="flex justify-between items-center p-4 pl-[112px] pr-[118px]">
        {/* Left Section */}
        <div className="flex flex-col justify-center h-full">
          <h1 className="text-[48px] font-bold text-[#FF873F] flex items-center gap-2">
            Job Post 2
            <span className="text-gray-400 text-sm cursor-pointer flex items-center">
              <i className="bi bi-pencil-fill text-[20px] pl-4"></i>
            </span>
          </h1>
          <p className="text-[20px] text-[#FF873F] font-semibold mt-1">
            Total Applicants: <span className="italic">N</span>
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-end text-right gap-4 justify-center h-full text-right mt-8">
          <div className="flex items-center justify-end space-x-2 mt-0 text-right">
            <div className="w-8 h-8 rounded-full bg-[#FFE3D2]" />
            <div className="text-right text-[#FF8032]">
              <div className="text-[14px] font-bold">Company Name</div>
              <div className="text-[12px] font-opensans italic">
                Company/Business Type
              </div>
            </div>
          </div>
          {/* Dropdown Buttons */}
          <div className="flex justify-end gap-6 text-[16px] font-semibold relative mt-0 text-right z-30">
            <Dropdown
              label="Sort by"
              options={sortOptions}
              onSelect={setSelectedSort}
              selected={selectedSort}
              width="w-40"
            />
            <Dropdown
              label="Filter by"
              customContent={filterContent}
              width="w-72"
            />
          </div>
        </div>
      </div>
      <div className="pl-[112px] pr-[118px]">
        <hr className="border-t-2 border-[#000000]/20" />
      </div>
    </div>
  );
};

export default EmployerApplicantHeader;