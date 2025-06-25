import React from "react";
import { useNavigate } from "react-router-dom";

const JobCard = (props) => {
  const {
    id,
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
    onViewDetails = () => {},
    onViewApplicants = () => {},
    dropdownOpen = false,
    onDropdownToggle = () => {} } = props;

  const navigate = useNavigate();

  const actionOptions = status === "Active" 
    ? [
        { label: "Edit", value: "edit" },
        { label: "Archive", value: "archive" },
        { label: "Delete", value: "delete" },
      ]
    : [
        { label: "Edit", value: "edit" },
        { label: "Restore", value: "restore" },
        { label: "Delete", value: "delete" },      
      ];

  const handleActionClick = () => {
    onDropdownToggle(id);
  };  const handleOptionClick = (option) => {
    console.log('Option clicked:', option, 'Job ID:', id);
    onDropdownToggle(id); 
    if (option && onAction) {
      console.log('Calling onAction with:', id, option.value);
      onAction(id, option.value);
    }
  };const handleViewApplicants = () => {
    const job = {
      id,
      jobTitle,
      companyName,
      location,
      type,
      employment,
      description,
      status,
      postedDaysAgo,
    };
    navigate('/employerapplicants', {
      state: {
        jobPosts: [job],
        selectedJob: job,
      },
    });
  };

  const handleViewPostingDetails = () => {
    const jobData = {
      jobTitle,
      companyName,
      location,
      type,
      employment,
      description,
      status,
      postedDaysAgo,
    };
    onViewDetails(jobData);  };
  
    status === "Archived"
      ? "text-[#FACC15]"      : "text-[#16A34A]";
  
  return (
    <div className={`bg-white border rounded-[20px] shadow-all-around p-6 flex relative w-full max-w-full h-[288px] hover:scale-101 transition-transform duration-300 ${dropdownOpen ? 'z-50' : 'z-10'}`}>      <div className="absolute top-12 right-12">
        <span className={`px-4 py-2 rounded-full text-[14px] w-[126px] h-[29px] font-semibold flex items-center justify-center ${
          status === "Active" 
            ? "bg-[#16A34A] text-white" 
            : "bg-[#FACC15] text-white"
        }`}>
          {status}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-start ml-8 mt-4">
        {/* Posted time */}
        <div className="text-[10px] text-[#6B7280]">
          {postedDaysAgo === 0 ? "1 minute ago" : `${postedDaysAgo} minute${postedDaysAgo > 1 ? 's' : ''} ago`}
        </div>
        <div className="font-bold text-[24px] text-[#262424] -mb-1">{jobTitle}</div>        
        <div className="text-[14px] font-bold text-[#6B7280]">{companyName}</div>        
        <div className="text-[12px] font-semibold text-[#6B7280] mb-2">{location}</div>
          {/* Tags */}
        <div className="flex gap-3 mb-4">
          <span className="w-[100px] h-[20px] bg-[#FFEDD5] text-[#3C3B3B] px-3 py-2 rounded text-[11px] font-semibold flex items-center gap-2">
            <i className="bi bi-geo-alt-fill text-[10px] text-[#FF8032]" /> {type}
          </span>
          <span className="w-[100px] h-[20px] bg-[#FFEDD5] text-[#3C3B3B] px-3 py-2 rounded text-[11px] font-semibold flex items-center gap-2">
            <i className="bi bi-briefcase-fill text-[10px] text-[#FF8032]" /> {employment}
          </span>
        </div>
        <div className="text-[#676767] text-[12px] mb-2 break-words max-w-[900px] whitespace-pre-line max-h-[40px] overflow-hidden text-ellipsis">
          {description.split(' ').slice(0, 36).join(' ')}{description.split(' ').length > 36 ? '...' : ''}
        </div>
        <div className="text-[#FF8032] text-[12px] font-semibold cursor-pointer hover:underline" onClick={handleViewPostingDetails}>View posting details</div>
      </div>      
      
      {/* Right side - Action buttons */}
      <div className="flex flex-col justify-end items-end ml-8 mr-8">
        <div className="flex gap-3">
          <div className="relative">
            <button 
              className="w-[100px] h-[32px] bg-transparent text-white px-4 py-3 rounded-lg text-[12px] text-[#FF8032] font-semibold border-2 border-[#FF8032] font-semibold hover:bg-[#FF8032] hover:text-white transition-colors flex items-center gap-2"
              onClick={handleActionClick}
              type="button"
            >
              {actionLabel} <i className="bi bi-caret-down-fill text-[16px]" />
            </button>            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow z-[100]">
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
            )}</div>          
            <button 
            className="w-[144px] h-[32px] bg-transparent text-white px-5 py-3 rounded-lg text-[12px] text-[#FF8032] font-semibold border-2 border-[#FF8032] font-semibold hover:bg-[#FF8032] hover:text-white transition-colors flex items-center gap-2"
            onClick={handleViewApplicants}
          >
            View Applicants
          </button>        
          </div>
      </div>
    </div>
  );
};

export default JobCard;