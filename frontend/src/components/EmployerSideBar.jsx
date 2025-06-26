import React, { useState } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import TugmaLogoApplicant from '../assets/TugmaLogoEmployer.svg';

const navItems = [
    { icon: 'bi-house', label: 'Home Page', path: '/EmployerHomePage', key: 'homepage' },
    { icon: 'bi-clipboard2', label: 'Job Posts', path: '/EmployerJobPosts', key: 'jobposts' },
    { icon: 'bi-building-gear', label: 'Company', path: '/CompanyPage', key: 'company' },
];

const EmployerSideBar = ({ activePage }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const getActiveIndex = () => {
        if (activePage) {
            // Find by key
            const foundByKey = navItems.findIndex(item => item.key === activePage);
            if (foundByKey !== -1) return foundByKey;
        }
        const currentPath = location.pathname.toLowerCase();
        // If on employerapplicants page, highlight Job Posts
        if (currentPath === '/employerapplicants') {
            return 1; // Job Posts index
        }
        
        // If on edit-company-profile page, highlight Company (same as CompanyPage)
        if (currentPath === '/edit-company-profile') {
            return 2; // Company index
        }
        
        // Find match by comparing lowercase paths
        const foundIndex = navItems.findIndex(item => item.path.toLowerCase() === currentPath);
        return foundIndex !== -1 ? foundIndex : 0;
    };

    const handleNavClick = (idx, path) => {
        if (path && navigate) {
            navigate(path);
        }
    };

    return (
        <div className="w-[336px] bg-[#FF8032] min-h-screen flex flex-col justify-between items-center pt-14 pb-6">
            {/* Top Section: Logo + Navigation */}
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
                        {navItems.map((item, idx) => (
                            <li
                                key={item.label}
                                className={`flex items-center gap-3 px-6 py-3 w-[190px] h-[50px] rounded-[10px] text-base cursor-pointer transition-colors duration-150 ${
                                    getActiveIndex() === idx
                                        ? 'bg-white text-[#FF8032]'
                                        : 'text-white hover:bg-[#E66F24]'
                                }`}
                                onClick={() => handleNavClick(idx, item.path)}
                            >
                                <i className={`bi ${item.icon} text-xl`}></i>
                                <span>{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Bottom Section */}
            <NavLink to="/employer-sign-in"
            className="flex items-center gap-3 px-6 py-3 w-[190px] h-[50px] text-white text-base cursor-pointer hover:bg-[#E66F24] rounded-[10px]"
            >
            <i className="bi bi-box-arrow-right text-xl"></i>
            <span>Logout</span>
        </NavLink>
        </div>
    );
};

export default EmployerSideBar;
