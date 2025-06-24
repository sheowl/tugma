import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import TugmaLogoApplicant from '../assets/TugmaLogoEmployer.svg';
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: 'Home Page', icon: 'bi-house', path: '/EmployerHomePage' },
  { name: 'Job Posts', icon: 'bi-clipboard2', path: '/EmployerJobPosts' },
  { name: 'Applicants', icon: 'bi-person-rolodex', path: '/EmployerApplicants' },
  { name: 'Company', icon: 'bi-building-gear', path: '/EmployerHomePage'},
];

const EmployerSideBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/employer-sign-in");
  };

  return (
    <div className="w-[336px] bg-[#FF8032] min-h-screen flex flex-col justify-between items-center pt-14 pb-6">
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
                    isActive ? 'bg-white text-[#FF8032] shadow-md' : 'text-white hover:bg-[#E66F24]'
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
      <NavLink
        to="/employer-sign-in"
        onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-3 w-[190px] h-[50px] text-white text-base cursor-pointer hover:bg-[#E66F24] rounded-[10px]"
      >
        <i className="bi bi-box-arrow-right text-xl"></i>
        <span>Logout</span>
      </NavLink>
    </div>
  );
};

export default EmployerSideBar;
