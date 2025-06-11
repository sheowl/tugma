import React, { useState, useEffect } from "react";
import Card from '../components/Card.jsx';
import EmployerSideBar from "../components/EmployerSideBar";
import EmployerApplicantHeader from "../components/EmployerApplicantHeader";
import EmpCard from "../components/EmpCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; // replace FaChevron with FiChevron

const EmployerApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [sortBy, setSortBy] = useState('best');
  const [selectedJobNumber, setSelectedJobNumber] = useState(1);

  useEffect(() => {
    // Simulate fetching from backend. Replace with real API call in production.
    const exampleApplicants = [
      {
        id: 1,
        jobNumber: 1,
        matched: 85,
        isNew: true,
        candidateName: "Juan Dela Cruz",
        role: "Software Engineer",
        skills: ["React", "Node.js", "CSS", "HTML", "JavaScript"],
        moreSkillsCount: 2,
        appliedDaysAgo: 9,
      },
      {
        id: 2,
        jobNumber: 2,
        matched: 100,
        isNew: false,
        candidateName: "Maria Santos",
        role: "Frontend Developer",
        skills: ["Vue.js", "Sass", "HTML", "JavaScript"],
        moreSkillsCount: 1,
        appliedDaysAgo: 5,
      },
      {
        id: 3,
        jobNumber: 2,
        matched: 95,
        isNew: true,
        candidateName: "Pedro Ramirez",
        role: "Backend Developer",
        skills: ["Python", "Django", "REST API", "PostgreSQL"],
        moreSkillsCount: 0,
        appliedDaysAgo: 10,
      },
      {
        id: 4,
        jobNumber: 3,
        matched: 50,
        isNew: true,
        candidateName: "Juan Dela Cruz",
        role: "Software Engineer",
        skills: ["React", "Node.js", "CSS", "HTML", "JavaScript"],
        moreSkillsCount: 2,
        appliedDaysAgo: 2,
      },
      {
        id: 5,
        jobNumber: 2,
        matched: 80,
        isNew: true,
        candidateName: "Juan Dela Cruz",
        role: "Software Engineer",
        skills: ["React", "Node.js", "CSS", "HTML", "JavaScript"],
        moreSkillsCount: 2,
        appliedDaysAgo: 1,
      },
      {
        id: 6,
        jobNumber: 4,
        matched: 62,
        isNew: true,
        candidateName: "Juan Dela Cruz",
        role: "Software Engineer",
        skills: ["React", "Node.js", "CSS", "HTML", "JavaScript"],
        moreSkillsCount: 2,
        appliedDaysAgo: 7,
      },
    ];
    setApplicants(exampleApplicants);
  }, []);

  // Get unique job numbers from applicants
  const jobNumbers = [...new Set(applicants.map(app => app.jobNumber))].sort((a, b) => a - b);
  const currentIndex = jobNumbers.indexOf(selectedJobNumber);

  // Filter applicants by selected job number
  const filteredApplicants = applicants.filter(app => app.jobNumber === selectedJobNumber);

  // Sort applicants based on sortBy
  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    if (sortBy === 'best') {
      return b.matched - a.matched;
    } else if (sortBy === 'recent') {
      return a.appliedDaysAgo - b.appliedDaysAgo;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#FF8032] flex items-start overflow-hidden">
      <EmployerSideBar />
      <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-2 sm:p-4 md:p-6 shadow-md w-full max-w-full">
        <EmployerApplicantHeader
          onSortChange={setSortBy}
          selectedSort={sortBy}
          jobPostNumber={selectedJobNumber}
          totalApplicants={filteredApplicants.length}
        />
        <div className="pl-[112px] pr-[118px] mt-10 mb-10 flex flex-wrap gap-[33px] justify-center">
          {sortedApplicants.length > 0 ? (
            sortedApplicants.map(applicant => (
              <EmpCard
                key={applicant.id}
                matched={applicant.matched}
                isNew={applicant.isNew}
                candidateName={applicant.candidateName}
                role={applicant.role}
                skills={applicant.skills}
                moreSkillsCount={applicant.moreSkillsCount}
                appliedDaysAgo={applicant.appliedDaysAgo}
                actionLabel="Action"
                onAction={val => {}}
              />
            ))
          ) : (
            <div>No applicants found.</div>
          )}
        </div>
        {/* Navigation Bar */}
        <div
          className="bg-white/80 py-4 flex justify-center items-center gap-6 z-50"
          style={{
            position: 'fixed',
            left: '337px', // match sidebar width
            bottom: 0,
            right: 0,
            WebkitBackdropFilter: 'blur(12px)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <button
            className="w-10 h-10 flex items-center justify-center text-[#FF8032] bg-white hover:bg-[#FF8032]/10 transition disabled:opacity-50 disabled:cursor-not-allowed p-0"
            style={{
              minWidth: 40,
              minHeight: 40,
              width: 40,
              height: 40,
            }}
            onClick={() => setSelectedJobNumber(jobNumbers[currentIndex - 1])}
            disabled={currentIndex === 0}
            aria-label="Previous"
          >
            <FiChevronLeft size={28} />
          </button>
          <div className="flex gap-2">
            {(() => {
              let start = Math.max(0, currentIndex - 1);
              let end = Math.min(jobNumbers.length, start + 3);
              if (end - start < 3 && start > 0) {
                start = Math.max(0, end - 3);
              }
              return jobNumbers.slice(start, end).map((num, idx) => {
                const isCurrent = num === selectedJobNumber;
                return (
                  <button
                    key={num}
                    className="flex items-center justify-center rounded-lg transition-all duration-200 bg-white"
                    style={{
                      width: isCurrent ? 32 : 24,
                      height: isCurrent ? 32 : 24,
                      minWidth: isCurrent ? 32 : 24,
                      minHeight: isCurrent ? 32 : 24,
                      border: isCurrent ? '4px solid #FF8032' : '2px solid #FF8032',
                      boxShadow: isCurrent ? '0 2px 8px #E66F24' : undefined,
                      position: 'relative',
                      padding: 0,
                    }}
                    onClick={() => setSelectedJobNumber(num)}
                    aria-label={`Go to job post`}
                  >
                    <span
                      style={{
                        display: 'block',
                        width: 18,
                        height: 18,
                        borderRadius: 6,
                        background: isCurrent ? '#FF8032' : 'transparent',
                        border: isCurrent ? '4px solid #FF8032' : '4px solid transparent',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  </button>
                );
              });
            })()}
          </div>
          <button
            className="w-10 h-10 flex items-center justify-center text-[#FF8032] bg-white hover:bg-[#FF8032]/10 transition disabled:opacity-50 disabled:cursor-not-allowed p-0"
            style={{
              minWidth: 40,
              minHeight: 40,
              width: 40,
              height: 40,
            }}
            onClick={() => setSelectedJobNumber(jobNumbers[currentIndex + 1])}
            disabled={currentIndex === jobNumbers.length - 1}
            aria-label="Next"
          >
            <FiChevronRight size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployerApplicants;