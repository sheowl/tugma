import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/CompanyContext';
import { useNavigate } from "react-router-dom";
import JobCard from '../components/JobCard.jsx';
import EmployerSideBar from "../components/EmployerSideBar";
import SearchBar from "../components/SearchBar";
import JobNewPost from "../components/JobNewPost";
import JobEditPost from "../components/JobEditPost";
import Dropdown from "../components/Dropdown";
import EmployerPostingDetails from "../components/EmployerPostingDetails";

// --- Dropdown options for custom content ---
const sortOptions = [
  { label: "A - Z", value: "az" },
  { label: "Z - A", value: "za" },
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
];

const filterOptions = [
  {
    group: "By Modality",
    options: [
      { label: "On-site", value: "on-site" },
      { label: "Hybrid", value: "hybrid" },
      { label: "Remote", value: "remote" },
    ],
  },
  {
    group: "By Work Type",
    options: [
      { label: "Full-Time", value: "full-time" },
      { label: "Contractual", value: "contractual" },
      { label: "Part-Time", value: "part-time" },
      { label: "Internship", value: "internship" },
    ],
  },
  {
    group: "By Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Archived", value: "archived" },
    ],
  },
];

const EmployerJobPosts = () => {
  const navigate = useNavigate();
  
  // Local state
  const [jobPosts, setJobPosts] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Company Name',
    type: 'Company/Business Type',
    location: 'Company Location'
  });
  const [selectedSort, setSelectedSort] = useState(sortOptions[0].value);
  const [selectedModality, setSelectedModality] = useState(null);
  const [selectedWorkType, setSelectedWorkType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [postingDetailsOpen, setPostingDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Use AuthContext for authentication
  const { 
    isEmployer, 
    isAuthenticated, 
    user 
  } = useAuth();

  // Use CompanyContext for company operations
  const { 
    getCompanyJobs, 
    createJob, 
    updateJob, 
    deleteJob,
    getCompanyProfile,
    companyProfile,
    loading: companyLoading,
    error: companyError,
    clearError
  } = useCompany();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Check if user is authenticated and is an employer
      if (!isAuthenticated()) {
        navigate('/employer-sign-in');
        return;
      }

      if (!isEmployer()) {
        navigate('/employer-sign-in');
        return;
      }

      // Load jobs and company data
      await loadJobsAndCompanyData();
      
    } catch (error) {
      console.error("Error checking auth or loading data:", error);
      setError("Failed to load job posts. Please try again.");
      setIsLoading(false);
    }
  };

  const loadJobsAndCompanyData = async () => {
    try {
      setIsLoading(true);
      setError("");
      clearError(); // Clear any previous company errors

      // Load company jobs and profile in parallel
      const [jobsResponse, profileResponse] = await Promise.all([
        getCompanyJobs(),
        getCompanyProfile()
      ]);

      // Map backend attributes to frontend attributes
      const mapJobData = (job) => {
        // Helper function to format salary range for display only
        const formatSalary = (salary) => {
          if (!salary || salary < 1000) return "1K"; // Floor salary to 1000
          return `${Math.floor(salary / 1000)}K`; // Convert to "K" format
        };

        return {
          id: job.job_id, // Backend: job_id → Frontend: id
          jobTitle: job.job_title, // Backend: job_title → Frontend: jobTitle
          companyName: profileResponse.company_name || "Company Name", // Use company info
          location: profileResponse.location || "Location not specified", // Use company location
          type: job.setting, // Backend: setting → Frontend: type
          employment: job.work_type, // Backend: work_type → Frontend: employment
          description: job.description || "No description available",
          status: job.status || "Active",

          // Keep raw salary values for editing
          salaryMin: parseInt(job.salary_min, 10) || 0, // Keep as numbers for editing
          salaryMax: parseInt(job.salary_max, 10) || 0, // Keep as numbers for editing
          
          // Formatted salary for display
          salaryMinDisplay: formatSalary(parseInt(job.salary_min, 10)), 
          salaryMaxDisplay: formatSalary(parseInt(job.salary_max, 10)),
          salaryRange: `${formatSalary(parseInt(job.salary_min, 10))} - ${formatSalary(parseInt(job.salary_max, 10))}`, // Combined range for display

          // Position mapping
          availablePositions: parseInt(job.position_count, 10) || 0, // Parse position_count

          // Category and proficiency mapping
          category: parseInt(job.required_category_id, 10) || "Not specified", // Parse required_category_id
          proficiency: parseInt(job.required_proficiency, 10) || "Not specified", // Parse required_proficiency

          // Dates
          dateAdded: job.date_added,
          createdAt: job.created_at,
          postedDaysAgo: calculateDaysAgo(job.created_at),

          // Additional fields
          company_id: job.company_id,
        };
      };

      // Helper function to calculate days ago
      const calculateDaysAgo = (createdAt) => {
        if (!createdAt) return 0;
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      };

      // Update jobs data with mapping
      if (jobsResponse.jobs) {
        const mappedJobs = jobsResponse.jobs.map(mapJobData);
        setJobPosts(mappedJobs);
        setTotalJobs(jobsResponse.total || mappedJobs.length);
      } else if (Array.isArray(jobsResponse)) {
        const mappedJobs = jobsResponse.map(mapJobData);
        setJobPosts(mappedJobs);
        setTotalJobs(mappedJobs.length);
      }

      // Update company info
      setCompanyInfo({
        name: profileResponse.company_name || 'Company Name',
        type: formatCompanyType(profileResponse.company_size) || 'Company Type',
        location: profileResponse.location || 'Company Location',
    });

    } catch (error) {
      console.error("Error loading jobs and company data:", error);
      setError(error.message || "Failed to load job posts. Please try refreshing the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCompanyType = (companySize) => {
    if (!companySize) return "Company";
    
    // Map backend enum values to display text
    const sizeMapping = {
      'Me': 'Solo Entrepreneur',
      'Micro': 'Micro Company',
      'Small': 'Small Company', 
      'Medium': 'Medium Company',
      'Large': 'Large Company'
    };
    
    return sizeMapping[companySize] || `${companySize} Company`;
  };

  const handleAddJob = async (jobData) => {
    try {
      setError("");
      clearError();

      console.log('Creating new job:', jobData);
      
      // Create job using CompanyContext
      const newJob = await createJob(jobData);
      
      console.log('Job created successfully:', newJob);
      
      // Close modal
      setShowModal(false);
      
      // Reload jobs to get updated list
      await loadJobsAndCompanyData();
      
    } catch (error) {
      console.error("Error creating job:", error);
      setError(error.message || "Failed to create job. Please try again.");
    }
  };

  const handleViewJobDetails = (jobData) => {
    setSelectedJob(jobData);
    setPostingDetailsOpen(true);
  };  
  
  const handleEditJob = (jobData) => {
    console.log('Editing job:', jobData); // Debug log
    setJobToEdit(jobData); // Set both for consistency
    setSelectedJob(jobData); // Pass the complete job object
    setShowEditModal(true);
  };

  const handleEditJobSave = async (updatedJobData) => {
    try {
      setError("");
      clearError();

      // Use selectedJob instead of jobToEdit, and add null check
      if (!selectedJob || !selectedJob.id) {
        console.error('No job selected for editing:', selectedJob);
        setError("No job selected for editing");
        return;
      }

      console.log('Updating job with ID:', selectedJob.id);
      console.log('Update data:', updatedJobData);
      
      // Update job using CompanyContext
      const updatedJob = await updateJob(selectedJob.id, updatedJobData);
      
      console.log('Job updated successfully:', updatedJob);
      
      // Close modal and clear edit data FIRST
      setShowEditModal(false);
      setJobToEdit(null);
      setSelectedJob(null);
      
      // THEN reload jobs after a small delay to prevent interference
      setTimeout(async () => {
        try {
          await loadJobsAndCompanyData();
          console.log('Job list refreshed after update');
        } catch (error) {
          console.error('Error refreshing job list:', error);
        }
      }, 100);
      
    } catch (error) {
      console.error("Error updating job:", error);
      setError(error.message || "Failed to update job. Please try again.");
    }
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setJobToEdit(null);
    setSelectedJob(null); // Also clear selectedJob
  };

  const handleViewApplicants = () => {
    navigate('/employerapplicants', { 
      state: { 
        jobPosts: jobPosts 
      } 
    });
  };

  const handleDropdownToggle = (jobId) => {
    setOpenDropdownId(openDropdownId === jobId ? null : jobId);
  };

  const handleJobAction = (jobData, action) => {
    console.log('Job action:', action, 'Job data:', jobData);
    
    switch (action) {
      case 'edit':
        handleEditJob(jobData); // Pass complete job data
        break;
      case 'archive':
        handleArchiveJob(jobData.id);
        break;
      case 'delete':
        handleDeleteJob(jobData.id);
        break;
      case 'restore':
        handleRestoreJob(jobData.id);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const getFilteredAndSortedJobs = () => {
    let filteredJobs = jobPosts;

    // Apply filters
    if (selectedModality) {
      filteredJobs = filteredJobs.filter(job => {
        const jobType = job.type?.toLowerCase() || job.modality?.toLowerCase();
        return jobType === selectedModality || 
               (selectedModality === 'on-site' && jobType === 'on-site') ||
               (selectedModality === 'hybrid' && jobType === 'hybrid') ||
               (selectedModality === 'remote' && jobType === 'remote');
      });
    }

    if (selectedWorkType) {
      filteredJobs = filteredJobs.filter(job => {
        const jobEmployment = job.employment?.toLowerCase() || job.work_type?.toLowerCase();
        return jobEmployment === selectedWorkType ||
               (selectedWorkType === 'full-time' && jobEmployment === 'full-time') ||
               (selectedWorkType === 'part-time' && jobEmployment === 'part-time') ||
               (selectedWorkType === 'contractual' && jobEmployment === 'contractual') ||
               (selectedWorkType === 'internship' && jobEmployment === 'internship');
      });
    }

    if (selectedStatus) {
      filteredJobs = filteredJobs.filter(job => 
        job.status?.toLowerCase() === selectedStatus
      );
    }

    // Apply sorting
    const sortedJobs = [...filteredJobs].sort((a, b) => {
      switch (selectedSort) {
        case 'az':
          return (a.jobTitle || a.job_title || '').localeCompare(b.jobTitle || b.job_title || '');
        case 'za':
          return (b.jobTitle || b.job_title || '').localeCompare(a.jobTitle || a.job_title || '');
        case 'newest':
          return (a.postedDaysAgo || 0) - (b.postedDaysAgo || 0);
        case 'oldest':
          return (b.postedDaysAgo || 0) - (a.postedDaysAgo || 0);
        default:
          return 0;
      }
    });

    return sortedJobs;
  };

  const handleRetry = () => {
    setError("");
    clearError();
    loadJobsAndCompanyData();
  };

  // Loading state (combine both loading states)
  if (isLoading || companyLoading) {
    return (
      <div className="min-h-screen bg-[#FF8032] flex items-start overflow-hidden">
        <EmployerSideBar />
        <div className="flex-1 h-screen bg-[#FEFEFF] rounded-tl-[40px] overflow-y-auto p-6 shadow-md w-full max-w-full">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8032] mx-auto mb-4"></div>
              <p className="text-[#6B7280] text-lg">Loading job posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Combine errors from both sources
  const displayError = error || companyError;

  const sortContent = (
    <div className="flex flex-col">
      {sortOptions.map(opt => (
        <div
          key={opt.value}
          className={`p-2 cursor-pointer rounded transition-colors text-[14px] font-opensans ${
            selectedSort === opt.value ? "bg-[#FF8032] text-white" : ""
          }`}
          onClick={() => setSelectedSort(opt.value)}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );

  const selectedOptionStyle = { backgroundColor: "#FF80321A", color: "#FF8032" };

  const filterContent = (
    <div className="p-4 w-80 text-[14px] font-semibold grid grid-cols-2 gap-2">
      <div className="flex flex-col gap-24 items-start">
        <div className="font-semibold text-[#6B7280] mb-1 mt-2">By Modality</div>
        <div className="font-semibold text-[#6B7280] mb-1 mt-0">By Work Type</div>
        <div className="font-semibold text-[#6B7280] mb-1 mt-10">By Status</div>
      </div>
      <div className="flex flex-col gap-1 justify-start items-start">
        {/* By Modality */}
        {filterOptions[0].options.map(opt => (
          <div
            key={opt.value}
            className="p-1 mt-1 rounded cursor-pointer transition-colors"
            style={selectedModality === opt.value ? selectedOptionStyle : {}}
            data-selected={selectedModality === opt.value}
            onClick={() => setSelectedModality(selectedModality === opt.value ? null : opt.value)}
          >
            {opt.label}
          </div>
        ))}
        <div className="h-2" />
        {/* By Work Type */}
        {filterOptions[1].options.map(opt => (
          <div
            key={opt.value}
            className="p-1 mt-1 rounded cursor-pointer transition-colors"
            style={selectedWorkType === opt.value ? selectedOptionStyle : {}}
            data-selected={selectedWorkType === opt.value}
            onClick={() => setSelectedWorkType(selectedWorkType === opt.value ? null : opt.value)}
          >
            {opt.label}
          </div>
        ))}
        <div className="h-2" />
        {/* By Status */}
        {filterOptions[2].options.map(opt => (
          <div
            key={opt.value}
            className="p-1 mt-1 rounded cursor-pointer transition-colors"
            style={selectedStatus === opt.value ? selectedOptionStyle : {}}
            data-selected={selectedStatus === opt.value}
            onClick={() => setSelectedStatus(selectedStatus === opt.value ? null : opt.value)}
          >
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );

  // Show loading while company data is being fetched
  if (companyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#FF8032] font-semibold text-lg">
          Loading company data...
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 font-semibold text-lg text-center">
          Please log in to access this page.
        </div>
      </div>
    );
  }

  // Show error if company data failed to load
  if (companyError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 font-semibold text-lg text-center">
          Error loading company data: {companyError}
          <br />
          <button 
            onClick={() => getCompanyProfile()}
            className="mt-4 bg-[#FF8032] text-white px-4 py-2 rounded-lg hover:bg-[#E66F24] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Debug: Show what company profile contains
  console.log('Company profile in EmployerJobPosts:', companyProfile);

  return (
    <div className="min-h-screen bg-[#FF8032] flex items-start overflow-hidden">
      <EmployerSideBar />
      <div className="flex-1 h-screen bg-[#FEFEFF] rounded-tl-[40px] overflow-y-auto p-2 sm:p-4 md:p-6 shadow-md w-full max-w-full">
        
        {/* Header with company info */}
        <div className="flex justify-between items-center p-4 pl-[112px] pr-[118px]">
          <div>            
            <h1 className="text-[48px] font-bold text-[#FF8032] -mb-1 mt-8">Manage Postings</h1>
            <p className="text-[22px] text-[#FF8032] font-semibold">
              Jobs Posted: <span className="italic">{getFilteredAndSortedJobs().length}</span>
              {totalJobs !== getFilteredAndSortedJobs().length && (
                <span> / {totalJobs}</span>
              )}
            </p>
          </div>          
          
          {/* Company Info - Right Section */}           
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

        {/* Error Message */}
        {displayError && (
          <div className="mx-[112px] mb-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span>{displayError}</span>
                <button 
                  onClick={handleRetry}
                  className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="px-[112px] mt-2 mb-2 flex gap-4 items-center">
          <div className="flex-1">
            <SearchBar
              mode="employer"
              onSearch={(query) => console.log("Employer Search:", query)}
            />
          </div>
        </div>

        {/* Sort and Filter Dropdowns */}
        <div className="flex justify-end items-center px-[112px] pr-[118px] text-[16px] font-semibold gap-4 mt-8 -mb-8">
          <Dropdown
            label="Sort by"
            customContent={sortContent}
            width="w-40"
            color="#FF8032"
          />
          <Dropdown
            label="Filter by"
            customContent={filterContent}
            width="w-80"
            color="#FF8032"
          />
        </div>

        {/* Job Posts List */}
        <div className="pl-[112px] pr-[118px] mt-10 mb-10 flex flex-col gap-[20px]">
          {getFilteredAndSortedJobs().length > 0 ? (            
            getFilteredAndSortedJobs().map(job => (                
            <JobCard
                key={job.id}
                {...job} // Pass all job properties
                onViewDetails={handleViewJobDetails}
                onViewApplicants={handleViewApplicants}
                dropdownOpen={openDropdownId === job.id}
                onDropdownToggle={handleDropdownToggle}
                onAction={handleJobAction}
              />
            ))
          ) : (
            <div className="text-center text-[#6B7280] text-[16px] py-8">
              {jobPosts.length === 0 ? (
                <div>
                  <p className="mb-4">You haven't posted any jobs yet.</p>
                  <button 
                    onClick={() => setShowModal(true)}
                    className="px-6 py-2 bg-[#FF8032] text-white rounded-lg hover:bg-[#e6722d] transition-colors"
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                "No job posts match the selected filters."
              )}
            </div>
          )}
        </div>
        
        {/* Floating Add Button */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-[#FF8032] rounded-full shadow-lg flex items-center justify-center cursor-pointer transition hover:bg-[#ff984d] focus:outline-none z-50"
        >
          <span className="text-white text-[32px] leading-none" style={{ fontWeight: 200 }}>+</span>
        </button>

        {/* Modals and Drawers */}          
        <JobNewPost
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleAddJob}
          companyData={companyProfile} // Pass company data as prop
          userData={user} // Pass user data as prop
        />
        
        <JobEditPost
          open={showEditModal}
          onClose={handleEditModalClose}
          onSave={handleEditJobSave}
          jobData={selectedJob}
        />
        
        {/* Employer Posting Details Drawer */}
        <EmployerPostingDetails
          open={postingDetailsOpen}
          onClose={() => setPostingDetailsOpen(false)}
          job={selectedJob}
          onEdit={handleEditJob}
        />
      </div>
    </div>
  );
};

export default EmployerJobPosts;