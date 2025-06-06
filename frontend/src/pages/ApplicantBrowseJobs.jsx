import React from 'react';
import ApplicantSideBar from '../components/ApplicantSideBar';
import Card from '../components/Card'; 
import ApplicantDashLogo from '../assets/ApplicantDashLogo.svg';

function ApplicantBrowseJobs() {
    return (
        <div className="min-h-screen bg-[#2A4D9B] flex items-start overflow-hidden">
            <ApplicantSideBar />

            {/* White Panel */}
            <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-6 shadow-md font-montserrat">
               
               {/* Header */}
                <div className = "flex justify-between w-full px-9 mb-0">
                <div className = "flex items-center gap-[15px] m-9">
                    <img
                    src={ApplicantDashLogo}
                    alt="Tugma Logo"
                    className="max-w-[136px] h-auto"
                    />
                
                    <div>
                        <div className ="font-[Montserrat] text-4xl font-bold text-[#2A4D9B]">Welcome Back, User!</div>
                        <div className = "font-semibold italic text-orange-400 text-xl">Ready to make meets end?</div>
                    </div>
                </div>

                    <div className ="flex items-center">
                        <i className='bi bi-person-circle text-4xl text-gray-400'></i>
                        <div className ="leading-tight pl-3">
                            <div className="font-semibold text-black text-sm">User</div>
                            <div className="text-stone-900 italic text-xs">User Current/Previous Role</div>
                        </div>

                    </div>

                </div>    

            {/* Search Bar */}
              <div className="flex justify-center w-full mb-10 gap-6">
                <div className="relative w-[672px] h-[46px]">
                    <input
                    type="text"
                    placeholder="What job are you looking for?"
                    className="w-full h-full pr-20 pl-4 text-xs border
                     border-gray-300 rounded-[15px] shadow-sm focus:outline-1 focus:ring-0"
                    />
                    
                </div>
                <button className="font-bold bg-[#2A4D9B] text-white justify-center
                text-sm rounded-[15px] w-[140px] max-h-[46px] p-4 flex items-center gap-3 hover:bg-[#1f3c7b]">
                    <i className="bi bi-search text-base"></i>
                    Search
                    </button>
                </div>


                <div className ="flex items-center mx-[32px] font-semibold text-sm text-gray-500">9 matches displayed</div>

                <div className ="grid grid-cols-3 gap-[32px] m-8 mt-3"> 
                    <Card 
                    jobTitle="UI/UX Designer"
                    companyName="Creative Minds Inc."
                    location="Sta Mesa, Manila"
                    matchScore={92}
                    workSetup="Hybrid"
                    employmentType="Part-Time"
                    description="Design and optimize user interfaces for client projects using Figma and other tools."
                    salaryRangeLow={35}
                    salaryRangeHigh={45}                
                />

                <Card 
                    jobTitle="UI/UX Designer"
                    companyName="Creative Minds Inc."
                    location="Sta Mesa, Manila"
                    matchScore={92}
                    workSetup="Hybrid"
                    employmentType="Part-Time"
                    description="Design and optimize user interfaces for client projects using Figma and other tools."
                    salaryRangeLow={35}
                    salaryRangeHigh={45}                
                />

                <Card 
                    jobTitle="UI/UX Designer"
                    companyName="Creative Minds Inc."
                    location="Sta Mesa, Manila"
                    matchScore={92}
                    workSetup="Hybrid"
                    employmentType="Part-Time"
                    description="Design and optimize user interfaces for client projects using Figma and other tools."
                    salaryRangeLow={35}
                    salaryRangeHigh={45}                
                />

                <Card 
                    jobTitle="UI/UX Designer"
                    companyName="Creative Minds Inc."
                    location="Sta Mesa, Manila"
                    matchScore={92}
                    workSetup="Hybrid"
                    employmentType="Part-Time"
                    description="Design and optimize user interfaces for client projects using Figma and other tools."
                    salaryRangeLow={35}
                    salaryRangeHigh={45}                
                />

                <Card 
                    jobTitle="UI/UX Designer"
                    companyName="Creative Minds Inc."
                    location="Sta Mesa, Manila"
                    matchScore={92}
                    workSetup="Hybrid"
                    employmentType="Part-Time"
                    description="Design and optimize user interfaces for client projects using Figma and other tools."
                    salaryRangeLow={35}
                    salaryRangeHigh={45}                
                />

                <Card 
                    jobTitle="UI/UX Designer"
                    companyName="Creative Minds Inc."
                    location="Sta Mesa, Manila"
                    matchScore={92}
                    workSetup="Hybrid"
                    employmentType="Part-Time"
                    description="Design and optimize user interfaces for client projects using Figma and other tools."
                    salaryRangeLow={35}
                    salaryRangeHigh={45}                
                />
                </div>   


            </div>
        </div>
    );
}

export default ApplicantBrowseJobs;
