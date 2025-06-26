import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCompany } from "../context/CompanyContext";
import EmployerSideBar from "../components/EmployerSideBar";
import EmployerApplicantHeader from "../components/EmployerApplicantHeader";
import EmpCard from "../components/EmpCard";
import ApplicationFullDetails from "../components/ApplicationFullDetails";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const EmployerApplicants = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use CompanyContext for backend operations
  const { getJobApplicants, loading, error, clearError } = useCompany();
  
  const [applicants, setApplicants] = useState([]);
  const [sortBy, setSortBy] = useState('best');
  const [selectedJobNumber, setSelectedJobNumber] = useState(null); // Start with null
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  
  // Get job posts data from navigation state
  const jobPostsData = location.state?.jobPosts || [];
  const selectedJob = location.state?.selectedJob;
  const selectedJobId = location.state?.selectedJobId;

  useEffect(() => {
    loadApplicantsData();
  }, [selectedJobNumber]);

  const loadApplicantsData = async () => {
    try {
      setIsLoading(true);
      setFetchError("");
      clearError();

      // If no job posts data is passed, redirect back to job posts page
      if (!jobPostsData || jobPostsData.length === 0) {
        navigate('/employerjobposts');
        return;
      }

      // Set the selected job if provided, otherwise default to first
      let jobIdToFetch = selectedJobNumber;
      
      // Priority order for job ID selection:
      // 1. selectedJobId from navigation (when coming from specific job)
      // 2. Current selectedJobNumber state
      // 3. First job in jobPostsData array
      if (selectedJobId && selectedJobNumber === null) {
        jobIdToFetch = selectedJobId;
        setSelectedJobNumber(selectedJobId);
        console.log(`🔍 EmployerApplicants: Using selectedJobId from navigation: ${selectedJobId}`);
      } else if (selectedJobNumber) {
        jobIdToFetch = selectedJobNumber;
        console.log(`🔍 EmployerApplicants: Using current selectedJobNumber: ${selectedJobNumber}`);
      } else if (jobPostsData.length > 0) {
        jobIdToFetch = jobPostsData[0].id;
        setSelectedJobNumber(jobPostsData[0].id);
        console.log(`🔍 EmployerApplicants: Using first job from jobPostsData: ${jobPostsData[0].id}`);
      }

      if (!jobIdToFetch) {
        setFetchError("No valid job ID found");
        return;
      }

      console.log(`🔍 EmployerApplicants: Final job ID to fetch: ${jobIdToFetch}`);

      // Fetch applicants from backend
      const response = await getJobApplicants(jobIdToFetch);
      
      console.log('📋 Applicants response:', response);

      // Transform backend applicants data to frontend format
      const transformedApplicants = (response.applicants || []).map((applicant, index) => ({
        id: applicant.applicant_id || `${jobIdToFetch}-${index}`,
        jobNumber: jobIdToFetch,
        jobTitle: response.job_title || 'Job Post',
        matched: Math.floor(Math.random() * 51) + 50, // Mock match score for now
        isNew: new Date() - new Date(applicant.application_created_at) < 24 * 60 * 60 * 1000, // New if applied within last 24 hours
        candidateName: applicant.name || 'Unknown Applicant',
        role: 'Applicant', // Default role since backend doesn't provide this yet
        email: applicant.email,
        phoneNumber: applicant.phone_number,
        location: applicant.location,
        applicationCreatedAt: applicant.application_created_at,
        status: applicant.status || 'pending',
        skills: [], // Mock skills since backend doesn't provide this yet
        moreSkillsCount: 0,
        appliedDaysAgo: calculateDaysAgo(applicant.application_created_at),
      }));

      setApplicants(transformedApplicants);
      
    } catch (error) {
      console.error("❌ Error loading applicants:", error);
      setFetchError(error.message || "Failed to load applicants. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate days ago
  const calculateDaysAgo = (createdAt) => {
    if (!createdAt) return 0;
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

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
    }
    return 0;
  });

  const handleDropdownToggle = (applicantId) => {
    setOpenDropdownId(openDropdownId === applicantId ? null : applicantId);
  };

  const handleViewFullApplicant = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicationDetails(true);
  };

  const handleJobChange = (newJobId) => {
    console.log(`🔍 EmployerApplicants: Changing job to ID: ${newJobId}`);
    setSelectedJobNumber(newJobId);
    setApplicants([]); // Clear current applicants while loading new ones
  };

  // Loading state
  if (isLoading && applicants.length === 0) {
    return (
      <div className="min-h-screen bg-[#FF8032] flex items-start overflow-hidden">
        <EmployerSideBar />
        <div className="flex-1 h-screen bg-[#FEFEFF] rounded-tl-[40px] overflow-y-auto p-2 sm:p-4 md:p-6 shadow-md w-full max-w-full">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF8032] mx-auto"></div>
              <div className="text-lg font-semibold text-gray-600 mt-4">Loading applicants...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError || error) {
    return (
      <div className="min-h-screen bg-[#FF8032] flex items-start overflow-hidden">
        <EmployerSideBar />
        <div className="flex-1 h-screen bg-[#FEFEFF] rounded-tl-[40px] overflow-y-auto p-2 sm:p-4 md:p-6 shadow-md w-full max-w-full">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-500">
              <div className="text-lg font-semibold mb-4">Error Loading Applicants</div>
              <div className="mb-4">{fetchError || error}</div>
              <button 
                onClick={() => loadApplicantsData()}
                className="bg-[#FF8032] text-white px-6 py-2 rounded-lg hover:bg-[#E66F24] transition"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          jobNumbers={jobNumbers}
          onJobChange={handleJobChange}
        />
        <div className="pl-[112px] pr-[118px] mt-10 mb-10 flex flex-wrap gap-[33px] justify-center">
          {isLoading ? (
            <div className="text-center text-gray-600 w-full">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF8032] mx-auto mb-4"></div>
              <div>Loading applicants...</div>
            </div>
          ) : sortedApplicants.length > 0 ? (            
            sortedApplicants.map(applicant => (
              <EmpCard
                key={applicant.id}
                matched={applicant.matched}
                isNew={applicant.isNew}
                candidateName={applicant.candidateName}
                role={applicant.role}
                email={applicant.email}
                phoneNumber={applicant.phoneNumber}
                location={applicant.location}
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
            <div className="text-center text-gray-600 w-full py-16">
              <div className="text-lg font-semibold mb-2">No applicants found</div>
              <div>This job hasn't received any applications yet.</div>
            </div>
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