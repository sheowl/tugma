import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from '../components/JobCard.jsx';
import EmployerSideBar from "../components/EmployerSideBar";
import SearchBar from "../components/SearchBar";
import JobNewPost from "../components/JobNewPost";
import JobEditPost from "../components/JobEditPost";
import Dropdown from "../components/Dropdown";
import EmployerPostingDetails from "../components/EmployerPostingDetails";
import { exampleJobPosts } from "../context/jobPostsData";
import { useJobs } from "../context/JobsContext"; // This should work now
import CompanyService from "../services/CompanyService";

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
  const { 
    jobs: jobPosts, 
    loading, 
    error, 
    createJob, 
    fetchJobs, 
    clearError 
  } = useJobs();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0].value);
  const [selectedModality, setSelectedModality] = useState(null);
  const [selectedWorkType, setSelectedWorkType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [postingDetailsOpen, setPostingDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Add company profile state
  const [companyProfile, setCompanyProfile] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companyError, setCompanyError] = useState(null);

  // Fetch company profile
  const fetchCompanyProfile = async () => {
    try {
      setCompanyLoading(true);
      setCompanyError(null);
      const profile = await CompanyService.getProfile();
      setCompanyProfile(profile);
    } catch (error) {
      console.error('Error fetching company profile:', error);
      setCompanyError(error.message);
    } finally {
      setCompanyLoading(false);
    }
  };

  // Fetch jobs for current company
  const refreshCompanyJobs = async () => {
    try {
      // Use the existing fetchJobs from context
      if (companyProfile?.company_id) {
        await fetchJobs(companyProfile.company_id);
      } else {
        await fetchJobs(2); // Default company ID
      }
    } catch (error) {
      console.error('Error fetching company jobs:', error);
    }
  };

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Jobs error:', error);
    }
    if (companyError) {
      console.error('Company profile error:', companyError);
    }
  }, [error, companyError]);

  // Fetch data on component mount
  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  // Fetch jobs when company profile is loaded
  useEffect(() => {
    if (companyProfile) {
      refreshCompanyJobs();
    }
  }, [companyProfile]);

  const handleAddJob = async (jobData) => {
    try {
      await createJob(jobData);
      setShowModal(false);
      // Refresh jobs after creation
      await refreshCompanyJobs();
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  const handleViewJobDetails = (jobData) => {
    setSelectedJob(jobData);
    setPostingDetailsOpen(true);
  };

  const handleEditJob = () => {
    setPostingDetailsOpen(false);
    console.log('Edit job clicked', completeJobData || jobData);
  };

  const handleViewApplicants = async () => {
    try {
      navigate('/employerapplicants', { 
        state: { 
          jobPosts: jobPosts
        } 
      });
    } catch (error) {
      console.error('Error navigating to applicants:', error);
    }
  };
  const handleDropdownToggle = (jobId) => {
    setOpenDropdownId(openDropdownId === jobId ? null : jobId);
  };
  const handleEditJobSave = (updatedJobData) => {
    console.log('Saving job with data:', updatedJobData);
    setJobPosts(prevJobs => 
      prevJobs.map(job => 
        job.id === jobToEdit.id ? updatedJobData : job
      )
    );
    setShowEditModal(false);
    setJobToEdit(null);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setJobToEdit(null);
  };const handleJobAction = (jobId, action) => {
    console.log(`Action ${action} for job ${jobId}`);
    
    setOpenDropdownId(null);
      if (action === 'edit') {
      // Handle edit action
      const jobData = jobPosts.find(job => job.id === jobId);
      if (jobData) {
        console.log('Opening job for editing:', jobData.jobTitle);
        setJobToEdit(jobData);
        setShowEditModal(true);
      }
    } else if (action === 'archive') {
      // Handle archive action
      console.log('Archiving job:', jobId);
      setJobPosts(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? { ...job, status: 'Archived' } : job
        )
      );
    } else if (action === 'restore') {
      // Handle restore action
      console.log('Restoring job:', jobId);
      setJobPosts(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? { ...job, status: 'Active' } : job
        )
      );
    } else if (action === 'delete') {
      // Handle delete action with confirmation
      const jobToDelete = jobPosts.find(job => job.id === jobId);
      console.log('Attempting to delete job:', jobToDelete?.jobTitle);
      
      const confirmDelete = window.confirm(
        `Are you sure you want to delete the job posting "${jobToDelete?.jobTitle}"? This action cannot be undone.`
      );
      
      if (confirmDelete) {
        console.log('User confirmed deletion, removing job:', jobId);
        setJobPosts(prevJobs => {
          const newJobs = prevJobs.filter(job => job.id !== jobId);
          console.log('Jobs after deletion:', newJobs.length, 'remaining');
          return newJobs;
        });
      } else {
        console.log('User cancelled deletion');
      }
    }
  };

  // Filter and sort logic
  const getFilteredAndSortedJobs = () => {
    let filtered = jobPosts;

    // Filter by modality
    if (selectedModality) {
      filtered = filtered.filter(job => 
        job.type?.toLowerCase() === selectedModality.toLowerCase()
      );
    }

    // Filter by work type
    if (selectedWorkType) {
      filtered = filtered.filter(job => 
        job.employment?.toLowerCase() === selectedWorkType.toLowerCase()
      );
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(job => 
        job.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (selectedSort) {
        case "az":
          return a.jobTitle.localeCompare(b.jobTitle);
        case "za":
          return b.jobTitle.localeCompare(a.jobTitle);
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    return sorted;
  };

  // Custom sort content
  const sortContent = (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-3">Sort by</h3>
      <div className="space-y-2">
        {sortOptions.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={option.value}
              name="sort"
              value={option.value}
              checked={selectedSort === option.value}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="mr-2"
            />
            <label htmlFor={option.value} className="text-sm">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  // Custom filter content
  const filterContent = (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-3">Filter by</h3>
      <div className="space-y-4">
        {filterOptions.map((group) => (
          <div key={group.group}>
            <h4 className="font-medium text-md mb-2">{group.group}</h4>
            <div className="space-y-2">
              {group.options.map((option) => {
                const isSelected = 
                  (group.group === "By Modality" && selectedModality === option.value) ||
                  (group.group === "By Work Type" && selectedWorkType === option.value) ||
                  (group.group === "By Status" && selectedStatus === option.value);
                
                return (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={option.value}
                      checked={isSelected}
                      onChange={(e) => {
                        if (group.group === "By Modality") {
                          setSelectedModality(e.target.checked ? option.value : null);
                        } else if (group.group === "By Work Type") {
                          setSelectedWorkType(e.target.checked ? option.value : null);
                        } else if (group.group === "By Status") {
                          setSelectedStatus(e.target.checked ? option.value : null);
                        }
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={option.value} className="text-sm">
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FF8032] flex items-start overflow-hidden">
      <EmployerSideBar companyProfile={companyProfile} />
      <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-2 sm:p-4 md:p-6 shadow-md w-full max-w-full">
        
        {/* Loading states */}
        {(loading || companyLoading) && (
          <div className="flex justify-center items-center py-8">
            <div className="text-[#FF8032] text-lg">
              {loading && "Loading jobs..."}
              {companyLoading && "Loading company profile..."}
            </div>
          </div>
        )}

        {/* Error states */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-[112px] mb-4">
            <strong className="font-bold">Jobs Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={clearError}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="sr-only">Dismiss</span>
              ×
            </button>
          </div>
        )}

        {companyError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-[112px] mb-4">
            <strong className="font-bold">Company Profile Error: </strong>
            <span className="block sm:inline">{companyError}</span>
            <button 
              onClick={() => setCompanyError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="sr-only">Dismiss</span>
              ×
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center p-4 pl-[112px] pr-[118px]">
          <div>
            <h1 className="text-[48px] font-bold text-[#FF8032] -mb-1 mt-8">Job Posts</h1>
            <p className="text-[22px] text-[#FF8032] font-semibold">
              Jobs Posted: <span className="italic">{getFilteredAndSortedJobs().length}</span>
              {jobPosts.length !== getFilteredAndSortedJobs().length && (
                <span> / {jobPosts.length}</span>
              )}
            </p>
          </div>
          
          {/* Right Section - Company Info */}
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#FF8032]/20 block"></span>
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-[#FF8032] font-bold text-[18px] leading-tight">
                  {companyProfile?.company_name || "Company Name"}
                </span>
                <span className="text-[#FF8032] italic text-[13px] leading-tight">
                  {companyProfile?.company_size || "Company/Business Type"}
                </span>
              </div>
            </div>
          </div>
        </div>

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
          {!loading && !companyLoading && getFilteredAndSortedJobs().length > 0 ? (
            getFilteredAndSortedJobs().map(job => (
              <JobCard
                key={job.id}
                id={job.id}
                jobTitle={job.jobTitle}
                companyName={companyProfile?.company_name || job.companyName}
                location={job.location}
                type={job.type}
                employment={job.employment}
                description={job.description}
                status={job.status}
                postedDaysAgo={job.postedDaysAgo}
                onViewDetails={handleViewJobDetails}
                onViewApplicants={handleViewApplicants}
                dropdownOpen={openDropdownId === job.id}
                onDropdownToggle={handleDropdownToggle}
                onAction={handleJobAction}
              />
            ))
          ) : !loading && !companyLoading ? (
            <div className="text-center text-[#6B7280] text-[16px] py-8">
              {jobPosts.length === 0 ? 'No job posts available.' : 'No job posts match the selected filters.'}
            </div>
          ) : null}
        </div>
        
        {/* Floating Add Button */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-[#FF8032] rounded-full shadow-lg flex items-center justify-center cursor-pointer transition hover:bg-[#ff984d] focus:outline-none z-50"
        >
          <span className="text-white text-[32px] leading-none" style={{ fontWeight: 200 }}>+</span>
        </button>
        
        {/* Job Creation Modal */}
        <JobNewPost
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleAddJob}
          companyProfile={companyProfile}
        />
        
        <JobEditPost
          open={showEditModal}
          onClose={handleEditModalClose}
          onSave={handleEditJobSave}
          jobData={jobToEdit}
        />
        
        {/* Employer Posting Details Drawer */}
        {/* Job Details Modal */}
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