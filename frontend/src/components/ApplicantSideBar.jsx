import React from 'react';
import TugmaLogoApplicant from '../assets/TugmaLogoApplicant.svg';

const ApplicantSideBar = () => {
    return (
        <div className="w-[336px] bg-[#2A4D9B] min-h-screen flex flex-col items-center pt-14">
            {/* Logo */}
            <img
                src={TugmaLogoApplicant}
                alt="Tugma Logo"
                className="w-[200px] h-[50px] mb-12"
            />

            {/* Navigation */}
            <nav className="w-full px-6">
                <ul className="flex flex-col gap-[30px] font-bold items-center">
                    <li className="flex items-center gap-3 px-6 py-3 w-[190px] h-[50px] rounded-[10px] text-white text-base cursor-pointer hover:bg-[#1f3c7b]">
                        <i className="bi bi-search text-xl"></i>
                        <span>Browse Jobs</span>
                    </li>
                    <li className="flex items-center gap-3 px-6 py-3 w-[190px] h-[50px] text-white text-base cursor-pointer hover:bg-[#1f3c7b] rounded-[10px]">
                        <i className="bi bi-briefcase text-xl"></i>
                        <span>Applications</span>
                    </li>
                    <li className="flex items-center gap-3 px-6 py-3 w-[190px] h-[50px] text-white text-base cursor-pointer hover:bg-[#1f3c7b] rounded-[10px]">
                        <i className="bi bi-person text-xl"></i>
                        <span>Profile</span>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default ApplicantSideBar;
