import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TugmaLogoApplicant from '../assets/TugmaLogoEmployer.svg';

const navItems = [
    { icon: 'bi-house', label: 'Home Page', path: '/EmployerHomePage' },
    { icon: 'bi-clipboard2', label: 'Job Posts' },
    { icon: 'bi-person-rolodex', label: 'Applicants', path: '/EmployerApplicants' },
    { icon: 'bi-building-gear', label: 'Company' },
];

const EmployerSideBar = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate ? useNavigate() : null;
    const handleNavClick = (idx, path) => {
        setActiveIndex(idx);
        if (path && navigate) {
            navigate(path);
        }
    };

    // Set activeIndex based on current path
    React.useEffect(() => {
        if (navigate && window && window.location && window.location.pathname) {
            const currentPath = window.location.pathname;
            const foundIdx = navItems.findIndex(item => item.path === currentPath);
            if (foundIdx !== -1 && foundIdx !== activeIndex) {
                setActiveIndex(foundIdx);
            }
        }
    }, [navigate]);

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
                                    activeIndex === idx
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
            <div className="flex items-center gap-3 text-white text-base pl-[72px] pb-[44px] self-start hover:text-[#E66F24]">
                <i className="bi bi-box-arrow-right text-xl"></i>
                <span>Logout</span>
            </div>
        </div>
    );
};

export default EmployerSideBar;
