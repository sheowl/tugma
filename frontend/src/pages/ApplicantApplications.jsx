import ApplicantSideBar from '../components/ApplicantSideBar';
import ApplicantTracker from '../components/ApplicantTracker';
import SearchBar from '../components/SearchBar';
import Dropdown from '../components/Dropdown';
import ApplicantHeader from '../components/ApplicantHeader';
import ApplicantTrackerDrawer from '../components/ApplicantTrackerDrawer';
import { useState, useEffect } from 'react';


function ApplicantApplications() {
    const firstName = "Julianna Leila"; // Replace with actual user data
    const [selectedSort, setSelectedSort] = useState("descending"); // Default sort option set to descending
    const [sortedData, setSortedData] = useState([]); // State for sorted job data
    const [selectedModality, setSelectedModality] = useState(null); // State for modality filter
    const [selectedWorkType, setSelectedWorkType] = useState(null); // State for work type filter
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    // Example job applications data
    const jobApplications = [
        {
            jobTitle: "Software Engineer",
            companyName: "Tech Innovations Inc.",
            location: "San Francisco, CA",
            matchScore: 85,
            employmentType: "Full-time",
            workSetup: "Hybrid",
            description: "Join our dynamic team to develop cutting-edge software solutions.",
            salaryRangeLow: 40,
            salaryRangeHigh: 80,
            salaryFrequency: "Monthly",
            companyDescription: "Tech Innovations Inc. is a leading software development company focused on delivering innovative solutions to our clients. We value creativity, collaboration, and continuous learning.",
            status: "interview",
        },
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
    
        const sortOptions = [
            { label: "Ascending Match Score", value: "ascending" },
            { label: "Descending Match Score", value: "descending" },
        ];
    
        // Sort and filter the data whenever filters or sort options change
        useEffect(() => {
            let filtered = [...jobApplications]; // Start with the full job applications list
    
            // Apply modality filter
            if (selectedModality) {
                filtered = filtered.filter((job) => job.workSetup === selectedModality);
            }
    
            // Apply work type filter
            if (selectedWorkType) {
                filtered = filtered.filter((job) => job.employmentType === selectedWorkType);
            }
    
            // Apply sorting
            const sorted = filtered.sort((a, b) => {
                if (selectedSort === "ascending") {
                    return a.matchScore - b.matchScore; // Ascending order
                } else if (selectedSort === "descending") {
                    return b.matchScore - a.matchScore; // Descending order
                }
                return 0;
            });
    
            setSortedData(sorted); // Update the sorted and filtered data
        }, [selectedSort, selectedModality, selectedWorkType]);

    return (
        <div className="min-h-screen bg-[#2A4D9B] flex items-start overflow-hidden">
            <ApplicantSideBar />

            {/* Main Content Area */}
            <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-6 shadow-md">

                {/* Header */}
                <ApplicantHeader
                    title="Track Your Applications"
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

                {/* Job Applications */}
                <div className="pl-[112px] pr-[118px] mt-10 mb-10 flex flex-wrap gap-[33px] justify-center">
                    {sortedData.map((job, index) => (
                        <div key={index} className="flex items-center justify-between mb-2">
                            <ApplicantTracker
                                jobTitle={job.jobTitle}
                                companyName={job.companyName}
                                location={job.location}
                                matchScore={job.matchScore}
                                employmentType={job.employmentType}
                                workSetup={job.workSetup}
                                description={job.description}
                                salaryRangeLow={job.salaryRangeLow}
                                salaryRangeHigh={job.salaryRangeHigh}
                                salaryFrequency={job.salaryFrequency}
                                companyDescription={job.companyDescription}
                                onViewDetails={() => {
                                    setSelectedJob(job);
                                    setDrawerOpen(true);
                                }}
                                status={job.status}
                            />
                        </div>
                    ))}
                    </div>

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
