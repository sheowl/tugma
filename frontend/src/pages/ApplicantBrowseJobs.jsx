import React, { useState } from 'react';
import ApplicantSideBar from '../components/ApplicantSideBar';
import Card from '../components/Card';
import ApplicantDashLogo from '../assets/ApplicantDashLogo.svg';
import JobDetailsDrawer from '../components/JobDetailsDrawer';
import SearchBar from '../components/SearchBar';

function ApplicantBrowseJobs() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    // Handle opening the Job Details Drawer
    const handleViewDetails = (job) => {
        setSelectedJob(job);
        setDrawerOpen(true);
    };

    // Handle closing the Job Details Drawer
    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedJob(null);
    };

    // Handle applying for a job
    const handleApply = () => {
        alert("Applied!");
    };

    // Mock job data
    const mockJobData = [
        {
            id: 1,
            jobTitle: "UI/UX Designer",
            companyName: "Creative Minds Inc.",
            location: "Sta Mesa, Manila",
            matchScore: 67,
            workSetup: "Hybrid",
            employmentType: "Contractual",
            description: "Exciting opportunity to design modern user experiences...",
            salaryRangeLow: 35,
            salaryRangeHigh: 45,
            salaryFrequency: "Monthly",
            tags: [
                { label: "Figma", matched: true },
                { label: "Adobe XD", matched: true },
                { label: "Wireframing", matched: true },
                { label: "Prototyping", matched: false },
            ],
        },
        {
            id: 2,
            jobTitle: "Frontend Developer",
            companyName: "TechNova Corp.",
            location: "Quezon City, Manila",
            matchScore: 72,
            workSetup: "Remote",
            employmentType: "Full-time",
            description: "Work with modern React stacks in a dynamic team.",
            salaryRangeLow: 40,
            salaryRangeHigh: 60,
            salaryFrequency: "Monthly",
            tags: [
                { label: "React", matched: true },
                { label: "JavaScript", matched: true },
                { label: "CSS", matched: true },
                { label: "TypeScript", matched: false },
            ],
        },
        {
            id: 3,
            jobTitle: "Backend Developer",
            companyName: "CodeWorks Inc.",
            location: "Makati City, Manila",
            matchScore: 80,
            workSetup: "On-Site",
            employmentType: "Part-Time",
            description: "Join our backend team to build scalable APIs.",
            salaryRangeLow: 50,
            salaryRangeHigh: 70,
            salaryFrequency: "Monthly",
            tags: [
                { label: "Node.js", matched: true },
                { label: "Express", matched: true },
                { label: "MongoDB", matched: true },
                { label: "GraphQL", matched: false },
            ],
        },
    ];

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
                                Welcome Back, User!
                            </div>
                            <div className="font-semibold italic text-orange-400 text-xl">
                                Ready to make meets end?
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <i className="bi bi-person-circle text-4xl text-gray-400"></i>
                        <div className="leading-tight pl-3">
                            <div className="font-semibold text-black text-sm">User</div>
                            <div className="text-stone-900 italic text-xs">
                                User Current/Previous Role
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-[112px] mt-0 mb-2">
                <SearchBar />
                </div>

                {/* Job Count */}
                <div className="pl-[112px] pr-[118px]">
                    <div className="text-sm font-semibold text-gray-500 mb-2">
                        {mockJobData.length} matches displayed
                    </div>
                    <hr className="border-t-2 border-[#000000]/20" />
                </div>

                {/* Job Cards */}
                <div className="pl-[112px] pr-[118px] mt-10 mb-10 flex flex-wrap gap-[33px] justify-center">
                    {mockJobData.map((job) => (
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
                            tags={job.tags} // Pass tags here
                            onViewDetails={() => handleViewDetails(job)}
                        />
                    ))}
                </div>
            </div>

            {/* Job Details Drawer */}
            <JobDetailsDrawer
                open={drawerOpen}
                onClose={handleCloseDrawer}
                job={selectedJob}
                onApply={handleApply}
            />
        </div>
    );
}

export default ApplicantBrowseJobs;
