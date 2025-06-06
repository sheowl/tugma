import React from "react";
import SaveButton from "./SaveButton";
import Tag from "./JobSkillTag";

export default function JobDetailsDrawer({ open, onClose, job, onApply }) {
  if (!job) return null;


let matchScoreColor = "text-[#27AE60]"; 
if (job.matchScore < 50) {
  matchScoreColor = "text-red-500";
} else if (job.matchScore < 75) {
  matchScoreColor = "text-yellow-500";
}

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 z-40 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[640px] bg-white shadow-2xl z-50 transform transition-transform duration-300 rounded-tl-[30px] rounded-bl-[30px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >

        {/* Content */}
        <div className="flex flex-col m-8 h-full pt-16 px-10 pb-6 font-montserrat overflow-y-auto">
          {/* Header */}
          <div className="mb-4">
            <span className={`text-2xl font-bold ${matchScoreColor}`}>{job.matchScore}% Matched</span>
            <h2 className="text-4xl font-bold mt-1">{job.jobTitle}</h2>
            <h3 className="text-xl font-semibold text-[#676767]">{job.companyName}</h3>
            <p className="text-base text-[#676767]">{job.location}</p>
          </div>

          {/* Salary */}
          <div className="flex items-center gap-2 mb-6">
            <p className="text-2xl font-bold">₱{job.salaryRangeLow}K - ₱{job.salaryRangeHigh}K</p>
            <p className="text-base font-normal text-gray-500">{job.salaryFrequency.toLowerCase()}</p>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-6">
            <span className="px-2 py-1 bg-indigo-50 rounded text-xs font-semibold text-neutral-700">
              <i className="bi bi-geo-alt-fill text-[#2A4D9B] mr-1" />
              {job.workSetup}
            </span>
            <span className="px-2 py-1 bg-indigo-50 rounded text-xs font-semibold text-neutral-700">
              <i className="bi bi-briefcase-fill text-[#2A4D9B] mr-1" />
              {job.employmentType}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6 gap-2">
            <h4 className="text-base font-bold mb-1">Job Description</h4>
            <p className="text-sm text-[#676767]">{job.description}</p>

            <p className="text-md text-[#676767] font-medium mb-6">2 available positions</p>
          </div>

 
          
          {/* Tag Matches */}
          <div className="mb-6">
            <h4 className="text-base font-bold mb-2">Tag Matches</h4>
            <div className="flex gap-2 flex-wrap">
              <Tag label="React" matched={true} />
              <Tag label="Python" matched={false} />
            </div>
          </div>


          {/* Apply Button */}
          <div className="flex justify-center">
            <button
                className="w-[262px] bg-[#2A4D9B] text-white font-bold py-3 rounded-[10px] hover:bg-[#1f3c7b] transition-colors"
                onClick={onApply}
>
                Apply Now
            </button>
        </div>
        </div>
      </div>
    </>
  );
}
