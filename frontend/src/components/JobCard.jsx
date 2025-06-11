import React, { useState } from "react";

function JobCard({
  jobTitle = "Job Title",
  companyName = "Company Name",
  location = "Sta Mesa, Manila",
  type = "On-Site",
  employment = "Full-Time",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  status = "Active",
  postedDaysAgo = "n",
  onAction = () => {},
  actionLabel = "Action",
  actionOptions = [
    { label: "View Full", value: "view_full" },
    { label: "Waitlist", value: "waitlist" },
    { label: "Reject", value: "reject" },
  ],
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleActionClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleOptionClick = (option) => {
    setDropdownOpen(false);
    if (option && onAction) {
      onAction(option);
    }
  };

  return (
    <div className="bg-white shadow-all-around rounded-[20px] p-6 max-w-[304px] min-h-[330px] flex flex-col justify-between relative">
      {/* Title & Company */}
      <div>
        <div className="text-[24px] font-bold text-[#262424] leading-tight mb-1">{jobTitle}</div>
        <div className="text-[14px] font-bold text-[#6B7280] leading-tight">{companyName}</div>
        <div className="text-[10px] text-[#6B7280] font-semibold mb-2">{location}</div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-2">
        <span className="flex items-center gap-1 px-3 py-1 bg-[#FFEDD5] text-[#3C3B3B] text-xs font-bold rounded-[7px]">
          <i className="bi bi-geo-alt-fill text-[#FF8032]" />
          {type}
        </span>
        <span className="flex items-center gap-1 px-3 py-1 bg-[#FFEDD5] text-[#3C3B3B] text-xs font-bold rounded-[7px]">
          <i className="bi bi-briefcase-fill text-[#FF8032]" />
          {employment}
        </span>
      </div>

      {/* Description */}
      <div className="text-[12px] text-[#676767] font-semibold mb-4" style={{ minHeight: 60 }}>
        {description}
      </div>

      {/* Status & Action */}
      <div className="flex items-center justify-between mt-auto">
        <div>
          <div className="text-[16px] font-bold text-[#16A34A]">{status}</div>
          <div className="text-[10px] text-[#6B7280]">
            Posted: <span className="italic">{postedDaysAgo}</span> days ago
          </div>
        </div>
        <div className="relative">
          <button
            className="h-8 px-6 py-2 border-2 border-[#FF8032] text-[#FF8032] rounded-[10px] text-[14px] font-bold bg-white flex items-center gap-2 hover:bg-[#FF8032]/10 transition-colors"
            onClick={handleActionClick}
            type="button"
          >
            {actionLabel} <i className="bi bi-caret-down-fill text-xs" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow z-40">
              {actionOptions.map((option) => (
                <div
                  key={option.value}
                  className="px-4 py-2 text-[#FF8032] hover:bg-[#FF8032]/10 hover:text-[#FF8032] cursor-pointer text-sm font-semibold"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobCard;
