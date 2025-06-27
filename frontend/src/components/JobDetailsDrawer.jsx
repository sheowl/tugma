import React, { useState, useEffect } from "react";
import SaveButton from "./SaveButton";
import Tag from "./JobSkillTag";
import CompanyDetails from "./CompanyDetails";
import { useTags } from "../context/TagsContext";
import { supabase } from "../services/supabaseClient";

const JobDetailsDrawer = ({ open, onClose, job, onApply }) => {
  const [companyDetailsOpen, setCompanyDetailsOpen] = useState(false);
  const [matchDetails, setMatchDetails] = useState(null);
  const [loadingMatchDetails, setLoadingMatchDetails] = useState(false);
  const { getTagNamesByIds } = useTags();

  // Fetch detailed match information when drawer opens
  useEffect(() => {
    if (open && job?.job_id) {
      fetchMatchDetails();
    }
  }, [open, job?.job_id]);

  const fetchMatchDetails = async () => {
    try {
      setLoadingMatchDetails(true);
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) return;

      const response = await fetch(`http://localhost:8000/api/v1/matching/job/${job.job_id}/details`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMatchDetails(data);
        console.log("🔍 Match details fetched:", data);
      }
    } catch (error) {
      console.error("Error fetching match details:", error);
    } finally {
      setLoadingMatchDetails(false);
    }
  };

  if (!job) return null;

  // Extract job data
  const jobData = {
    job_id: job.job_id || job.id,
    job_title: job.job_title || job.jobTitle,
    company_name: job.company_name || job.companyName,
    company_description: job.company_description || job.companyDescription || "",
    company_location: job.company_location || job.location,
    location: job.location || job.company_location,
    setting: job.setting || job.workSetup,
    work_type: job.work_type || job.employmentType,
    description: job.description,
    salary_min: job.salary_min || job.salaryRangeLow,
    salary_max: job.salary_max || job.salaryRangeHigh,
    salary_frequency: job.salary_frequency || job.salaryFrequency || "monthly",
    position_count: job.position_count || job.availablePositions || 1,
    required_category_id: job.required_category_id,
    category_name: job.category_name || "General",
    required_proficiency: job.required_proficiency || job.proficiency,
    job_tags: job.job_tags || [],
    created_at: job.created_at || job.createdAt,
  };

  // Get tag names from tag IDs
  const tagNames = job.tag_names || getTagNamesByIds(jobData.job_tags) || [];
  console.log("Tag names for drawer:", tagNames);
  console.log("Company data:", {
    name: jobData.company_name,
    description: jobData.company_description,
    location: jobData.company_location,
  });

  // Match score color logic
  let matchScoreColor = "text-[#27AE60]";
  if (job?.match_score < 50) {
    matchScoreColor = "text-[#E74C3C]";
  } else if (job?.match_score < 75) {
    matchScoreColor = "text-[#F5B041]";
  }

  // Render tag with match status
  const renderTagWithMatchStatus = (tagName, isMatched) => (
    <span
      key={tagName}
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        isMatched 
          ? "bg-green-100 text-green-800 border border-green-300" 
          : "bg-red-100 text-red-800 border border-red-300"
      }`}
    >
      {isMatched ? "✓ " : "✗ "}{tagName}
    </span>
  );

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
        className={`fixed top-0 px-8 right-0 h-full w-[640px] bg-white shadow-2xl z-50 transform transition-transform duration-300 rounded-tl-[30px] rounded-bl-[30px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Top Bar */}
          <div className="flex items-center justify-between mt-12 px-10 h-[80px] z-10">
            <button
              className="p-2 text-gray-400 hover:text-gray-700"
              onClick={onClose}
              aria-label="Close"
            >
              <i className="bi bi-arrow-left text-5xl" />
            </button>
            <SaveButton size={60} />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-10 pb-40 font-montserrat">
            <div className="flex flex-col gap-6">
              {job ? (
                <>
                  {/* Header */}
                  <div className="space-y-4">
                    <div className="mb-4">
                      <span className={`text-2xl font-bold ${matchScoreColor}`}>
                        {job.match_score || 0}% Matched
                      </span>
                      <h2 className="text-4xl font-bold mt-1">{jobData.job_title}</h2>

                      <div className="flex items-center">
                        <h3 className="text-xl font-semibold text-[#676767]">{jobData.company_name}</h3>
                        <i
                          className="bi bi-info-circle text-[19px] ml-2 cursor-pointer text-gray-500"
                          title="Company Information"
                          onClick={() => setCompanyDetailsOpen(true)}
                        />
                      </div>

                      <p className="text-base text-[#676767]">{jobData.location}</p>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center gap-2 mb-6">
                      <p className="text-2xl font-bold">
                        ₱{job.salaryRangeLow || 0}K - ₱{job.salaryRangeHigh || 0}K
                      </p>
                      <p className="text-base font-normal text-gray-500">
                        {jobData.salary_frequency}
                      </p>
                    </div>

                    {/* Work Setup Tags */}
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 bg-indigo-50 rounded text-xs font-semibold text-neutral-700">
                        <i className="bi bi-geo-alt-fill text-[#2A4D9B] mr-1" />
                        {job.workSetup || jobData.setting}
                      </span>
                      <span className="px-3 py-1 bg-indigo-50 rounded text-xs font-semibold text-neutral-700">
                        <i className="bi bi-briefcase-fill text-[#2A4D9B] mr-1" />
                        {job.employmentType || jobData.work_type}
                      </span>
                    </div>
                  </div>

                  {/* Job Content */}
                  <div className="space-y-12">
                    {/* Job Description */}
                    <div>
                      <h4 className="text-base font-bold mb-2 text-neutral-700">Job Description</h4>
                      <p className="text-sm text-[#676767] whitespace-pre-line">{jobData.description}</p>
                    </div>

                    {/* Available Positions */}
                    <div>
                      <p className="text-md text-[#676767] font-medium mb-6">
                        {jobData.position_count > 1
                          ? `${jobData.position_count} available positions`
                          : `${jobData.position_count || 1} available position`}
                      </p>
                    </div>

                    {/* Enhanced Tag Matching Section */}
                    <div>
                      <h4 className="text-base font-bold mb-2 text-neutral-700">Required Skills</h4>
                      <div className="flex gap-2 flex-wrap">
                        {job.tag_names.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded-full text-xs ${
                              applicantTags.includes(tag) ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 font-bold text-[#2A4D9B]">
                        Match Score: {job.match_score}%
                      </div>
                    </div>

                    {/* Company Description */}
                    {jobData.company_description && (
                      <div>
                        <h4 className="text-base font-bold mb-2 text-neutral-700">About the Company</h4>
                        <p className="text-sm text-[#676767]">{jobData.company_description}</p>
                      </div>
                    )}

                    {/* Apply Button */}
                    <div className="w-full flex justify-center pt-6">
                      <button
                        className="w-[262px] bg-[#2A4D9B] text-white font-bold py-3 rounded-[10px] hover:bg-[#1f3c7b] transition-colors"
                        onClick={() => onApply(jobData)}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Loading job details...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CompanyDetails Drawer */}
      <CompanyDetails
        open={companyDetailsOpen}
        onClose={() => setCompanyDetailsOpen(false)}
        job={job}
      />
    </>
  );
};

export default JobDetailsDrawer;
