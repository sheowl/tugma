import React from 'react';
import { NavLink } from 'react-router-dom';
import TugmaLogoApplicant from '../assets/TugmaLogoApplicant.svg';

const navItems = [
  { name: 'Browse Jobs', icon: 'bi-search', path: '/applicantbrowsejobs' },
  { name: 'Applications', icon: 'bi-briefcase-fill', path: '/applicantapplications' },
  { name: 'Profile', icon: 'bi-person-fill', path: '/applicantprofile' },
];

const ApplicantSideBar = () => {
  return (
        <div className="w-[336px] bg-[#2A4D9B] min-h-screen flex flex-col justify-between items-center pt-14 pb-6">
        {/* Top Section */}
        <div className="flex flex-col items-center">
            {/* Logo */}
            <img
            src={TugmaLogoApplicant}
            alt="Tugma Logo"
            className="w-[200px] h-[50px] mb-12"
            />

            {/* Navigation */}
            <nav className="w-full px-6">
            <ul className="flex flex-col gap-[30px] font-bold items-center">
                {navItems.map((item) => (
                <NavLink
                    to={item.path}
                    key={item.name}
                    className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 w-[190px] h-[50px] rounded-[10px] text-base cursor-pointer transition-colors duration-200 ${
                        isActive ? 'bg-white text-[#2A4D9B] shadow-md' : 'text-white hover:bg-[#1f3c7b]'
                    }`
                    }
                >
                    <i className={`bi ${item.icon} text-xl`}></i>
                    <span>{item.name}</span>
                </NavLink>
                ))}
            </ul>
            </nav>
        </div>

      {/* Logout */}
      <NavLink to="/applicant-sign-in"
        className="flex items-center gap-3 px-6 py-3 w-[190px] h-[50px] text-white text-base cursor-pointer hover:bg-[#1f3c7b] rounded-[10px]"
        >
        <i className="bi bi-box-arrow-right text-xl"></i>
        <span>Logout</span>
    </NavLink>
    </div>
  );
};

export default ApplicantSideBar;
