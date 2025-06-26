import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import ApplicantSideBar from '../components/ApplicantSideBar';
import Card from '../components/Card';
import ApplicantDashLogo from '../assets/ApplicantDashLogo.svg';
import JobDetailsDrawer from '../components/JobDetailsDrawer';
import SearchBar from '../components/SearchBar';
import Dropdown from '../components/Dropdown';
import ApplicantNotification from '../components/ApplicantNotification';

function ApplicantBrowseJobs() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedModality, setSelectedModality] = useState(null);
    const [selectedWorkType, setSelectedWorkType] = useState(null);
    const [selectedSort, setSelectedSort] = useState("ascending"); // <-- ADD THIS
    const [sortedData, setSortedData] = useState([]);
    const navigate = useNavigate();

    // Auth check: redirect if not logged in
    useEffect(() => {
        // You can check for "access_token", "user", or whatever you use for auth
        if (!localStorage.getItem("access_token")) {
            navigate("/applicant-sign-in", { replace: true });
        }
    }, [navigate]);

     const sampleData = [
  { title: "Some Job Here", company: "Company Name Here", status: "Accepted", timeAgo: "3 hours ago" },
  { title: "Junior Web Developer", company: "Kim Satrjt PH", status: "Rejected", timeAgo: "8 hours ago" },
  { title: "Job Title", company: "Company Name", status: "Waitlisted", timeAgo: "3 hours ago" },
  
];

    // Simulate fetching first name from a database
    useEffect(() => {
        const fetchFirstName = async () => {
            // Simulate a delay for fetching data
            setTimeout(() => {
                setFirstName("Julianna Leila"); // Mock name
            }, 1000);
        };

        fetchFirstName();
    }, []);

    // Mock job data
    const mockJobData = [
        {
            id: 1,
            jobTitle: "UI/UX Designer",
            companyName: "Creative Minds Inc.",
            location: "Sta Mesa, Manila",
            matchScore: 67,
            workSetup: "Hybrid",
            employmentType: "Contractual",
            description: "We are looking for a talented UI/UX Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills, and be able to translate high-level requirements into interaction flows and artifacts. You will be responsible for designing the overall functionality of the product and ensuring a great user experience. Responsibilities include collaborating with product managers and developers, creating wireframes, prototypes, and user flows, and conducting user research to refine designs.",
            salaryRangeLow: 35,
            salaryRangeHigh: 45,
            salaryFrequency: "Monthly",
            availablePositions: 2,
            companyDescription: "Creative Minds Inc. is a leading design agency specializing in creating innovative and user-friendly digital experiences for clients worldwide. With a team of highly skilled designers and developers, we aim to transform complex ideas into visually stunning and functional designs. Our mission is to empower businesses by delivering cutting-edge solutions that enhance user engagement and satisfaction.",
            tags: [
                { label: "Figma", matched: true },
                { label: "Adobe XD", matched: true },
                { label: "Wireframing", matched: true },
                { label: "Prototyping", matched: false },
            ],
            socialLinks: [
                { url: "https://linkedin.com/company/creativeminds", icon: "bi-linkedin", label: "LinkedIn" },
                { url: "https://github.com/creativeminds", icon: "bi-github", label: "GitHub" },
            ],
        },
        {
            id: 2,
            jobTitle: "Frontend Developer",
            companyName: "TechNova Corp.",
            location: "Quezon City, Manila",
            matchScore: 72,
            workSetup: "Remote",
            employmentType: "Full-time",
            description: "TechNova Corp. is seeking a skilled Frontend Developer to join our dynamic team. You will be responsible for implementing visual elements that users see and interact with in a web application. Your role will involve translating UI/UX design wireframes into actual code, ensuring the technical feasibility of designs, and optimizing applications for maximum speed and scalability. You will collaborate with backend developers and designers to bridge the gap between graphical design and technical implementation. Proficiency in React, JavaScript, and CSS is required.",
            salaryRangeLow: 40,
            salaryRangeHigh: 60,
            salaryFrequency: "Monthly",
            availablePositions: 1,
            companyDescription: "TechNova Corp. is a technology-driven company focused on delivering cutting-edge software solutions to businesses across the globe. Our expertise lies in building scalable, secure, and efficient applications tailored to meet the unique needs of our clients. At TechNova, we foster a culture of innovation and collaboration, empowering our team to push the boundaries of technology and deliver exceptional results.",
            tags: [
                { label: "React", matched: true },
                { label: "JavaScript", matched: true },
                { label: "CSS", matched: true },
                { label: "TypeScript", matched: false },
            ],
            socialLinks: [
                { url: "https://linkedin.com/company/technova", icon: "bi-linkedin", label: "LinkedIn" },
                { url: "https://facebook.com/technova", icon: "bi-facebook", label: "Facebook" },
                { url: "https://instagram.com/technova", icon: "bi-instagram", label: "Instagram" },
            ],
        },
        {
            id: 3,
            jobTitle: "Backend Developer",
            companyName: "CodeWorks Inc.",
            location: "Makati City, Manila",
            matchScore: 80,
            workSetup: "On-Site",
            employmentType: "Part-Time",
            description: "We are looking for a Backend Developer to join our growing team. You will be responsible for managing the interchange of data between the server and the users. Your primary focus will be the development of all server-side logic, definition, and maintenance of the central database, and ensuring high performance and responsiveness to requests from the frontend. You will also be responsible for integrating the frontend elements built by your coworkers into the application. A strong understanding of Node.js, Express, and database technologies like MongoDB is required.",
            salaryRangeLow: 50,
            salaryRangeHigh: 70,
            salaryFrequency: "Monthly",
            availablePositions: 5,
            companyDescription: "CodeWorks Inc. specializes in backend development and API integrations, helping businesses scale their digital infrastructure efficiently. With a strong focus on performance and reliability, we deliver robust solutions that power mission-critical systems. Our team of experienced engineers is dedicated to creating seamless integrations and ensuring the scalability of your digital ecosystem.",
            tags: [
                { label: "Node.js", matched: true },
                { label: "Express", matched: true },
                { label: "MongoDB", matched: true },
                { label: "GraphQL", matched: false },
            ],
            socialLinks: [
                { url: "https://github.com/codeworks", icon: "bi-github", label: "GitHub" },
                { url: "https://linkedin.com/company/codeworks", icon: "bi-linkedin", label: "LinkedIn" },
            ],
        },
        {
            id: 4,
            jobTitle: "Frontend Developer",
            companyName: "CodeWorks Inc.",
            location: "Makati City, Manila",
            matchScore: 39,
            workSetup: "On-Site",
            employmentType: "Part-Time",
            description: "CodeWorks Inc. is hiring a Frontend Developer to create engaging and user-friendly web interfaces. You will work closely with designers and backend developers to implement responsive designs and ensure seamless user experiences. Responsibilities include developing new user-facing features, building reusable code and libraries for future use, and optimizing applications for maximum speed and scalability. Proficiency in modern frontend frameworks like React or Vue.js, along with a strong understanding of HTML, CSS, and JavaScript, is required.",
            salaryRangeLow: 38,
            salaryRangeHigh: 50,
            salaryFrequency: "Monthly",
            availablePositions: 2,
            companyDescription: "CodeWorks Inc. is a trusted partner for frontend development, delivering responsive and user-friendly interfaces for web applications. Our team is passionate about crafting intuitive designs and seamless user experiences. By leveraging the latest technologies and best practices, we ensure that our clients' applications stand out in a competitive digital landscape.",
            tags: [
                { label: "Node.js", matched: true },
                { label: "Express", matched: true },
                { label: "MongoDB", matched: true },
                { label: "GraphQL", matched: false },
            ],
            socialLinks: [
                { url: "https://facebook.com/codeworks", icon: "bi-facebook", label: "Facebook" },
                { url: "https://instagram.com/codeworks", icon: "bi-instagram", label: "Instagram" },
                { url: "https://t.me/codeworks", icon: "bi-telegram", label: "Telegram" },
            ],
        },
    ];

    // Dropdown options for filtering
    const filterOptions = [
        { label: "On-Site", value: "On-Site" },
        { label: "Hybrid", value: "Hybrid" },
        { label: "Remote", value: "Remote" },
    ];

    const statusOptions = [
        { label: "Full-Time", value: "Full-time" },
        { label: "Contractual", value: "Contractual" },
        { label: "Part-Time", value: "Part-Time" },
        { label: "Internship", value: "Internship" },
    ];

    const sortOptions = [
        { label: "Ascending Match Score", value: "ascending" },
        { label: "Descending Match Score", value: "descending" },
    ];

    // Sort and filter the data whenever filters or sort options change
    useEffect(() => {
        let filtered = [...mockJobData];

        // Apply modality filter
        if (selectedModality) {
            filtered = filtered.filter((job) => job.workSetup === selectedModality);
        }

        // Apply work type filter
        if (selectedWorkType) {
            filtered = filtered.filter((job) => job.employmentType === selectedWorkType);
        }

        // Apply sorting
        const sorted = filtered.sort((a, b) => {
            if (selectedSort === "ascending") {
                return a.matchScore - b.matchScore; // Ascending order
            } else if (selectedSort === "descending") {
                return b.matchScore - a.matchScore; // Descending order
            }
            return 0;
        });

        setSortedData(sorted); // Update the sorted and filtered data
    }, [selectedSort, selectedModality, selectedWorkType]);

    const filteredJobs = useMemo(() => {
        if (!searchQuery.trim()) {
            return sortedData;
        }

        const searchTerm = searchQuery.toLowerCase().trim();

        return sortedData.filter(job => {
            return (
                job.jobTitle.toLowerCase().includes(searchTerm) ||
                job.companyName.toLowerCase().includes(searchTerm)
            );
        });
    }, [searchQuery, sortedData]);

    return (
        <div className="min-h-screen bg-[#2A4D9B] flex items-start">
            {/* Sidebar */}
            <ApplicantSideBar />

            {/* Main Content */}
            <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-6 shadow-md font-montserrat">
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
                                Welcome Back, {firstName}!
                            </div>
                            <div className="font-semibold italic text-orange-400 text-xl">
                                Ready to make meets end?
                            </div>
                        </div>
                    </div>

                     <div className="flex items-center gap-4">
                        <i className="bi bi-person-circle text-4xl text-gray-400"></i>
                        <div className="leading-tight pl-3">
                            <div className="font-semibold text-black text-sm">{firstName}</div>
                        </div>
                       <i
                        className="bi bi-bell text-2xl text-[#2A4D9B] ml-6 cursor-pointer position-relative"
                        onClick={() => setShowNotifications((prev) => !prev)}
                        ></i>

                    </div>
                </div>
                
                {showNotifications && (
                    <div className="absolute top-[120px] right-[50px] z-50">
                        <ApplicantNotification
                        open={showNotifications}
                        onClose={() => setShowNotifications(false)}
                        notification={sampleData}
                        onViewDetails={(notif) => {
                            console.log("View notif details:", notif);
                            setShowNotifications(false);
                        }}
                        />
                    </div>
                    )}
                

                {/* Search Bar and Dropdowns */}
                <div className="px-[112px] mt-0 mb-5 flex justify-between items-center">
                    <SearchBar 
    onSearch={(query) => {
        setSearchQuery(query);
        console.log("Applicant Search:", query);
    }}
    value={searchQuery}
    onChange={(query) => setSearchQuery(query)}
/>
                </div>

                {/* Job Count */}
                <div className="pl-[112px] pr-[118px]">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-base font-semibold text-gray-500 mb-2">
                            {filteredJobs.length} matches displayed
                        </div>
                        <div className="flex gap-4">
                            <Dropdown
                                label="Sort by"
                                customContent={
                                    <div className="flex flex-col">
                                        {sortOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                className={`p-2 cursor-pointer rounded transition-colors text-[14px] font-opensans ${
                                                    selectedSort === option.value
                                                        ? "bg-[#2A4D9B] text-white"
                                                        : ""
                                                }`}
                                                onClick={() => setSelectedSort(option.value)}
                                            >
                                                {option.label}
                                            </div>
                                        ))}
                                    </div>
                                }
                                width="w-40"
                                color="#2A4D9B"
                            />
                            <Dropdown
                                label="Filter by"
                                customContent={
                                    <div className="p-4 w-80 text-[14px] font-semibold grid grid-cols-2 gap-2">
                                        <div className="flex flex-col gap-6 items-start">
                                            <div className="font-semibold text-[#6B7280] mb-1 mt-2">
                                                By Modality
                                            </div>
                                            <div className="h-12" />
                                            <div className="font-semibold text-[#6B7280] mb-1">
                                                By Work Type
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 justify-start items-start">
                                            {filterOptions.map((opt) => (
                                                <div
                                                    key={opt.value}
                                                    className={`p-1 mt-1 rounded cursor-pointer transition-colors ${
                                                        selectedModality === opt.value
                                                            ? "bg-[#2A4D9B] text-white"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        setSelectedModality(
                                                            selectedModality === opt.value
                                                                ? null
                                                                : opt.value
                                                        )
                                                    }
                                                >
                                                    {opt.label}
                                                </div>
                                            ))}
                                            <div className="h-2" />
                                            {statusOptions.map((opt) => (
                                                <div
                                                    key={opt.value}
                                                    className={`p-1 rounded cursor-pointer transition-colors ${
                                                        selectedWorkType === opt.value
                                                            ? "bg-[#2A4D9B] text-white"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        setSelectedWorkType(
                                                            selectedWorkType === opt.value
                                                                ? null
                                                                : opt.value
                                                        )
                                                    }
                                                >
                                                    {opt.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                }
                                width="w-72"
                                color="#2A4D9B"
                            />
                        </div>
                    </div>
                    <hr className="border-t-2 border-[#000000]/20" />
                </div>

                {/* Job Cards */}
                <div className="pl-[112px] pr-[118px] mt-10 mb-10 flex flex-wrap gap-[33px] justify-center">
                    {filteredJobs.map((job) => (
                        <Card
                            key={job.id}
                            jobTitle={job.jobTitle}
                            companyName={job.companyName}
                            location={job.location}
                            matchScore={job.matchScore}
                            workSetup={job.workSetup}
                            employmentType={job.employmentType}
                            description={job.description}
                            salaryRangeLow={job.salaryRangeLow}
                            salaryRangeHigh={job.salaryRangeHigh}
                            tags={job.tags} // Pass tags here
                            onViewDetails={() => {
                                console.log("Selected Job:", job); // Debugging
                                setSelectedJob(job);
                                setDrawerOpen(true);
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Job Details Drawer */}
            <JobDetailsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                job={selectedJob}
                onApply={() => alert("Applied!")}
            />
        </div>
    );
}

export default ApplicantBrowseJobs;
