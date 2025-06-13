import { useState, useEffect } from "react";
import JobCard from '../components/JobCard.jsx';
import EmployerSideBar from "../components/EmployerSideBar";
import SearchBar from "../components/SearchBar";
import JobNewPost from "../components/JobNewPost";
import Dropdown from "../components/Dropdown";

// --- Dropdown options for custom content ---
const sortOptions = [
  { label: "A - Z", value: "az" },
  { label: "Z - A", value: "za" },
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
];

const filterOptions = [
  {
    group: "By Modality",
    options: [
      { label: "On-site", value: "on-site" },
      { label: "Hybrid", value: "hybrid" },
      { label: "Remote", value: "remote" },
    ],
  },
  {
    group: "By Work Type",
    options: [
      { label: "Full-Time", value: "full-time" },
      { label: "Contractual", value: "contractual" },
      { label: "Part-Time", value: "part-time" },
      { label: "Internship", value: "internship" },
    ],
  },
  {
    group: "By Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Archived", value: "archived" },
    ],
  },
];

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
  const [selectedSort, setSelectedSort] = useState(sortOptions[0].value);
  const [selectedModality, setSelectedModality] = useState(null);
  const [selectedWorkType, setSelectedWorkType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
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
        status: "Archived",
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

  // --- Custom dropdown content for Sort ---
  const sortContent = (
    <div className="flex flex-col">
      {sortOptions.map(opt => (
        <div
          key={opt.value}
          className={`p-2 cursor-pointer rounded transition-colors text-[14px] font-opensans ${
            selectedSort === opt.value ? "bg-[#FF8032] text-white" : ""
          }`}
          onClick={() => setSelectedSort(opt.value)}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );

  const selectedOptionStyle = { backgroundColor: "#FF80321A", color: "#FF8032" };


  const filterContent = (
    <div className="p-4 w-80 text-[14px] font-semibold grid grid-cols-2 gap-2">
      <div className="flex flex-col gap-24 items-start">
        <div className="font-semibold text-[#6B7280] mb-1 mt-2">By Modality</div>
        <div className="font-semibold text-[#6B7280] mb-1 mt-0">By Work Type</div>
        <div className="font-semibold text-[#6B7280] mb-1 mt-10">By Status</div>
      </div>
      <div className="flex flex-col gap-1 justify-start items-start">
        {/* By Modality */}
        {filterOptions[0].options.map(opt => (
          <div
            key={opt.value}
            className="p-1 mt-1 rounded cursor-pointer transition-colors"
            style={selectedModality === opt.value ? selectedOptionStyle : {}}
            data-selected={selectedModality === opt.value}
            onClick={() => setSelectedModality(selectedModality === opt.value ? null : opt.value)}
          >
            {opt.label}
          </div>
        ))}
        <div className="h-2" />
        {/* By Work Type */}
        {filterOptions[1].options.map(opt => (
          <div
            key={opt.value}
            className="p-1 mt-1 rounded cursor-pointer transition-colors"
            style={selectedWorkType === opt.value ? selectedOptionStyle : {}}
            data-selected={selectedWorkType === opt.value}
            onClick={() => setSelectedWorkType(selectedWorkType === opt.value ? null : opt.value)}
          >
            {opt.label}
          </div>
        ))}
        <div className="h-2" />
        {/* By Status */}
        {filterOptions[2].options.map(opt => (
          <div
            key={opt.value}
            className="p-1 mt-1 rounded cursor-pointer transition-colors"
            style={selectedStatus === opt.value ? selectedOptionStyle : {}}
            data-selected={selectedStatus === opt.value}
            onClick={() => setSelectedStatus(selectedStatus === opt.value ? null : opt.value)}
          >
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FF8032] flex items-start overflow-hidden">
      <EmployerSideBar />
      <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-2 sm:p-4 md:p-6 shadow-md w-full max-w-full">
        {/* Custom Header */}
        <div className="flex justify-between items-center p-4 pl-[112px] pr-[118px]">
          {/* Left Section */}
          <div>
            <h1 className="text-[48px] font-bold text-[#FF8032] mb-1 mt-8">Manage Postings</h1>
            <p className="text-[22px] text-[#FF8032] font-semibold">
              Jobs Posted: <span className="italic">{jobPosts.length}</span>
            </p>
          </div>
          {/* Right Section */}
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#FF8032]/20 block"></span>
            <div className="flex flex-col">
              <span className="text-[#FF8032] font-bold text-[18px] leading-tight">Company Name</span>
              <span className="text-[#FF8032] italic text-[13px] leading-tight">Company/Business Type</span>
            </div>
          </div>
        </div>

        {/* SearchBar placed after the header */}
        <div className="px-[112px] mt-6 mb-2 flex gap-4 items-center">
          <div className="flex-1">
            <SearchBar
              mode="employer"
              onSearch={(query) => console.log("Employer Search:", query)}
            />
          </div>
        </div>

        {/* Sort and Filter Dropdowns */}
        <div className="flex justify-end items-center px-[112px] pr-[118px] text-[16px] font-semibold gap-4 mt-8 -mb-8">
          <Dropdown
            label="Sort by"
            customContent={sortContent}
            width="w-40"
            color="#FF8032"
          />
          <Dropdown
            label="Filter by"
            customContent={filterContent}
            width="w-80"
            color="#FF8032"
          />
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