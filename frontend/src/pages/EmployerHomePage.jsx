import React, { useState, useEffect } from "react";
import EmployerSideBar from "../components/EmployerSideBar";
import SearchBar from "../components/SearchBar";
import { Briefcase, FileText, CalendarArrowUp, Star, Eye } from "lucide-react";
import recentApplicants from "../context/recentApplicants";

const EmployerHomePage = () => {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Company Name',
    type: 'Company/Business Type',
    location: 'Company Location'
  });

  // Load company data when component mounts
  useEffect(() => {
    const savedCompanyData = localStorage.getItem('companyData');
    if (savedCompanyData) {
      const { companyData } = JSON.parse(savedCompanyData);
      setCompanyInfo({
        name: companyData.name || 'Company Name',
        type: companyData.type || 'Company/Business Type',
        location: companyData.location || 'Company Location'
      });
    }
  }, []);
  // Mock data for stats
  const stats = {
    activeJobs: 59,
    totalApplications: 317,
    pendingReviews: 18
  };  
  // Add state to control expanded/collapsed view
  const [showAllApplicants, setShowAllApplicants] = useState(false);
  // Get the 3 most recent applicants or all if expanded
  const getRecentApplicants = () => {
    const sorted = recentApplicants.sort((a, b) => b.appliedAt - a.appliedAt);
    return showAllApplicants ? sorted : sorted.slice(0, 3);
  };

  const getMatchColor = (percentage) => {
    let matchScoreColor = "bg-[#27AE60] text-[#FEFEFF] text-[12px] font-semibold";
    if (percentage < 50) {
      matchScoreColor = "bg-[#E74C3C] text-[#FEFEFF] text-[12px] font-semibold";
    } else if (percentage < 75) {
      matchScoreColor = "bg-[#F5B041] text-[#FEFEFF] text-[12px] font-semibold";
    }
    return matchScoreColor;
  };

  const getMatchText = (percentage) => {
    return `${percentage}% Match`;
  };

  return (
    <div className="min-h-screen bg-[#FF8032] flex items-start overflow-hidden">
      <EmployerSideBar />
      <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-2 sm:p-4 md:p-6 shadow-md w-full max-w-full">
        <div className="flex justify-between items-center p-4 pl-[112px] pr-[118px]">
            <h1 className="text-[48px] font-bold text-[#FF8032] -mb-1 mt-8">Dashboard</h1>
          {/* Right Section */}          
          <div className="flex items-center gap-3 mt-12">
            <span className="w-10 h-10 rounded-full bg-[#FF8032]/20 block"></span>
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-[#FF8032] font-bold text-[18px] leading-tight">{companyInfo.name}</span>
                <span className="text-[#FF8032] italic text-[13px] leading-tight">{companyInfo.type}</span>
                <span className="text-[#FF8032] text-[12px] leading-tight flex items-center gap-1">
                  <i className="bi bi-geo-alt-fill text-[#FF8032] text-[14px]"></i>
                  {companyInfo.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-[112px] mt-2 mb-2 flex gap-4 items-center">
          <div className="flex-1">
            <SearchBar
              mode="employer"
              onSearch={(query) => console.log("Employer Search:", query)}
            />
          </div>
        </div>          
        {/* Quick Stats */}
        <div className="mb-8 mt-8 px-[112px]">
          <h2 className="text-[24px] font-bold text-[#3C3B3B] mb-6">Quick Stats</h2>          
          <div className="grid grid-cols-3 gap-8">
            {/* Active Jobs */}
            <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-lg w-full h-[140px]">
              <div className="flex items-center justify-between">                
                <div>
                  <p className="text-[20px] text-[#6B7280] font-semibold -mb-2 mt-2">Active Jobs</p>
                  <p className="text-[36px] font-bold text-[#FF8032]">{stats.activeJobs}</p>
                </div>                 
                  <Briefcase className="text-[#FF8032]" size={70} strokeWidth={1.5} />
              </div>
            </div>

            {/* Total Applications */}
            <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-lg w-full h-[140px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[20px] text-[#6B7280] font-semibold -mb-2 mt-2">Total Applications</p>
                  <p className="text-[36px] font-bold text-[#FF8032]">{stats.totalApplications}</p>
                </div>                  
                  <FileText className="text-[#FF8032]" size={70} strokeWidth={1.5} />
              </div>
            </div>

            {/* Pending Reviews */}
            <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-lg w-full h-[140px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[20px] text-[#6B7280] font-semibold -mb-2 mt-2">Pending Reviews</p>
                  <p className="text-[36px] font-bold text-[#FF8032]">{stats.pendingReviews}</p>
                </div>                  
                  <CalendarArrowUp className="text-[#FF8032]" size={70} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>        
        {/* Recent Applicants */}
        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-sm mx-[112px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Star className="text-[#FF8032]" size={25} strokeWidth={2} />
              <h2 className="text-[24px] font-bold text-[#3C3B3B]">Recent Applicants</h2>
            </div>
            <button
              className="text-[#FF8032] hover:text-[#e6722d] font-semibold text-[16px] hover:underline transition-colors"
              onClick={() => setShowAllApplicants((prev) => !prev)}
            >
              {showAllApplicants ? 'Show Less' : 'View All'}
            </button>
          </div>          
          <div className="space-y-0">
            {getRecentApplicants().map((applicant, index) => (
              <div key={applicant.id} className="flex items-start gap-4 relative">                
              {/* Timeline */}
                <div className="flex flex-col items-center relative">
                  <div className={`w-[25px] h-[25px] rounded-full ${index === 0 ? 'bg-[#FF8032]' : 'bg-white border-2 border-[#FF8032]'} mt-6 relative z-10`}></div>
                  {index < getRecentApplicants().length - 1 && (
                    <div className="w-0.5 bg-[#FF8032] absolute top-[43px] bottom-[-102px] left-1/2 transform -translate-x-1/2"></div>
                  )}
                </div>
                {/* Content Card */}
                <div className="flex-1 bg-white border border-[#E5E7EB] rounded-[12px] p-4 mb-2 h-[100px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-[50px] h-[50px] bg-[#D1D5DB] rounded-full flex items-center justify-center">                        
                        <span className="text-[#6B7280] font-semibold text-[14px]">
                          {applicant.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      
                      {/* Details */}                      
                      <div>
                        <h3 className="text-[24x] font-bold text-[#000000]">{applicant.name}</h3>
                        <p className="text-[14px] font-semibold text-[#6B7280]">Applied to: {applicant.position}</p>
                        <p className="text-[12px] font-semibold text-[#6B7280]">{applicant.timeAgo}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">                      
                      <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${getMatchColor(applicant.matchPercentage)}`}>
                        {getMatchText(applicant.matchPercentage)}
                      </span>
                      <button className="flex items-center gap-2 px-4 py-2 border border-[#D1D5DB] rounded-[8px] text-[12px] text-[#3C3B3B] font-semibold hover:bg-[#F9FAFB] transition-colors">
                        <Eye className="text-[#3C3B3B]" size={20} strokeWidth={2} />
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerHomePage;
