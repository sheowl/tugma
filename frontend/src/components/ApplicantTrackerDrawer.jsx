import CompanyDetails from "./CompanyDetails";
import ApplicantApplicationTimeline from "./ApplicantApplicationTimeline";
import { useState } from "react";
import { Link } from "react-router-dom";

function StatusDetailsBox({ status = "Status", message, children }) {
  return (
    <div className="bg-[#2A4D9B] text-white rounded-[20px] p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-base font-bold">Status Details</h4>
        <p className="text-sm font-semibold">{status}</p>
      </div>
      <div className="text-xs mb-4">{message}</div>
      {children}
    </div>
  );
}

export default function ApplicantTrackerDrawer({ open, onClose, job, onViewDetails }) {
  const [companyDetailsOpen, setCompanyDetailsOpen] = useState(false); // State for CompanyDetails drawer

  let matchScoreColor = "text-[#27AE60]";
  if (job && job.matchScore < 50) {
    matchScoreColor = "text-[#E74C3C]";
  } else if (job && job.matchScore < 75) {
    matchScoreColor = "text-[#F5B041]";
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 z-40 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 px-8 right-0 h-full w-[640px] bg-white shadow-2xl z-50 transform 
          transition-transform duration-300 rounded-tl-[30px] rounded-bl-[30px] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between mt-12 px-10 h-[80px] z-10">
          <button
            className="p-2 text-gray-400 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="bi bi-arrow-left text-5xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-10 pb-40 font-montserrat">
          {job ? (
            <div className="space-y-4">
              <div className="mb-4">
                <span className={`text-2xl font-bold text-right ${matchScoreColor}`}>
                  {job.matchScore}% Matched
                </span>

                <div>
                  <Link
                    to={``}
                    className="text-sm font-semibold text-left text-[#2A4D9B] underline"
                    onClick={onViewDetails}
                  >
                    View Job Details
                  </Link>
                </div>
                <h2 className="text-4xl font-bold mt-1">{job.jobTitle}</h2>
                <div className="text-xl font-bold text-gray-900">
                  ₱{job.salaryRangeLow}K - ₱{job.salaryRangeHigh}K{" "}
                  <span className="text-xl font-normal text-gray-500">
                    {job.salaryFrequency.toLowerCase()}
                  </span>
                </div>

                <div className="flex items-center">
                  <h3 className="text-base font-semibold text-[#676767]">{job.companyName}</h3>
                  <i
                    className="bi bi-info-circle text-[19px] ml-2 cursor-pointer text-gray-500"
                    title="Company Information"
                    onClick={() => setCompanyDetailsOpen(true)} // Open CompanyDetails drawer
                  />
                </div>

                <p className="text-base text-[#676767]">{job.location}</p>
              </div>

              <div className="flex gap-4 mb-8">
                <span className="px-2 py-1 bg-indigo-50 rounded text-xs font-semibold text-neutral-700">
                  <i className="bi bi-geo-alt-fill text-[#2A4D9B] mr-1" />
                  {job.workSetup}
                </span>
                <span className="px-2 py-1 bg-indigo-50 rounded text-xs font-semibold text-neutral-700">
                  <i className="bi bi-briefcase-fill text-[#2A4D9B] mr-1" />
                  {job.employmentType}
                </span>
              </div>

              <div>
                <ApplicantApplicationTimeline status={job.status} large />
              </div>

              {job.status === "interview" && (
                <StatusDetailsBox
                  status="For Interview"
                  message="Your application has been reviewed, and the employer has scheduled you for an interview. Please review the provided details including date, time, location (or video link), and any additional remarks."
                >
                  <div className="flex justify-end">
                    <button
                      className="mt-2 px-4 py-2 bg-white text-[#2A4D9B] font-bold text-xs rounded-[8px] hover:bg-[#dce6f9] transition-colors"
                    >
                      View Interview Details
                    </button>
                  </div>
                </StatusDetailsBox>
              )}

              {job.status !== "interview" && (
                <StatusDetailsBox
                  status={job.status
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                  message="Your application has been reviewed. Please wait for further updates regarding the next steps."
                />
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400">No job selected</div>
          )}
        </div>
      </div>

      <CompanyDetails
        open={companyDetailsOpen}
        onClose={() => setCompanyDetailsOpen(false)} // Close the drawer
        job={job} // Pass the job details
      />
    </>
  );
}