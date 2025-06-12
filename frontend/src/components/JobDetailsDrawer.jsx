import React, { useState } from "react";
import SaveButton from "./SaveButton";
import Tag from "./JobSkillTag";
import CompanyDetails from "./CompanyDetails";

export default function JobDetailsDrawer({ open, onClose, job, onApply }) {
  const [companyDetailsOpen, setCompanyDetailsOpen] = useState(false); // State for CompanyDetails drawer

  let matchScoreColor = "text-[#27AE60]";
  if (job && job.matchScore < 50) {
    matchScoreColor = "text-[#E74C3C]";
  } else if (job && job.matchScore < 75) {
    matchScoreColor = "text-[#F5B041]";
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 z-40 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 px-8 right-0 h-full w-[640px] bg-white shadow-2xl z-50 transform transition-transform duration-300 rounded-tl-[30px] rounded-bl-[30px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Top Bar */}
          <div className="flex items-center justify-between mt-12 px-10 h-[80px] z-10">
            <button
              className="p-2 text-gray-400 hover:text-gray-700"
              onClick={onClose}
              aria-label="Close"
            >
              <i className="bi bi-arrow-left text-5xl" />
            </button>
            <SaveButton size={60} />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-10 pb-40 font-montserrat">
            <div className="flex flex-col gap-6">
              {job ? (
                <>
                  {/* Header */}
                  <div className="space-y-4">
                    <div className="mb-4">
                      <span className={`text-2xl font-bold ${matchScoreColor}`}>{job.matchScore}% Matched</span>
                      <h2 className="text-4xl font-bold mt-1 ">{job.jobTitle}</h2>

                      <div className="flex items-center">
                        <h3 className="text-xl font-semibold text-[#676767]">{job.companyName}</h3>
                        <i
                          className="bi bi-info-circle text-[19px] ml-2 cursor-pointer text-gray-500"
                          title="Company Information"
                          onClick={() => setCompanyDetailsOpen(true)} // Open CompanyDetails drawer
                        />
                      </div>

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
                  </div>
                  {/* Description */}
                  <div className="space-y-12">
                    <div className="gap-2">
                      <h4 className="text-base font-bold mb-1 text-neutral-700">Job Description</h4>
                      <p className="text-sm text-[#676767]">{job.description}</p>
                    </div>
                    <p className="text-md text-[#676767] font-medium mb-6">
                      {job?.availablePositions > 1
                        ? `${job.availablePositions} available positions`
                        : `${job?.availablePositions || 0} available position`}
                    </p>
                    {/* Tag Matches */}
                    <div className="mb-6">
                      <h4 className="text-base font-bold mb-2 text-neutral-700">Tag Matches</h4>
                      <div className="flex gap-2 flex-wrap">
                        {job.tags.map((tag, index) => (
                          <Tag key={index} label={tag.label} matched={tag.matched} />
                        ))}
                      </div>
                    </div>
                    {/* Apply Button */}
                    <div className="w-full flex justify-center">
                      <button
                        className="w-[262px] bg-[#2A4D9B] text-white font-bold py-3 rounded-[10px] hover:bg-[#1f3c7b] transition-colors"
                        onClick={onApply}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  {/* Optionally, show nothing or a placeholder */}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer mask */}
      </div>

      {/* CompanyDetails Drawer */}
      <CompanyDetails
        open={companyDetailsOpen}
        onClose={() => setCompanyDetailsOpen(false)} // Close the drawer
        job={job} // Pass the job details
      />
    </>
  );
}
