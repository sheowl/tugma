import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import ApplicantSideBar from '../components/ApplicantSideBar';
import Card from '../components/Card';
import ApplicantDashLogo from '../assets/ApplicantDashLogo.svg';
import JobDetailsDrawer from '../components/JobDetailsDrawer';
import SearchBar from '../components/SearchBar';
import Dropdown from '../components/Dropdown';
import ApplicantNotification from '../components/ApplicantNotification';
import ApplicantHeader from '../components/ApplicantHeader'; // Add this import
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient'; // Add this import

function ApplicantBrowseJobs() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedModality, setSelectedModality] = useState(null);
    const [selectedWorkType, setSelectedWorkType] = useState(null);
    const [selectedSort, setSelectedSort] = useState("best"); // Change default to "best"
    const [sortedData, setSortedData] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    
    // Add these missing states for apply functionality
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    // Add this state with your other states
    const [sortTime, setSortTime] = useState("0.00 secs");

    const navigate = useNavigate();
    const { user, loading } = useAuth(); // Get user and loading from Auth context

    // Auth check: redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            navigate("/applicant-sign-in", { replace: true });
        }
    }, [user, loading, navigate]);

     const sampleData = [
  { title: "Some Job Here", company: "Company Name Here", status: "Accepted", timeAgo: "3 hours ago" },
  { title: "Junior Web Developer", company: "Kim Satrjt PH", status: "Rejected", timeAgo: "8 hours ago" },
  { title: "Job Title", company: "Company Name", status: "Waitlisted", timeAgo: "3 hours ago" },
  
];

