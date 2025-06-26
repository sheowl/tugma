import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import ApplicantDashLogo from "../assets/ApplicantDashLogo.svg";
import ApplicantNotification from "./ApplicantNotification";
import SearchBar from "./SearchBar";

const ApplicantHeader = ({
  title,
  subtitle,
  firstName,
  showProfile = true,
  showSearchBar = true,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef();

  const sampleData = [
    { title: "Some Job Here", company: "Company Name Here", status: "Accepted", timeAgo: "3 hours ago" },
    { title: "Junior Web Developer", company: "Kim Satrjt PH", status: "Rejected", timeAgo: "8 hours ago" },
    { title: "Job Title", company: "Company Name", status: "Waitlisted", timeAgo: "3 hours ago" },
  ];

  const hasNotifications = sampleData.length > 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex justify-between w-full px-9 mb-0 relative">
        {/* Logo and Greeting */}
        <div className="flex items-center gap-[15px] m-9">
          <img
            src={ApplicantDashLogo}
            alt="Tugma Logo"
            className="max-w-[136px] h-auto"
          />
          <div>
            <div className="font-[Montserrat] text-4xl font-bold text-[#2A4D9B]">
              {title}
            </div>
            <div className="font-semibold italic text-orange-400 text-xl">
              {subtitle}
            </div>
          </div>
        </div>

        {/* Notification and Profile */}
        <div className="flex items-center gap-4 relative" ref={notifRef}>
          {showProfile && (
            <>
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {localStorage.getItem("profileImage") ? (
                  <img
                    src={localStorage.getItem("profileImage")}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="bi bi-person-circle text-4xl text-gray-400"></i>
                )}
              </div>
              <div className="leading-tight pl-1">
                <div className="font-semibold text-black text-sm">{firstName}</div>
              </div>
            </>
          )}

          {/* Bell Notification */}
          <div className="relative">
            <Bell
              className="w-6 h-6 text-[#2A4D9B] ml-6 cursor-pointer"
              onClick={() => setShowNotifications((prev) => !prev)}
            />
            {hasNotifications && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            )}
            {showNotifications && (
              <div className="absolute top-8 right-0 z-50">
                <ApplicantNotification
                  open={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  notification={sampleData}
                  onViewDetails={() => setShowNotifications(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

    
      {showSearchBar && (
        <div className="px-[112px] mt-0 mb-5 flex justify-between items-center">
          <SearchBar onSearch={(query) => console.log("Applicant Search:", query)} />
        </div>
      )}
    </>
  );
};

export default ApplicantHeader;
