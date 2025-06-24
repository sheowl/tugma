import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ApplicantSideBar from '../components/ApplicantSideBar';

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
                
            </div>
        </div>
    );
}

export default ApplicantApplications;
