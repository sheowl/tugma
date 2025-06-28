import React, { useEffect, useState } from "react";
import ApplicantSideBar from "../components/ApplicantSideBar";
import ApplicantDashLogo from "../assets/ApplicantDashLogo.svg";
import { supabase } from "../services/supabaseClient";

function ApplicantProfile() {
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) return setLoading(false);

      // 1. Fetch profile
      const res = await fetch("http://localhost:8000/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await res.json();
      const applicant = userData.database_user;
      setProfile(applicant);

      // 2. Fetch experiences
      if (applicant?.applicant_id) {
        const expRes = await fetch(
          `http://localhost:8000/api/v1/applicants/${applicant.applicant_id}/experience`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setExperiences(await expRes.json());

        // 3. Fetch certificates
        const certRes = await fetch(
          `http://localhost:8000/api/v1/applicants/${applicant.applicant_id}/certificates`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setCertificates(await certRes.json());
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found.</div>;

  const personalInfoLeft = [
    { label: "Name", value: `${profile.first_name} ${profile.last_name}` },
    { label: "Mobile Number", value: profile.contact_number || "N/A" },
    { label: "University", value: profile.university || "N/A" },
    { label: "Year Graduated", value: profile.year_graduated || "N/A" },
  ];

  const personalInfoRight = [
    { label: "Address", value: profile.current_address || "N/A" },
    { label: "Telephone Number", value: profile.telephone_number || "N/A" },
    { label: "Degree", value: profile.degree || "N/A" },
    { label: "Field", value: profile.field || "N/A" },
  ];

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
                User Profile
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex flex-col space-y-7 justify-center items-center w-full">
          <div className="w-full max-w-[976px] h-[220px] rounded-[20px] shadow-all-around flex items-center gap-8 bg-white p-10">
            {/* Profile Picture */}
            <div className="relative flex-shrink-0">
              <div className="w-[150px] h-[150px] rounded-full border border-gray-600 flex items-center justify-center text-4xl text-gray-500">
                <i className="bi bi-person-fill text-7xl"></i>
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-[#2A4D9B] rounded-full flex items-center justify-center text-[#2A4D9B] text-xl">
                <i className="bi bi-plus"></i>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col justify-center flex-grow">
              <h2 className="text-2xl font-bold">
                {profile.first_name} {profile.last_name}
              </h2>
              <div className="text-gray-600 flex items-center gap-2 mt-1">
                <i className="bi bi-geo-alt"></i> {profile.current_address || "N/A"}
              </div>
              <div className="text-gray-600 flex items-center gap-2 mt-1">
                <i className="bi bi-telephone"></i> {profile.contact_number || "N/A"}
              </div>
              <div className="text-gray-600 flex items-center gap-2 mt-1">
                <i className="bi bi-envelope"></i>{" "}
                {profile.applicant_email || "N/A"}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-4">
                <button className="bg-[#2A4D9B] text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <i className="bi bi-github"></i> GitHub
                </button>
                <button className="bg-[#2A4D9B] text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <i className="bi bi-linkedin"></i> LinkedIn
                </button>
                <button className="bg-[#2A4D9B] text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <i className="bi bi-globe"></i> Portfolio
                </button>
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div className="w-full max-w-[976px] h-auto rounded-[20px] shadow-all-around flex items-center gap-8 bg-white p-10">
            <div className="flex flex-col justify-center flex-grow space-y-4">
              <div className="text-2xl font-bold text-neutral-700">Resume</div>
              <div className="text-xl font-semibold text-neutral-700">
                Personal Information
              </div>

              {/* Two Columns */}
              <div className="grid grid-cols-2 gap-8">
                {/* First Column */}
                <div className="flex flex-col space-y-4">
                  {personalInfoLeft.map((field, index) => (
                    <div key={index} className="flex flex-col space-y-1">
                      <div className="text-gray-500 text-base font-semibold">
                        {field.label}
                      </div>
                      <div className="text-black">{field.value}</div>
                    </div>
                  ))}
                </div>

                {/* Second Column */}
                <div className="flex flex-col space-y-4">
                  {personalInfoRight.map((field, index) => (
                    <div key={index} className="flex flex-col space-y-1">
                      <div className="text-gray-500 text-base font-semibold">
                        {field.label}
                      </div>
                      <div className="text-black">{field.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-t border-gray-300 my-4" />

              <div className="text-xl font-semibold text-neutral-700">
                Experience
              </div>

              {experiences.length === 0 ? (
                <div className="text-gray-500">No work experience yet.</div>
              ) : (
                experiences.map((exp, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="font-semibold">
                      {exp.title} at {exp.company}
                    </div>
                    <div className="text-sm text-gray-500">
                      {exp.start_date} - {exp.end_date || "Present"}
                    </div>
                    <div className="text-sm">{exp.description}</div>
                  </div>
                ))
              )}

              <hr className="border-t border-gray-300 my-4" />

              <div className="text-xl font-semibold text-neutral-700">
                Certifications
              </div>
              {certificates.length === 0 ? (
                <div className="text-gray-500">No certifications yet.</div>
              ) : (
                certificates.map((cert, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="font-semibold">{cert.name}</div>
                    <div className="text-sm text-gray-500">
                      {cert.issuer} ({cert.year})
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicantProfile;