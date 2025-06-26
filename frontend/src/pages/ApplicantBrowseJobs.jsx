import React, { useState, useEffect } from 'react';
import ApplicantSideBar from '../components/ApplicantSideBar';
import Card from '../components/Card';
import ApplicantDashLogo from '../assets/ApplicantDashLogo.svg';
import JobDetailsDrawer from '../components/JobDetailsDrawer';
import SearchBar from '../components/SearchBar';
import Dropdown from '../components/Dropdown';
import ApplicantNotification from '../components/ApplicantNotification';
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
    const [selectedSort, setSelectedSort] = useState("descending");
    const [sortedData, setSortedData] = useState([]);
    const [selectedModality, setSelectedModality] = useState(null);
    const [selectedWorkType, setSelectedWorkType] = useState(null);
    const [firstName, setFirstName] = useState("User");
    const [showNotifications, setShowNotifications] = useState(false);

    // NEW: State for jobs, loading, error
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch jobs from backend on mount
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("http://localhost:8000/api/v1/jobs/");
                if (!res.ok) throw new Error("Failed to fetch jobs");
                const data = await res.json();
                // Map backend fields to frontend fields
                const mapped = data.map(job => ({
                    id: job.job_id,
                    jobTitle: job.job_title,
                    companyName: job.company_name,
                    location: job.location,
                    matchScore: job.match_score || 0,
                    workSetup: job.setting, // e.g. 'onsite', 'remote', 'hybrid'
                    employmentType: job.work_type, // e.g. 'fulltime', 'part-time'
                    description: job.description,
                    salaryRangeLow: job.salary_min,
                    salaryRangeHigh: job.salary_max,
                    tags: job.tags || [],
                    // add more fields as needed
                }));
                setJobs(mapped);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

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
                    <SearchBar onSearch={(query) => console.log("Applicant Search:", query)} />
                </div>

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
                onApply={() => alert("Applied!")}
            />
        </div>
    );
}

export default ApplicantBrowseJobs;