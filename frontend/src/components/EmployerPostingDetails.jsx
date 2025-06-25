import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActiveSaveIcon from "../assets/ActiveSaveIcon.svg";
import CompanyDetails from "./CompanyDetails";
import { companyData } from "../context/companyData";
// Import the mapping utilities
import { getCategoryName, getProficiencyLevel, getWorkSetting, getWorkType } from "../utils/jobMappings";

export default function EmployerPostingDetails({ open, onClose, job, onEdit }) {
  const navigate = useNavigate();
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);

  const handleCompanyDetailsClick = () => {
    setShowCompanyDetails(true);
  };

  const handleCloseCompanyDetails = () => {
    setShowCompanyDetails(false);
  };

  const currentCompany = job ? companyData[job.companyName] : null;  
  
  // Use real job data directly - NO MORE MOCK DATA MERGING
  const fullJobData = job;

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

          <div className="flex-1 overflow-y-auto px-10 pb-10 font-montserrat">            
            <div className="flex flex-col gap-6">
              {fullJobData ? (
                <>
                  {/* Header */}
                  <div className="space-y-4 ml-8">                      
                    <div className="mb-4 mt-8">                      
                      <span className="text-[24px] font-bold text-[#FF8032]">{fullJobData?.applicantCount || 0} Applicants</span>
                      <h2 className="text-[40px] font-bold mt-1 text-black">{fullJobData?.jobTitle || "Job Title"}</h2>                      
                      <div className="flex items-center">
                        <h3 className="text-[20px] font-bold text-[#6B7280]">{fullJobData?.companyName || "Company Name"}</h3>
                        <i
                          className="bi bi-info-circle text-[19px] ml-2 cursor-pointer text-gray-500 hover:text-[#FF8032] transition-colors"
                          title="Company Information"
                          onClick={handleCompanyDetailsClick}
                        />
                      </div>

                      <p className="text-[16px] font-semibold text-[#6B7280]">{fullJobData?.location || "Job Location"}</p>
                    </div>
                      {/* Salary - Use real data */}
                    <div className="flex items-center gap-2 mb-8">                        
                      <p className="text-[29px] font-bold text-[#262424]">
                        {fullJobData?.salaryRange || 
                         (fullJobData?.salaryMin && fullJobData?.salaryMax 
                          ? `₱${fullJobData.salaryMin} - ₱${fullJobData.salaryMax}`
                          : "Salary not specified"
                        )}
                      </p>
                      {(fullJobData?.salaryMin && fullJobData?.salaryMax) && (
                        <p className="text-[16px] text-[#6B7280]">monthly</p>
                      )}
                    </div>
                    
                    {/* Tags - Use actual job data with proper formatting */}
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 bg-[#FFEDD5] rounded text-[11px] font-semibold text-[#3C3B3B] flex items-center gap-1">
                        <i className="bi bi-geo-alt-fill text-[#FF8032]" />                        
                        {getWorkSetting(fullJobData?.type)}
                      </span>
                      <span className="px-3 py-1 bg-[#FFEDD5] rounded text-[11px] font-semibold text-[#3C3B3B] flex items-center gap-1">
                        <i className="bi bi-briefcase-fill text-[#FF8032]" />
                        {getWorkType(fullJobData?.employment)}
                      </span>
                    </div>
                    </div>         

                  {/* Description */}
                  <div className="space-y-6 ml-8">
                    <div className="gap-2">
                      <h4 className="text-[16px] font-semibold mb-3 text-[#3C3B3B]">Job Description</h4>
                      <p className="text-[12px] font-semibold text-[#676767] leading-relaxed">
                        {fullJobData?.description || "No description available."}
                      </p>
                    </div>
                    
                    {/* Available Positions - Use real data */}                    
                    <p className="text-[14px] text-[#3C3B3B] font-semibold mb-6">                      
                      {fullJobData?.availablePositions === 1 
                        ? "1 available position" 
                        : fullJobData?.availablePositions > 0
                        ? `${fullJobData?.availablePositions} available positions`
                        : "No positions available"
                      }
                    </p>
                    
                    {/* Category & Proficiency - Use real data with mapping */}
                    <div className="flex gap-16 mb-6">
                      <div className="flex flex-col">
                        <span className="text-[16px] font-semibold text-[#3C3B3B] mb-1">Category</span>
                        <span className="px-3 py-1 bg-[#FFF7ED] rounded text-[12px] font-semibold text-[#FF8032] border-2 border-[#FF8032] flex items-center gap-1">
                          <i className="bi bi-tag-fill text-[#FF8032]" />
                          {getCategoryName(fullJobData?.category)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[16px] font-semibold text-[#3C3B3B] mb-1">Proficiency</span>
                        <span className="px-3 py-1 bg-[#FFF7ED] rounded text-[12px] font-semibold text-[#FF8032] border-2 border-[#FF8032] flex items-center gap-1">
                          <i className="bi bi-bar-chart-fill text-[#FF8032]" />
                          {getProficiencyLevel(fullJobData?.proficiency)}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-8">
                      <h4 className="text-[16px] font-semibold mb-3 text-[#3C3B3B]">Tags</h4>
                      <div className="flex gap-2 flex-wrap mb-4">                        
                        {(() => {
                          if (!fullJobData?.tags || !Array.isArray(fullJobData.tags) || fullJobData.tags.length === 0) {
                            return <div className="text-gray-500 text-sm">No tags available</div>;
                          }
                          
                          const maxDisplayTags = 8;
                          const tagsToShow = fullJobData.tags.slice(0, maxDisplayTags);
                          const hasMoreTags = fullJobData.tags.length > maxDisplayTags;
                          
                          return (
                            <>
                              {tagsToShow.map((tag, index) => (
                                <span 
                                  key={index} 
                                  className="px-3 py-1 text-[#FF8032] border-2 border-[#FF8032] rounded-full text-[12px] font-semibold hover:bg-[#FF8032]/10 transition whitespace-nowrap"
                                >
                                  {tag}
                                </span>
                              ))}
                              {hasMoreTags && (
                                <span className="px-3 py-1 bg-[#FF8032] text-white rounded-full text-[12px] font-semibold whitespace-nowrap">
                                  +{fullJobData.tags.length - maxDisplayTags} More
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>                    

                    {/* Edit Button */}
                    <div className="w-full flex justify-center pt-6">
                      <button
                        className="w-[300px] h-[48px] bg-[#FF8032] text-white font-bold py-2 rounded-[10px] hover:bg-[#E66F24] transition-colors text-[16px]"
                        onClick={() => {
                          onEdit(fullJobData);
                          onClose();
                        }}
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
      {/* Company Details Modal */}
      <CompanyDetails 
        open={showCompanyDetails}
        onClose={handleCloseCompanyDetails}
        job={currentCompany}
        userType="employer"
      />
    </>
  );
}
