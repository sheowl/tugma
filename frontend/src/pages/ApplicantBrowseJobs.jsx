import React, { useState, useEffect } from 'react';
import ApplicantSideBar from '../components/ApplicantSideBar';
import Card from '../components/Card';
import JobDetailsDrawer from '../components/JobDetailsDrawer';
import SearchBar from '../components/SearchBar';
import Dropdown from '../components/Dropdown';
import ApplicantHeader from '../components/ApplicantHeader';
import { supabase } from "../services/supabaseClient";

const sortOptions = [
    { label: "Ascending Match Score", value: "ascending" },
    { label: "Descending Match Score", value: "descending" },
];

const filterOptions = [
    { label: "On-site", value: "On-site" },
    { label: "Hybrid", value: "Hybrid" },
    { label: "Remote", value: "Remote" },
];

const statusOptions = [
    { label: "Full-Time", value: "Full-time" },
    { label: "Contractual", value: "Contractual" },
    { label: "Part-Time", value: "Part-Time" },
    { label: "Internship", value: "Internship" },
];


function ApplicantBrowseJobs() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedSort, setSelectedSort] = useState("descending"); // Default sort option set to descending
    const [sortedData, setSortedData] = useState([]); // State for sorted job data
    const [selectedModality, setSelectedModality] = useState(null); // State for modality filter
    const [selectedWorkType, setSelectedWorkType] = useState(null); // State for work type filter
    const [firstName, setFirstName] = useState("User"); // State for user's first name
    const [showNotifications, setShowNotifications] = useState(false);
    

     const sampleData = [
  { title: "Some Job Here", company: "Company Name Here", status: "Accepted", timeAgo: "3 hours ago" },
  { title: "Junior Web Developer", company: "Kim Satrjt PH", status: "Rejected", timeAgo: "8 hours ago" },
  { title: "Job Title", company: "Company Name", status: "Waitlisted", timeAgo: "3 hours ago" },
  
];

    // Simulate fetching first name from a database
    useEffect(() => {
        const fetchFirstName = async () => {
            // Simulate a delay for fetching data
            setTimeout(() => {
                setFirstName("Julianna Leila"); // Mock name
            }, 1000);
        };

        fetchFirstName();
    }, []);

    // Sync applicant data with the server
    useEffect(() => {
        const syncApplicant = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;
            const accessToken = session?.access_token;

            if (user && accessToken) {
                await fetch("http://localhost:8000/api/v1/auth/applicant/oauth-register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        email: user.email,
                        first_name: user.user_metadata?.full_name?.split(" ")[0] || "",
                        last_name: user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
                    }),
                });
            }
        };
        syncApplicant();
    }, []);

    // Sort and filter the data whenever filters or sort options change
    useEffect(() => {
        let filtered = [...jobs];

        // Apply modality filter
        if (selectedModality) {
            filtered = filtered.filter((job) => job.type === selectedModality);
        }

        // Apply work type filter
        if (selectedWorkType) {
            filtered = filtered.filter((job) => job.employment === selectedWorkType);
        }

        // Apply sorting
        const sorted = filtered.sort((a, b) => {
            if (selectedSort === "ascending") {
                return (a.matchScore || 0) - (b.matchScore || 0);
            } else if (selectedSort === "descending") {
                return (b.matchScore || 0) - (a.matchScore || 0);
            }
            return 0;
        });

        setSortedData(sorted);
    }, [jobs, selectedSort, selectedModality, selectedWorkType]);

    if (loading) return <div className="p-8">Loading jobs...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-[#2A4D9B] flex items-start">
            {/* Sidebar */}
            <ApplicantSideBar />

            {/* Main Content */}
            <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-6 shadow-md font-montserrat">
                {/* Header */}
                <ApplicantHeader
                title={`Welcome Back, ${firstName}!`}
                subtitle="Ready to make meets end?"
                firstName={firstName}
                showProfile={true}
                />

                {/* Job Count */}
                <div className="pl-[112px] pr-[118px]">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-base font-semibold text-gray-500 mb-2">
                            {sortedData.length} matches displayed
                        </div>
                        <div className="flex gap-4">
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
                    {sortedData.map((job) => (
                        <Card
                            key={job.id}
                            jobTitle={job.jobTitle}
                            companyName={job.companyName}
                            location={job.location}
                            matchScore={job.matchScore}
                            workSetup={job.workSetup}
                            employmentType={job.employmentType}
                            description={job.description}
                            salaryRangeLow={job.salaryRangeLow}
                            salaryRangeHigh={job.salaryRangeHigh}
                            tags={job.tags}
                            onViewDetails={() => {
                                setSelectedJob(job);
                                setDrawerOpen(true);
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Job Details Drawer */}
            <JobDetailsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                job={selectedJob}
                onApply={handleApplyClick}
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
            <h2 className="text-lg font-semibold mb-2">Application Sent!</h2>
            <p className="text-sm text-gray-600 mb-4">
                Your resume has been sent over to the employer.
            </p>
            <button
                onClick={handleCloseSuccess}
                className="px-4 py-2 bg-[#2A4D9B] text-white rounded hover:bg-[#1e3c78]"
            >
                OK
            </button>
            </div>
        </div>
        )}

        </div>

        
    );
}

export default ApplicantBrowseJobs;