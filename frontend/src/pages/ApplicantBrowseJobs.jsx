import React from 'react';
import ApplicantSideBar from '../components/ApplicantSideBar';

function ApplicantBrowseJobs() {
    return (
        <div className="min-h-screen bg-[#2A4D9B] flex items-start overflow-hidden">
            <ApplicantSideBar />

            {/* Main Content Area */}
            <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-6 shadow-md">
                {/* Your content goes here */}
            </div>
        </div>
    );
}

export default ApplicantBrowseJobs;
