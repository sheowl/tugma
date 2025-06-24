import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ApplicantSideBar from '../components/ApplicantSideBar';
import ApplicantTracker from '../components/ApplicantTracker';
import SearchBar from '../components/SearchBar';
import ApplicantDashLogo from '../assets/ApplicantDashLogo.svg';
import Dropdown from '../components/Dropdown';
import ApplicantNotification from '../components/ApplicantNotification';

function ApplicantApplications() {
    const navigate = useNavigate();

    useEffect(() => {
      if (!localStorage.getItem("access_token")) {
        navigate("/applicant-sign-in", { replace: true });
      }
    }, [navigate]);

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
                <div className="pl-[112px] pr-[118px]">
                      <div className="grid grid-cols-2 gap-10 mt-10 mb-10">
                    {filteredApplications.map((job, index) => (
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
