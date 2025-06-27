import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import ApplicantSideBar from '../components/ApplicantSideBar';
import ApplicantTracker from '../components/ApplicantTracker';
import SearchBar from '../components/SearchBar';
import Dropdown from '../components/Dropdown';
import ApplicantHeader from '../components/ApplicantHeader'; // Add this
import ApplicantTrackerDrawer from '../components/ApplicantTrackerDrawer'; // Add this
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";

const sortOptions = [
    { label: "Most Recent", value: "recent" },
    { label: "Oldest First", value: "oldest" },
    { label: "Best Match", value: "best" },
];

const filterOptions = [
  { label: "On-Site", value: "On-Site" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "Remote", value: "Remote" },
];

const statusOptions = [
  { label: "Full-Time", value: "Full-time" },
  { label: "Contractual", value: "Contractual" },
  { label: "Part-Time", value: "Part-Time" },
  { label: "Internship", value: "Internship" },
];

function ApplicantApplications() {
    const { user, loading } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [applications, setApplications] = useState([]);
    const [selectedSort, setSelectedSort] = useState("recent");
    const [selectedModality, setSelectedModality] = useState(null);
    const [selectedWorkType, setSelectedWorkType] = useState(null);
    
    // Add these missing states for drawer functionality
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    
    const navigate = useNavigate();

    // Example: Fetch applications from backend or mock data
    useEffect(() => {
      const fetchApplications = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const accessToken = session?.access_token;
          if (!accessToken) {
            navigate("/applicant-sign-in", { replace: true });
            return;
          }

          const res = await fetch("http://localhost:8000/api/v1/applicants/my-applications", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            throw new Error("Failed to fetch applications");
          }

          const data = await res.json();
          setApplications(data); // Adjust if your backend returns { applications: [...] }
        } catch (err) {
          console.error("Error fetching applications:", err);
          setApplications([]);
        }
      };

      fetchApplications();
    }, [navigate]);

    // Update filtering logic to match backend field names
    const filteredApplications = applications
        .filter(app => 
            (!searchQuery || app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()))
            && (!selectedModality || app.setting === selectedModality) // Use 'setting' instead of 'modality'
            && (!selectedWorkType || app.jobType === selectedWorkType) // Use 'jobType' instead of 'workType'
        )
        .sort((a, b) => {
            if (selectedSort === "recent") {
                return new Date(b.applicationCreatedAt || 0) - new Date(a.applicationCreatedAt || 0);
            } else if (selectedSort === "oldest") {
                return new Date(a.applicationCreatedAt || 0) - new Date(b.applicationCreatedAt || 0);
            } else if (selectedSort === "best") {
                return (b.matchScore || 0) - (a.matchScore || 0);
            }
            return 0;
        });

    useEffect(() => {
      if (user && user.user_metadata && user.user_metadata.first_name) {
        setFirstName(user.user_metadata.first_name);
      }
    }, [user]);

    useEffect(() => {
      if (!loading && !user) {
        navigate("/applicant-sign-in", { replace: true });
      }
    }, [user, loading, navigate]);

    return (
        <div className="min-h-screen bg-[#2A4D9B] flex items-start overflow-hidden">
            <ApplicantSideBar />

            {/* Main Content Area */}
            <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-6 shadow-md">
                {/* Use ApplicantHeader instead of manual header */}
                <ApplicantHeader
                    title="Track Your Applications"
                    subtitle="Ready to make meets end?"
                    firstName={firstName}
                    showProfile={true}
                    showSearchBar={true}
                />

                {/* Job Count section remains the same */}
                <div className="pl-[112px] pr-[118px]">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-base font-semibold text-gray-500 mb-2">
                            {filteredApplications.length} matches displayed
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

                {/* Job Applications */}
                <div className="pl-[112px] pr-[118px] mt-10 mb-10 flex flex-wrap gap-[33px] justify-center">
                    {filteredApplications.map((job, index) => (
                        <div key={index} className="flex items-center justify-between mb-2">
                            <ApplicantTracker
                                jobTitle={job.jobTitle}
                                companyName={job.companyName}
                                location={job.location}
                                matchScore={job.matchScore || 0}
                                employmentType={job.jobType}
                                workSetup={job.setting}
                                description={job.description}
                                salaryRangeLow={job.salaryRangeLow}
                                salaryRangeHigh={job.salaryRangeHigh}
                                salaryFrequency={job.salaryFrequency || "Monthly"}
                                companyDescription={job.companyDescription || ""}
                                onViewDetails={() => {
                                    setSelectedJob(job);
                                    setDrawerOpen(true);
                                }}
                                status={job.status}
                            />
                        </div>
                    ))}
                </div>

                {/* Add ApplicantTrackerDrawer */}
                <ApplicantTrackerDrawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    onViewDetails={(job) => {
                        setSelectedJob(job);
                        setDrawerOpen(true);
                    }}
                    job={selectedJob}
                />
            </div>
        </div>
    );
}

export default ApplicantApplications;
