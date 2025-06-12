import React from "react";
import SaveButton from "./SaveButton";

function truncate(text, maxLength = 80) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}


function Card({
  jobTitle,
  companyName,
  location,
  matchScore,
  employmentType,
  workSetup,
  description,
  salaryRangeLow,
  salaryRangeHigh,
  salaryFrequency = "Monthly",
  companyDescription,
  onViewDetails,
}) {

  const jobData = {
  jobTitle,
  companyName,
  location,
  matchScore,
  employmentType,
  workSetup,
  description,
  salaryRangeLow,
  salaryRangeHigh,
  salaryFrequency,
  companyDescription
};

  let matchScoreColor = "text-[#27AE60]"; 
  if (matchScore < 50) {
    matchScoreColor = "text-[#E74C3C]";
  } else if (matchScore < 75) {
    matchScoreColor = "text-[#F5B041]";
  }

  return (
    <div className="bg-white shadow-all-around rounded-[20px] p-6 max-w-[304px] h-[330px] flex flex-col justify-between relative">
      
      {/* Save Button + Match Score */}
      <div className="flex justify-between items-center">
        <SaveButton size={45} />
        <div className={`text-end text-xl font-bold leading-tight ${matchScoreColor}`}>
          <div className="text-xl">{matchScore}%</div>
          <div className="text-sm font-bold -mt-[10%]">Matched</div>
        </div>
      </div>

      {/* Title, Company, Location */}
      <div className="space-y-0 -mt-[5%]">
        <h2 className="text-2xl font-bold text-black leading-tight">{jobTitle}</h2>
        <h3 className="text-sm font-bold text-[#676767]">{companyName}</h3>
        <p className="text-[10px] text-[#676767]">{location}</p>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex items-center justify-center px-2 py-[3px] bg-indigo-50 rounded-[5px]">
            <div className="flex items-center space-x-1 text-xs font-semibold text-neutral-700">
              <i className="bi bi-geo-alt-fill text-[#2A4D9B]" />
              <span>{workSetup}</span>
            </div>
          </div>

          <div className="flex items-center justify-center px-2 py-[3px] bg-indigo-50 rounded-[5px]">
            <div className="flex items-center space-x-1 text-xs font-semibold text-neutral-700">
              <i className="bi bi-briefcase-fill text-[#2A4D9B]" />
              <span>{employmentType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="text-xs font-medium text-[#676767]">
         {truncate(description, 80)}
      </div>

      {/* Salary + Button */}
      <div className="flex items-center justify-between mt-2">
        <div className="leading-tight flex flex-col justify-center">
          <p className="text-base font-bold">₱{salaryRangeLow}K - ₱{salaryRangeHigh}K</p>
          <p className="text-[10px] font-semibold text-gray-500 -mt-1">{salaryFrequency}</p>
        </div>

        <button 
        onClick={() => onViewDetails(jobData)} 
        className="h-8 px-6 py-2 bg-white rounded-[10px] outline outline-1 outline-[#2A4D9B] inline-flex justify-center items-center gap-2.5 text-[#2A4D9B] text-xs font-bold hover:bg-[#2A4D9B] hover:text-white transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}

export default Card;
