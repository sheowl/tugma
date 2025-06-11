import React, { useState } from "react";

function EmpCard({
  matched = 0,
  isNew = false,
  candidateName = "Candidate Name",
  role = "User Current/Previous Role",
  skills = [],
  moreSkillsCount = 0,
  appliedDaysAgo = 'n',
  onAction = () => {},
  actionLabel = "Action",
  actionOptions = [
    { label: "View Full", value: "view_full" },
    { label: "Waitlist", value: "waitlist" },
    { label: "Reject", value: "reject" },
  ],
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [status, setStatus] = useState(isNew ? 'new' : '');

  const handleActionClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleOptionClick = (option) => {
    setDropdownOpen(false);
    if (option && option.value === 'waitlist') {
      setStatus('waitlisted');
    } else if (option && option.value === 'reject') {
      setStatus('reject');
    } else if (option && option.value === 'view_full') {
      // No alert or popup
    }
    if (option && option.onClick) {
      // Do not call option.onClick if it triggers an alert or popup
    } else if (option && onAction) {
      // Do not call onAction if it triggers an alert or popup
    }
  };

  return (
    <div className="bg-white shadow-all-around rounded-[20px] p-6 max-w-[304px] h-[330px] flex flex-col justify-between relative">
      {/* Top: Match + New */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-[32px] font-bold text-[#27AE60] leading-none">{matched}%</div>
          <div className="text-[#27AE60] text-base font-bold -mt-2">Matched</div>
        </div>
        {status === 'new' && (
          <div className="flex items-center gap-1 text-[#464646] text-base font-semibold">
            New
            <span className="inline-block w-2 h-2 bg-[#FF8032] rounded-full ml-1"></span>
          </div>
        )}
        {status === 'waitlisted' && (
          <div className="flex items-center gap-1 text-[#464646] text-base font-semibold rounded-full px-3 py-1"> Waitlisted 
              <span className="inline-block w-2 h-2 bg-[#F5B041] rounded-full ml-1"></span>
          </div>
        )}
        {status === 'reject' && (
          <div className="flex items-center gap-1 text-[#464646] text-base font-semibold rounded-full px-3 py-1"> Rejected 
              <span className="inline-block w-2 h-2 bg-[#E74C3C] rounded-full ml-1"></span>
          </div>
        )}
      </div>

      {/* Candidate Name & Role */}
      <div className="mb-2">
        <div className="text-[20px] font-bold text-[#3C3B3B] leading-tight">{candidateName}</div>
        <div className="text-[14px] text-[#6B7280] font-semibold">{role}</div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.slice(0, 5).map((skill, idx) => (
          <span key={idx} className="px-3 py-1 text-[#FF8032] border-2 border-[#FF8032] rounded-[5px] text-xs font-bold bg-[#FFF7F2]">
            {skill}
          </span>
        ))}
        {moreSkillsCount > 0 && (
          <span
            className="px-3 py-1 text-white border-2 border-[#FF8032] rounded-[5px] text-xs font-semibold bg-[#FF8032]"
          >
            +{moreSkillsCount} More
          </span>
        )}
      </div>

      {/* Applied & Action */}
      <div className="flex items-center justify-between mt-auto">
        <div className="text-[12px] text-[#676767] font-semibold">
          Applied: <span className="italic">{appliedDaysAgo}</span> days ago
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

export default EmpCard;
