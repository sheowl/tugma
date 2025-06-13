import React, { useState } from "react";

const JobCard = (props) => {
  const {
    jobTitle = "Job Title",
    companyName = "Company Name",
    location = "Sta Mesa, Manila",
    type = "On-Site",
    employment = "Full-Time",
    description = "",
    status = "Active",
    postedDaysAgo = 0,
    onAction = () => {},
    actionLabel = "Action",
    actionOptions = [
      { label: "View Full", value: "view_full" },
      { label: "Waitlist", value: "waitlist" },
      { label: "Reject", value: "reject" },
    ],
  } = props;

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

  const statusClass =
    status === "Archived"
      ? "text-[#FACC15]"
      : "text-[#16A34A]";  

  return (
    <div
      className="bg-white border rounded-[20px] shadow-all-around p-8 flex flex-col"
      style={{
        width: 316,
        minWidth: 316,
        maxWidth: 316,
        height: 330,
        minHeight: 330,
        maxHeight: 330,
      }}
    >
      {/* Main content */}
      <div className="flex-1 flex flex-col">
      <div className="font-bold text-2xl whitespace-nowrap overflow-hidden text-ellipsis">{jobTitle}</div>
        <div className="text-[14px] font-bold text-[#6B7280] flex items-center gap-1">{companyName}</div>
        <div className="text-[10px] font-semibold text-[#6B7280] flex items-center gap-1">{location}</div>
        <div className="flex gap-2 mt-2">
          <span className="bg-[#FFEDD5] text-[#3C3B3B] px-3 py-1 rounded font-semibold text-[11px] flex items-center gap-1">
            <i className="bi bi-geo-alt-fill text-xs text-[#FF8032]" /> {type}
          </span>
          <span className="bg-[#FFEDD5] text-[#3C3B3B] px-3 py-1 rounded font-semibold text-[11px] flex items-center gap-1">
            <i className="bi bi-briefcase-fill text-xs text-[#FF8032]" /> {employment}
          </span>
        </div>
        <div className="text-[#676767] text-[12px] font-semibold mt-2 break-words w-full line-clamp-2">
          {description}
        </div>
      </div>
      {/* Fixed bottom section */}
      <div className="flex items-center justify-between pt-4">
        <div>
          <span className={`text-[16px] font-bold ${statusClass}`}>{status}</span>
          <div className="text-[12px] text-gray-400">
            Posted: {postedDaysAgo} days ago
          </div>
        </div>
        <div className="relative">
          <button
            className="border-2 border-[#FF8032] text-[#FF8032] rounded-[10px] px-6 py-2 text-[12px] font-bold bg-white flex items-center hover:bg-[#FF8032]/10 transition-colors"
            onClick={handleActionClick}
            type="button"
          >
            {actionLabel} <i className="bi bi-caret-down-fill text-[12px]" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow z-40">
              {actionOptions.map((option) => (
                <div
                  key={option.value}
                  className="px-4 py-2 text-[#FF8032] hover:bg-[#FF8032]/10 hover:text-[#FF8032] cursor-pointer text-[12px] font-semibold"
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
};

export default JobCard;
