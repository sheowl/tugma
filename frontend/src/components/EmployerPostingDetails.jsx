import React, { useState } from "react";
import ActiveSaveIcon from "../assets/ActiveSaveIcon.svg";

export default function EmployerPostingDetails({ open, onClose, job, onEdit }) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 z-40 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 px-8 right-0 h-full w-[640px] bg-white shadow-2xl z-50 transform transition-transform duration-300 rounded-tl-[30px] rounded-bl-[30px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">          
          <div className="flex items-center justify-between mt-12 px-10 h-[80px] z-10">
            <button
              className="w-[52px] h-[52px] text-gray-400 hover:text-black flex items-center justify-center"
              onClick={onClose}
              aria-label="Close"
            >
              <i className="bi bi-arrow-left text-[52px]" />
            </button>
            <img src={ActiveSaveIcon} alt="Tugma Logo" className="w-[68px] h-[41px]" />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-10 pb-40 font-montserrat">
            <div className="flex flex-col gap-6">
              {job ? (
                <>
                  {/* Header */}
                  <div className="space-y-4">                      <div className="mb-4">
                      <span className="text-2xl font-bold text-[#FF8032]">{job?.applicantCount || Math.floor(Math.random() * 200) + 50} Applicants</span>
                      <h2 className="text-4xl font-bold mt-1 text-black">{job?.jobTitle || "Job Title"}</h2>

                      <div className="flex items-center">
                        <h3 className="text-xl font-semibold text-[#676767]">{job?.companyName || "Company Name"}</h3>
                        <i
                          className="bi bi-info-circle text-[19px] ml-2 cursor-pointer text-gray-500"
                          title="Company Information"
                        />
                      </div>

                      <p className="text-base text-[#676767]">{job?.location || "Job Location"}</p>
                    </div>
                    
                    {/* Salary - Generate dynamic salary based on job */}
                    <div className="flex items-center gap-2 mb-6">
                      <p className="text-2xl font-bold text-black">
                        ₱{job?.salaryMin || (Math.floor(Math.random() * 30) + 40)}K - ₱{job?.salaryMax || (Math.floor(Math.random() * 40) + 60)}K
                      </p>
                      <p className="text-base font-normal text-gray-500">{job?.salaryFrequency || "monthly"}</p>
                    </div>
                    
                    {/* Tags - Use actual job data */}
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 bg-[#FFE4B5] rounded text-sm font-semibold text-[#FF8032] flex items-center gap-1">
                        <i className="bi bi-geo-alt-fill text-[#FF8032]" />
                        {job?.type || "Remote"}
                      </span>
                      <span className="px-3 py-1 bg-[#FFE4B5] rounded text-sm font-semibold text-[#FF8032] flex items-center gap-1">
                        <i className="bi bi-briefcase-fill text-[#FF8032]" />
                        {job?.employment || "Contractual"}
                      </span>
                    </div>
                    </div>                  {/* Description */}
                  <div className="space-y-6">
                    <div className="gap-2">
                      <h4 className="text-base font-bold mb-3 text-black">Job Description</h4>
                      <p className="text-sm text-[#676767] leading-relaxed">
                        {job?.description || "No description available."}
                      </p>
                    </div>
                    
                    {/* Available Positions - Generate based on job or default */}
                    <p className="text-md text-[#676767] font-medium mb-6">
                      {job?.availablePositions 
                        ? (job.availablePositions === 1 
                            ? "1 available position" 
                            : `${job.availablePositions} available positions`)
                        : `${Math.floor(Math.random() * 5) + 1} available positions`
                      }
                    </p>
                    
                    {/* Tags - Generate skill tags based on job title */}
                    <div className="mb-8">
                      <h4 className="text-base font-bold mb-3 text-black">Tags</h4>
                      <div className="flex gap-2 flex-wrap mb-4">
                        {job?.tags && job.tags.length > 0 
                          ? job.tags.slice(0, 10).map((tag, index) => (
                              <span key={index} className="px-3 py-1 border-2 border-[#FF8032] text-[#FF8032] rounded text-sm font-semibold">
                                {tag}
                              </span>
                            ))
                          : (() => {
                              // Generate tags based on job title
                              const commonTags = ["Communication", "Problem Solving", "Team Work"];
                              const jobSpecificTags = [];
                              
                              if (job?.jobTitle?.toLowerCase().includes("developer") || job?.jobTitle?.toLowerCase().includes("engineer")) {
                                jobSpecificTags.push("JavaScript", "React", "Node.js", "Git", "API");
                              } else if (job?.jobTitle?.toLowerCase().includes("analyst")) {
                                jobSpecificTags.push("Excel", "SQL", "Data Analysis", "Python", "Statistics");
                              } else if (job?.jobTitle?.toLowerCase().includes("marketing")) {
                                jobSpecificTags.push("SEO", "Content Creation", "Social Media", "Analytics", "Campaigns");
                              } else if (job?.jobTitle?.toLowerCase().includes("design")) {
                                jobSpecificTags.push("Adobe Creative Suite", "UI/UX", "Figma", "Wireframing", "Prototyping");
                              } else {
                                jobSpecificTags.push("Microsoft Office", "Customer Service", "Project Management", "Documentation");
                              }
                              
                              const allTags = [...jobSpecificTags, ...commonTags];
                              return allTags.slice(0, 8).map((tag, index) => (
                                <span key={index} className="px-3 py-1 border-2 border-[#FF8032] text-[#FF8032] rounded text-sm font-semibold">
                                  {tag}
                                </span>
                              ));
                            })()
                        }
                        <span className="px-3 py-1 bg-[#FF8032] text-white rounded text-sm font-semibold">
                          +5 More
                        </span>
                      </div>
                    </div>
                    
                    {/* Edit Button */}
                    <div className="w-full flex justify-center pt-6">
                      <button
                        className="w-[300px] bg-[#FF8032] text-white font-bold py-4 rounded-[10px] hover:bg-[#e6722d] transition-colors text-lg"
                        onClick={onEdit}
                      >
                        Edit Job Listing
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Select a job to view details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
