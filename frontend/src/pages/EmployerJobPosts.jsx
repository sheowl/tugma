import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from '../components/JobCard.jsx';
import EmployerSideBar from "../components/EmployerSideBar";
import EmployerApplicantHeader from "../components/EmployerApplicantHeader";
import SearchBar from "../components/SearchBar";
import JobNewPost from "../components/JobNewPost"; // <-- Import the drawer component

const PostNewJobCard = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-[#FF8032] rounded-[20px] shadow-all-around flex flex-col items-center justify-center cursor-pointer transition hover:bg-[#ff984d] focus:outline-none"
    style={{
      width: 304,
      minHeight: 330,
      maxWidth: 304,
      minWidth: 304,
      height: 330,
      marginBottom: 0,
    }}
  >
    <span className="text-white text-[64px] leading-none mb-2" style={{ fontWeight: 300 }}>+</span>
    <span className="text-white text-[24px] font-bold">Post New Job</span>
  </button>
);

const EmployerJobPosts = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for access_token in localStorage
    if (!localStorage.getItem("access_token")) {
      navigate("/employer-sign-in", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    // Simulate fetching from backend. Replace with real API call in production.
    const exampleJobPosts = [
      {
        id: 1,
        jobTitle: "Software Engineer",
        companyName: "Tech Solutions Inc.",
        location: "Sta Mesa, Manila",
        type: "On-Site",
        employment: "Full-Time",
        description: "Develop and maintain web applications using React and Node.js.",
        status: "Active",
        postedDaysAgo: 3,
      },
      {
        id: 2,
        jobTitle: "Frontend Developer",
        companyName: "Web Innovators",
        location: "Makati, Manila",
        type: "Remote",
        employment: "Part-Time",
        description: "Work on UI/UX and implement designs using Vue.js.",
        status: "Active",
        postedDaysAgo: 7,
      },
    ];
    setJobPosts(exampleJobPosts);
  }, []);

  const handleAddJob = (job) => {
    setJobPosts([
      {
        ...job,
        id: Date.now(),
        status: "Active",
        postedDaysAgo: 0,
      },
      ...jobPosts,
    ]);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#FF8032] flex items-start overflow-hidden">
      <EmployerSideBar />
      <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-2 sm:p-4 md:p-6 shadow-md w-full max-w-full">
        <EmployerApplicantHeader />

        {/* SearchBar placed after the header */}
        <div className="px-[112px] mt-6 mb-2">
          <SearchBar />
        </div>

        <div className="pl-[112px] pr-[118px] mt-10 mb-10 flex flex-wrap gap-[33px] justify-center">
          <PostNewJobCard onClick={() => setShowModal(true)} />
          {jobPosts.length > 0 ? (
            jobPosts.map(job => (
              <JobCard
                key={job.id}
                jobTitle={job.jobTitle}
                companyName={job.companyName}
                location={job.location}
                type={job.type}
                employment={job.employment}
                description={job.description}
                status={job.status}
                postedDaysAgo={job.postedDaysAgo}
              />
            ))
          ) : (
            <div>No job posts found.</div>
          )}
        </div>
        {/* Use the drawer-style JobNewPost instead of AddJobModal */}
        <JobNewPost
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleAddJob}
        />
      </div>
    </div>
  );
};

export default EmployerJobPosts;