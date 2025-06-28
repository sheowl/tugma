import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ⭐ ADD THIS
import { useCompany } from "../context/CompanyContext";
import { useTags } from "../context/TagsContext";
import EmployerSideBar from "../components/EmployerSideBar";
import EmployerApplicantHeader from "../components/EmployerApplicantHeader";
import EmpCard from "../components/EmpCard";
import ApplicationFullDetails from "../components/ApplicationFullDetails";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const EmployerApplicants = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // ⭐ USE AuthContext for authentication checks
  const { 
    isEmployer, 
    isAuthenticated, 
    user 
  } = useAuth();
  
  // Use CompanyContext for backend operations
  const { 
    getJobApplicants, 
    getCompanyProfile, 
    loading, 
    error, 
    clearError 
  } = useCompany();
  
  // Use TagsContext for dynamic tag display
  const { getTagNamesByIds, loading: tagsLoading } = useTags();
  
  const [applicants, setApplicants] = useState([]);
  const [sortBy, setSortBy] = useState('best');
  const [selectedJobNumber, setSelectedJobNumber] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  
  // Get job posts data from navigation state
  const jobPostsData = location.state?.jobPosts || [];
  const selectedJob = location.state?.selectedJob;
  const selectedJobId = location.state?.selectedJobId;

  // ⭐ STEP 1: Check authentication first
  useEffect(() => {
    checkAuthenticationAndLoadData();
  }, []);

  // ⭐ STEP 2: Load applicants when job changes (after auth is confirmed)
  useEffect(() => {
    if (authChecked && isAuthenticated() && isEmployer()) {
      loadApplicantsData();
    }
  }, [selectedJobNumber, authChecked]);

  const checkAuthenticationAndLoadData = async () => {
    try {
      setIsLoading(true);
      setFetchError("");
      clearError();

      // Check if user is authenticated and is an employer
      if (!isAuthenticated()) {
        navigate('/employer-sign-in');
        return;
      }

      if (!isEmployer()) {
        navigate('/employer-sign-in');
        return;
      }
      
      // Verify backend connection with company profile
      try {
        const profileResponse = await getCompanyProfile();
      } catch (profileError) {
        // Proceed even if backend connection has issues
      }
      
      setAuthChecked(true);
      
      // Initialize job selection
      await initializeJobSelection();
      
    } catch (error) {
      setFetchError("Authentication error. Please log in again.");
      navigate('/employer-sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeJobSelection = async () => {
    // If no job posts data is passed, redirect back to job posts page
    if (!jobPostsData || jobPostsData.length === 0) {
      navigate('/employerjobposts');
      return;
    }

    // Set the selected job if provided, otherwise default to first
    let jobIdToSelect = selectedJobNumber;
    
    // Priority order for job ID selection:
    if (selectedJobId && selectedJobNumber === null) {
      jobIdToSelect = selectedJobId;
      setSelectedJobNumber(selectedJobId);
    } else if (selectedJobNumber) {
      jobIdToSelect = selectedJobNumber;
    } else if (jobPostsData.length > 0) {
      jobIdToSelect = jobPostsData[0].id;
      setSelectedJobNumber(jobPostsData[0].id);
    }

    if (!jobIdToSelect) {
      setFetchError("No valid job ID found");
      return;
    }
  };

  const loadApplicantsData = async () => {
    try {
      setIsLoading(true);
      setFetchError("");
      clearError();

      if (!selectedJobNumber) {
        return;
      }

      // Fetch applicants from backend
      const response = await getJobApplicants(selectedJobNumber);

      // Transform backend applicants data to frontend format
      const transformedApplicants = (response.applicants || []).map((applicant, index) => {
        // Get tag names from tag IDs
        const tagNames = getTagNamesByIds(applicant.applicant_tags || []);
        
        return {
          id: applicant.applicant_id || `${selectedJobNumber}-${index}`,
          applicant_id: applicant.applicant_id, // ⭐ ADD THIS for ApplicationFullDetails
          jobNumber: selectedJobNumber,
          jobTitle: response.job_title || 'Job Post',
          matched: applicant.match_score || 0,
          isNew: new Date() - new Date(applicant.application_created_at) < 24 * 60 * 60 * 1000,
          candidateName: applicant.name || 'Unknown Applicant',
          role: 'Applicant',
          email: applicant.applicant_email || 'N/A',
          phoneNumber: applicant.phone_number || 'N/A',
          location: applicant.location || 'N/A',
          applicationCreatedAt: applicant.application_created_at,
          status: applicant.status || 'applied',
          skills: tagNames.slice(0, 3),
          moreSkillsCount: Math.max(0, tagNames.length - 3),
          appliedDaysAgo: calculateDaysAgo(applicant.application_created_at),
          applicantTags: applicant.applicant_tags || [],
          tagNames: tagNames,
          matchScore: applicant.match_score || 0
        };
      });

      setApplicants(transformedApplicants);
      
    } catch (error) {
      // Check if it's an auth error
      if (error.message.includes('Authentication') || error.message.includes('401')) {
        setFetchError("Session expired. Please log in again.");
        navigate('/employer-sign-in');
      } else {
        setFetchError(error.message || "Failed to load applicants. Please try again.");
      }
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
      return (b.matchScore || 0) - (a.matchScore || 0);
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
    setSelectedJobNumber(newJobId);
    setApplicants([]); // Clear current applicants while loading new ones
  };

  // ⭐ RETRY FUNCTION THAT INCLUDES AUTH CHECK
  const handleRetry = () => {
    setAuthChecked(false);
    checkAuthenticationAndLoadData();
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
              <div className="text-lg font-semibold text-gray-600 mt-4">
                {!authChecked ? 'Verifying authentication...' : 'Loading applicants...'}
              </div>
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
              
              {/* ⭐ DEBUG INFO */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-100 p-4 rounded mb-4 text-xs text-left max-w-md mx-auto">
                  <div><strong>Debug Info:</strong></div>
                  <div>Auth Checked: {authChecked ? '✅ Yes' : '❌ No'}</div>
                  <div>Is Authenticated: {isAuthenticated() ? '✅ Yes' : '❌ No'}</div>
                  <div>Is Employer: {isEmployer() ? '✅ Yes' : '❌ No'}</div>
                  <div>User: {user ? '✅ Present' : '❌ Missing'}</div>
                </div>
              )}
              
              <button 
                onClick={handleRetry}
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
          {isLoading || tagsLoading ? (
            <div className="text-center text-gray-600 w-full">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF8032] mx-auto mb-4"></div>
              <div>Loading applicants...</div>
            </div>
          ) : sortedApplicants.length > 0 ? (            
            sortedApplicants.map(applicant => (
              <EmpCard
                key={applicant.id}
                matched={applicant.matchScore}
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
                applicantTags={applicant.applicantTags}
                tagNames={applicant.tagNames}
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
          jobId={selectedJobNumber}
          jobData={selectedApplicant?.job}
          applicantTags={selectedApplicant.applicantTags} // <-- add this line
          tagNames={selectedApplicant.tagNames} // <-- optionally, if you want tag names
          onStatusUpdate={(applicantId, newStatus) => {
            setApplicants(prevApplicants => 
              prevApplicants.map(app => 
                app.id === applicantId 
                  ? { ...app, status: newStatus }
                  : app
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default EmployerApplicants;