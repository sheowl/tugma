import React from 'react';
import ApplicantSideBar from '../components/ApplicantSideBar';
import ApplicantTracker from '../components/ApplicantTracker';
import SearchBar from '../components/SearchBar';
import ApplicantDashLogo from '../assets/ApplicantDashLogo.svg';
import { useState, useEffect } from 'react';
import Dropdown from '../components/Dropdown';
import ApplicantNotification from '../components/ApplicantNotification';

function ApplicantApplications() {
    const firstName = "Julianna Leila"; // Replace with actual user data
    const [selectedSort, setSelectedSort] = useState("descending"); // Default sort option set to descending
    const [sortedData, setSortedData] = useState([]); // State for sorted job data
    const [selectedModality, setSelectedModality] = useState(null); // State for modality filter
    const [selectedWorkType, setSelectedWorkType] = useState(null); // State for work type filter
    const [showNotifications, setShowNotifications] = useState(false);


    const sampleData = [
  { title: "Some Job Here", company: "Company Name Here", status: "Accepted", timeAgo: "3 hours ago" },
  { title: "Junior Web Developer", company: "Kim Satrjt PH", status: "Rejected", timeAgo: "8 hours ago" },
  { title: "Job Title", company: "Company Name", status: "Waitlisted", timeAgo: "3 hours ago" },
  
];
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
            status: "rejected-after-interview", // or "interview", "accepted", etc.
        },
        {
            jobTitle: "Product Manager",
            companyName: "Innovatech Solutions",
            location: "New York, NY",
            matchScore: 90,
            employmentType: "Full-time",
            workSetup: "Remote",
            description: "Lead product development and strategy for innovative solutions.",
            salaryRangeLow: 50,
            salaryRangeHigh: 100,
            salaryFrequency: "Monthly",
            companyDescription: "Innovatech Solutions is a global leader in tech innovation, empowering businesses worldwide.",
            status: "interview",
        },
        {
            jobTitle: "UI/UX Designer",
            companyName: "Creative Minds Studio",
            location: "Austin, TX",
            matchScore: 75,
            employmentType: "Contract",
            workSetup: "On-site",
            description: "Design user-friendly interfaces for our cutting-edge applications.",
            salaryRangeLow: 30,
            salaryRangeHigh: 60,
            salaryFrequency: "Monthly",
            companyDescription: "Creative Minds Studio specializes in creating visually stunning and functional designs.",
            status: "applied",
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
                <div className="flex justify-between w-full px-9 mb-0">
                    <div className="flex items-center gap-[15px] m-9">
                        <img
                            src={ApplicantDashLogo}
                            alt="Tugma Logo"
                            className="max-w-[136px] h-auto"
                        />
                        <div>
                            <div className="font-[Montserrat] text-4xl font-bold text-[#2A4D9B]">
                                Track your applications
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

                {/* Job Applications */}
                <div className="pl-[112px] pr-[118px]">
                      <div className="grid grid-cols-2 gap-10 mt-10 mb-10">
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
                                onViewDetails={() => alert(`View Details for ${job.jobTitle}`)}
                                status={job.status}
                            />
                        </div>
                    ))}
                </div>
                </div>
            </div>
        </div>
    );
}

export default ApplicantApplications;
