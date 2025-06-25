import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EmployerSideBar from "../components/EmployerSideBar";
import EmployerApplicantHeader from "../components/EmployerApplicantHeader";
import EmpCard from "../components/EmpCard";
import ApplicationFullDetails from "../components/ApplicationFullDetails";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const EmployerApplicants = () => {
  const location = useLocation();
  const navigate = useNavigate();  const [applicants, setApplicants] = useState([]);
  const [sortBy, setSortBy] = useState('best');
  const [selectedJobNumber, setSelectedJobNumber] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  
  // Get job posts data from navigation state or fallback to mock data
  const jobPostsData = location.state?.jobPosts || [];

  useEffect(() => {
    // If no job posts data is passed, redirect back to job posts page
    if (!jobPostsData || jobPostsData.length === 0) {
      navigate('/employerjobposts');
      return;
    }

    const generateApplicantsForJobs = () => {
      const candidatePool = [
        { name: "Juan Dela Cruz", role: "Software Engineer", skills: ["React", "Node.js", "CSS", "HTML", "JavaScript"] },
        { name: "Maria Santos", role: "Frontend Developer", skills: ["Vue.js", "Sass", "HTML", "JavaScript"] },
        { name: "Pedro Ramirez", role: "Backend Developer", skills: ["Python", "Django", "REST API", "PostgreSQL"] },
        { name: "Ana Garcia", role: "Data Analyst", skills: ["Python", "SQL", "Pandas", "Excel"] },
        { name: "Carlos Lopez", role: "Marketing Specialist", skills: ["SEO", "Google Ads", "Social Media", "Analytics"] },
        { name: "Isabella Rodriguez", role: "UI/UX Designer", skills: ["Figma", "Adobe XD", "Photoshop", "Sketch"] },
      ];

      const allApplicants = [];
      
      jobPostsData.forEach((job, index) => {
        // Generate 2-5 applicants per job
        const numApplicants = Math.floor(Math.random() * 4) + 2;
        
        for (let i = 0; i < numApplicants; i++) {
          const candidate = candidatePool[Math.floor(Math.random() * candidatePool.length)];
          allApplicants.push({
            id: `${job.id}-${i}`,
            jobNumber: job.id,
            jobTitle: job.jobTitle,
            matched: Math.floor(Math.random() * 51) + 50, // 50-100% match
            isNew: Math.random() > 0.5,
            candidateName: candidate.name,
            role: candidate.role,
            skills: candidate.skills,
            moreSkillsCount: Math.floor(Math.random() * 3),
            appliedDaysAgo: Math.floor(Math.random() * 10) + 1,
          });
        }
      });
      
      return allApplicants;
    };

    setApplicants(generateApplicantsForJobs());
    // Set the selected job if provided, otherwise default to first
    if (location.state?.selectedJob) {
      setSelectedJobNumber(location.state.selectedJob.id);
    } else if (jobPostsData.length > 0) {
      setSelectedJobNumber(jobPostsData[0].id);
    }
  }, [jobPostsData, navigate, location.state]);
  // Get available job IDs from the passed job posts data
  const jobNumbers = jobPostsData.map(job => job.id).sort((a, b) => a - b);
  const currentIndex = jobNumbers.indexOf(selectedJobNumber);
  
  // Get current job details
  const currentJob = jobPostsData.find(job => job.id === selectedJobNumber);

  // Filter applicants by selected job number
  const filteredApplicants = applicants.filter(app => app.jobNumber === selectedJobNumber);

  // Sort applicants based on sortBy
  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    if (sortBy === 'best') {
      return b.matched - a.matched;
    } else if (sortBy === 'recent') {
      return a.appliedDaysAgo - b.appliedDaysAgo;
    }    return 0;
  });
  const handleDropdownToggle = (applicantId) => {
    setOpenDropdownId(openDropdownId === applicantId ? null : applicantId);
  };

  const handleViewFullApplicant = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicationDetails(true);
  };

  return (
    <div className="min-h-screen bg-[#FF8032] flex items-start overflow-hidden">
      <EmployerSideBar />
      <div className="flex-1 h-screen bg-[#FEFEFF] rounded-tl-[40px] overflow-y-auto p-2 sm:p-4 md:p-6 shadow-md w-full max-w-full">        
        <EmployerApplicantHeader
          onSortChange={setSortBy}
          selectedSort={sortBy}
          jobPostNumber={selectedJobNumber}
          totalApplicants={filteredApplicants.length}
          jobTitle={currentJob?.jobTitle || 'Job Post'}
        />
        <div className="pl-[112px] pr-[118px] mt-10 mb-10 flex flex-wrap gap-[33px] justify-center">
          {sortedApplicants.length > 0 ? (            
            sortedApplicants.map(applicant => (
              <EmpCard
                key={applicant.id}
                matched={applicant.matched}
                isNew={applicant.isNew}
                candidateName={applicant.candidateName}
                role={applicant.role}
                skills={applicant.skills}
                moreSkillsCount={applicant.moreSkillsCount}
                appliedDaysAgo={applicant.appliedDaysAgo}
                actionLabel="Action"
                onAction={val => {}}
                dropdownOpen={openDropdownId === applicant.id}
                onDropdownToggle={() => handleDropdownToggle(applicant.id)}
                onViewFull={() => handleViewFullApplicant(applicant)}
              />
            ))
          ) : (
            <div>No applicants found.</div>
          )}
        </div>
      </div>
      
      {/* Application Full Details Modal */}
      {selectedApplicant && (
        <ApplicationFullDetails 
          open={showApplicationDetails}
          onClose={() => setShowApplicationDetails(false)}
          applicant={selectedApplicant}
        />
      )}
    </div>
  );
};

export default EmployerApplicants;