// Replace the mock firstName fetch with real user data
useEffect(() => {
    const fetchUserDetails = async () => {
        if (!user) return;
        
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const accessToken = session?.access_token;
            
            if (!accessToken) return;

            // Fetch from your backend endpoint
            const res = await fetch("http://localhost:8000/api/v1/auth/me", {
                headers: { 
                    Authorization: `Bearer ${accessToken}` 
                },
            });
            
            if (res.ok) {
                const data = await res.json();
                // Get first name from either Supabase user metadata or database
                const firstName = data.supabase_user?.user_metadata?.first_name || 
                                data.database_user?.first_name || 
                                "User";
                setFirstName(firstName);
            } else {
                // Fallback to Supabase user metadata
                const firstName = user?.user_metadata?.first_name || "User";
                setFirstName(firstName);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            // Fallback to Supabase user metadata
            const firstName = user?.user_metadata?.first_name || "User";
            setFirstName(firstName);
        }
    };

    fetchUserDetails();
}, [user]);

    // Fetch jobs from backend
    useEffect(() => {
        const fetchJobs = async () => {
            setLoadingJobs(true);
            try {
                const res = await fetch("http://localhost:8000/api/v1/jobs/");
                const data = await res.json();
                setJobs(Array.isArray(data) ? data : []); // <-- Ensure jobs is always an array
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
                setJobs([]); // <-- Set to empty array on error
            } finally {
                setLoadingJobs(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = useMemo(() => {
        const startTime = performance.now(); // Start timing
        
        let filtered = [...jobs];

        // Apply modality filter
        if (selectedModality) {
            filtered = filtered.filter((job) => job.setting === selectedModality);
        }

        // Apply work type filter
        if (selectedWorkType) {
            filtered = filtered.filter((job) => job.work_type === selectedWorkType);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const searchTerm = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(job =>
                job.job_title.toLowerCase().includes(searchTerm) ||
                job.company_name.toLowerCase().includes(searchTerm)
            );
        }

        // Apply sorting
        if (selectedSort === "best") {
            filtered = filtered.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
        } else if (selectedSort === "recent") {
            filtered = filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        } else if (selectedSort === "oldest") {
            filtered = filtered.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
        }

        const endTime = performance.now(); // End timing
        const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds
        setSortTime(`${timeTaken} secs`);

        return filtered;
    }, [jobs, selectedModality, selectedWorkType, searchQuery, selectedSort]);

    const sortOptions = [
        { label: "Best Match", value: "best" },
        { label: "Most Recent", value: "recent" },
        { label: "Oldest First", value: "oldest" },
      ];

      const filterOptions = [
        { label: "On-Site", value: "on-site" },
        { label: "Hybrid", value: "hybrid" },
        { label: "Remote", value: "remote" },
      ];
  
      const statusOptions = [
        { label: "Full-Time", value: "full-time" },
        { label: "Contractual", value: "contractual" },
        { label: "Part-Time", value: "part-time" },
        { label: "Internship", value: "internship" },
      ];

// Add these handler functions before your useEffects
const handleApplyClick = () => {
    setShowConfirmModal(true);
};

const handleProceed = async () => {
    setShowConfirmModal(false);
    
    try {
        // Here you would make an API call to apply for the job
        // const response = await applyToJob(selectedJob.job_id);
        
        setShowSuccessModal(true);
    } catch (error) {
        console.error("Error applying to job:", error);
        // Handle error (maybe show error modal)
    }
};

const handleCancel = () => {
    setShowConfirmModal(false);
};

const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    setDrawerOpen(false); // Close the drawer after successful application
};

    return (
        <div className="min-h-screen bg-[#2A4D9B] flex items-start">
            {/* Sidebar */}
            <ApplicantSideBar />

            {/* Main Content */}
            <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-6 shadow-md font-montserrat">
                {/* Header */}
                <div className="flex justify-between w-full px-9 mb-0">
                    <div className="flex items-center gap-[15px] m-9">
                        <img
                            src={ApplicantDashLogo}
                            alt="Tugma Logo"
                            className="max-w-[136px] h-auto"
                        />
                        <div>
                            <div className="font-[Montserrat] text-4xl font-bold text-[#2A4D9B]">
                                Welcome Back, {firstName}!
                            </div>
                            <div className="font-semibold italic text-orange-400 text-xl">
                                Ready to make meets end?
                            </div>
                        </div>
                    </div>

                     <div className="flex items-center gap-4">
                        <i className="bi bi-person-circle text-4xl text-gray-400"></i>
                        <div className="leading-tight pl-3">
                            <div className="font-semibold text-black text-sm">{firstName}</div>
                        </div>
                       <i
                        className="bi bi-bell text-2xl text-[#2A4D9B] ml-6 cursor-pointer position-relative"
                        onClick={() => setShowNotifications((prev) => !prev)}
                        ></i>

                    </div>
                </div>
                
                {showNotifications && (
                    <div className="absolute top-[120px] right-[50px] z-50">
                        <ApplicantNotification
                        open={showNotifications}
                        onClose={() => setShowNotifications(false)}
                        notification={sampleData}
                        onViewDetails={(notif) => {
                            console.log("View notif details:", notif);
                            setShowNotifications(false);
                        }}
                        />
                    </div>
                    )}
                

                {/* Search Bar and Dropdowns */}
                <div className="px-[112px] mt-0 mb-5 flex justify-between items-center">
                    <SearchBar 
                        onSearch={(query) => {
                            setSearchQuery(query);
                            console.log("Applicant Search:", query);
                        }}
                        value={searchQuery}
                        onChange={(query) => setSearchQuery(query)}
                    />
                </div>

                {/* Job Count */}
                <div className="pl-[112px] pr-[118px]">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-2">
                            <div className="text-base font-semibold text-gray-500 mb-2">
                                {filteredJobs.length} matches displayed
                            </div>
                            <div className="text-base italic text-gray-500 mb-2">({sortTime})</div>
                        </div>
                        
                        {/* Add the missing dropdowns here */}
                        <div className="flex gap-4">
                            {/* Sort By Dropdown */}
                            <Dropdown
                                label="Sort by"
                                customContent={
                                    <div className="flex flex-col">
                                        {sortOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                className={`p-2 cursor-pointer rounded transition-colors text-[14px] font-opensans ${
                                                    selectedSort === option.value
                                                        ? "bg-[#2A4D9B] text-white"
                                                        : ""
                                                }`}
                                                onClick={() => setSelectedSort(option.value)}
                                            >
                                                {option.label}
                                            </div>
                                        ))}
                                    </div>
                                }
                                width="w-40"
                                color="#2A4D9B"
                            />
                            
                            {/* Filter By Dropdown */}
                            <Dropdown
                                label="Filter by"
                                customContent={
                                    <div className="p-4 w-80 text-[14px] font-semibold grid grid-cols-2 gap-2">
                                        <div className="flex flex-col gap-6 items-start">
                                            <div className="font-semibold text-[#6B7280] mb-1 mt-2">
                                                By Modality
                                            </div>
                                            <div className="h-12" />
                                            <div className="font-semibold text-[#6B7280] mb-1">
                                                By Work Type
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 justify-start items-start">
                                            {/* Modality Filter Options */}
                                            {filterOptions.map((opt) => (
                                                <div
                                                    key={opt.value}
                                                    className={`p-1 mt-1 rounded cursor-pointer transition-colors ${
                                                        selectedModality === opt.value
                                                            ? "bg-[#2A4D9B] text-white"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        setSelectedModality(
                                                            selectedModality === opt.value
                                                                ? null
                                                                : opt.value
                                                        )
                                                    }
                                                >
                                                    {opt.label}
                                                </div>
                                            ))}
                                            <div className="h-2" />
                                            
                                            {/* Work Type Filter Options */}
                                            {statusOptions.map((opt) => (
                                                <div
                                                    key={opt.value}
                                                    className={`p-1 rounded cursor-pointer transition-colors ${
                                                        selectedWorkType === opt.value
                                                            ? "bg-[#2A4D9B] text-white"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        setSelectedWorkType(
                                                            selectedWorkType === opt.value
                                                                ? null
                                                                : opt.value
                                                        )
                                                    }
                                                >
                                                    {opt.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                }
                                width="w-72"
                                color="#2A4D9B"
                            />
                        </div>
                    </div>
                    <hr className="border-t-2 border-[#000000]/20" />
                </div>

                {/* Job Cards */}
                <div className="pl-[112px] pr-[118px] mt-10 mb-10 flex flex-wrap gap-[33px] justify-center">
                    {loadingJobs ? (
                        <div>Loading jobs...</div>
                    ) : (
                        filteredJobs.map((job) => (
                            <Card
                                key={job.job_id || job.id}
                                jobTitle={job.job_title}
                                companyName={job.company_name}
                                location={job.location}
                                matchScore={job.match_score || 0}
                                workSetup={job.setting}
                                employmentType={job.work_type}
                                description={job.description}
                                salaryRangeLow={job.salary_min}
                                salaryRangeHigh={job.salary_max}
                                tags={job.tags || []}
                                onViewDetails={() => {
                                    setSelectedJob(job);
                                    setDrawerOpen(true);
                                }}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Job Details Drawer */}
            <JobDetailsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                job={selectedJob}
                onApply={handleApplyClick} // Use the proper handler
            />

            {/* Confirmation Modal */}
{showConfirmModal && (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-center">Are you sure you want to apply?</h2>
            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-[10px] hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button
                    onClick={handleProceed}
                    className="px-4 py-2 bg-[#2A4D9B] text-white rounded-[10px] font-semibold hover:bg-[#1e3c78]"
                >
                    Proceed
                </button>
            </div>
        </div>
    </div>
)}

{/* Success Modal */}
{showSuccessModal && (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-center">Application Successful!</h2>
            <p className="text-gray-600 mb-4">
                You have successfully applied for the job. Our team will review your application and get back to you soon.
            </p>
            <button
                onClick={handleCloseSuccess}
                className="px-4 py-2 bg-[#2A4D9B] text-white rounded-[10px] font-semibold hover:bg-[#1e3c78]"
            >
                Close
            </button>
        </div>
    </div>
)}
        </div>
    );
}

export default ApplicantBrowseJobs;
