import ApplicantSideBar from "../components/ApplicantSideBar";
import { useState, useEffect } from "react";
import ApplicantHeader from "../components/ApplicantHeader";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";

function ApplicantProfile() {
  const { user, loading } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [zoomedCertificate, setZoomedCertificate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeField, setActiveField] = useState(""); 
  
  const [linkValues, setLinkValues] = useState({
    github: "",
    linkedin: "",
    portfolio: "",
  });

  const [profileImage, setProfileImage] = useState(
  localStorage.getItem("profileImage") || null
);

const handleProfileImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem("profileImage", reader.result); // Persist image
    };
    reader.readAsDataURL(file);
  }
};

const handleRemoveImage = () => {
  setProfileImage(null);
  localStorage.removeItem("profileImage");
};


  const getButtonClass = (field) => {
  if (!isEditMode) {
    // Always solid when not editing
    return "bg-[#2A4D9B] text-white border border-[#2A4D9B] transition-all duration-300 ease-in-out";
  }
  // Edit mode: solid if filled, dashed if not
  const isFilled = linkValues[field];
  return `${
    isFilled
      ? "bg-[#2A4D9B] text-white border border-[#2A4D9B]"
      : "bg-white text-[#2A4D9B] border border-dashed border-[#2A4D9B]"
  } transition-all duration-300 ease-in-out`;
};


  const truncate = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

 const ProgressBar = ({ label, level, tags = [] }) => {
    const getSkillLevel = () => {
      switch (level.toLowerCase()) {
        case "novice":
          return 20;
        case "advanced beginner":
          return 40;
        case "competent":
          return 60;
        case "proficient":
          return 80;
        case "expert":
          return 100;
        default:
          return 0;
      }
    };

    const numericLevel = getSkillLevel();

    return (
      <div className="mb-4 space-y-2">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-semibold text-base text-neutral-600">{label}</h4>
          <span className="text-sm text-gray-500 capitalize">{level}</span>
        </div>
        <div className="w-full h-[10px] bg-[#E9EDF8] rounded-full">
          <div
            className="h-full bg-[#2A4D9B] rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${numericLevel}%` }}
          ></div>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs text-neutral-700 font-semibold bg-[#EFEEEE] py-1 px-3 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

const CertificateCard = ({ image, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="min-w-[218px] min-h-[290px] max-w-[218px] rounded-lg border border-gray-300 p-4 shadow-sm hover:border-[#6B7280] 
      transition-transform duration-300 ease-in-out flex flex-col items-center text-center cursor-pointer"
    >
      <div className="w-full min-h-[110px] bg-[#D9D9D9] rounded-md mb-4 overflow-hidden">
        {image && (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        )}
      </div>
      <h3 className="font-semibold text-base text-neutral-700">
        {title.length > 20 ? `${title.slice(0, 20)}...` : title}
      </h3>
      <p className="text-xs text-gray-500 mt-2">
        {description.length > 140 ? `${description.slice(0, 140)}...` : description}
      </p>
    </div>
  );
};



  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setIsLoadingProfile(true);

      // Example: Fetch from your backend API
      const token = (await supabase.auth.getSession()).data.session.access_token;
      const res = await fetch("http://localhost:8000/api/v1/applicants/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.status !== 200) setProfile(null);
      else setProfile(data);

      setIsLoadingProfile(false);
    };

    if (user) fetchProfile();
  }, [user]);

  if (loading || isLoadingProfile) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Map profile fields to your layout
  const contactInfo = [
    { label: "Full Name", value: (profile?.first_name || "") + " " + (profile?.last_name || "") },
    { label: "Location", value: profile?.current_address || "" },
    { label: "Contact Number", value: profile?.contact_number || "" },
    { label: "Email", value: profile?.applicant_email || "" },
  ];

  const personalInfoLeft = [
    { label: "Name", value: (profile?.first_name || "") + " " + (profile?.last_name || "") },
    { label: "Mobile Number", value: profile?.contact_number || "" },
    { label: "University", value: profile?.university || "" },
    { label: "Year Graduated", value: profile?.year_graduated || "" },
  ];

  const personalInfoRight = [
    { label: "Address", value: profile?.current_address || "" },
    { label: "Telephone Number", value: profile?.telephone_number || "" },
    { label: "Degree", value: profile?.degree || "" },
    { label: "Field", value: profile?.field || "" },
  ];

  const experienceData = [
    {
      title: "Senior Graphic Designer",
      company: "Canva Philippines",
      date: "JANUARY 2024 - MAY 2025",
      responsibilities: [
        "Ano kanina pa ako nakababad dito oh? Baka pwede mo namang...huy ano raw?",
        "Ganto pala tong laro na to? naka...ay may hamaliway...",
        "Kyle huwag naman tayong ganito oh...pag-usapan naman natin to pls...",
      ],
    },
  ];

  const technicalSkills = [
    { label: "Programming Languages", level: "novice", tags: ["JavaScript", "Python", "Java"] },
    { label: "Web Development", level: "Advanced beginner", tags: ["HTML", "CSS", "React"] },
    { label: "AI/ML/Data Science", level: "competent", tags: ["TensorFlow", "PyTorch", "Pandas"] },
    { label: "Database", level: "proficient", tags: ["MySQL", "MongoDB", "PostgreSQL"] },
    { label: "DevOps", level: "expert", tags: ["Docker", "Kubernetes", "CI/CD"] },
    { label: "Cybersecurity", level: "expert", tags: ["Network Security", "Penetration Testing", "Cryptography"] },
    { label: "Mobile Development", level: "novice", tags: ["Flutter", "React Native", "Dart"] },
  ];

  const softSkills = [
    { label: "Communication"},
    { label: "Teamwork" },
    { label: "Problem Solving" }, 
  ];

  const certificates = [
  {
    title: "Title of Certificate",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
    image: "", // Add a URL to certificate image if available
  },
];
  {/* HARD CODED INFORMATION ENDS HERE */}

  return (
    <div className="min-h-screen bg-[#2A4D9B] flex items-start overflow-hidden">
      <ApplicantSideBar />

      {/* Main Content Area */}
      <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-6 shadow-md font-montserrat">
        {/* Header */}
        <ApplicantHeader
            title="User Profile"
            showProfile={false}
            showSearchBar={false}
          />

        {/* Profile Content */}
        <div className="flex flex-col space-y-7 justify-center items-center w-full">
          <div className="relative w-full max-w-[976px] h-[220px] rounded-[20px] shadow-all-around flex items-center gap-8 bg-white p-10">
          {/* Edit Icon */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {isEditMode && (
              <span className="text-sm font-semibold text-gray-500]">
                In Edit Mode
              </span>
            )}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="text-gray-500 hover:text-[#2A4D9B]"
              title={isEditMode ? "Exit Edit Mode" : "Edit Profile"}
            >
              <i className="bi bi-pencil-square text-xl" />
            </button>
          </div>

            {/* Profile Picture */}
            <div className="relative flex-shrink-0">
            {isEditMode ? (
              <>
              <label className="cursor-pointer relative block">
                <div className="w-[150px] h-[150px] rounded-full border border-gray-600 overflow-hidden flex items-center justify-center bg-white">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="bi bi-person-fill text-7xl text-gray-500"></i>
                  )}
                </div>

                {/* Upload icon */}
                <div className="absolute bottom-0 right-2 w-8 h-8 bg-white border border-[#2A4D9B] rounded-full flex items-center justify-center text-[#2A4D9B] text-xl">
                  <i className="bi bi-plus"></i>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </label>

               {/* Delete button (only if image exists) */}
              {profileImage && (
                <button
                  onClick={handleRemoveImage}
                  title="Remove Photo"
                  className="absolute top-2 right-2 bg-red-500 border border-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-100"
                >
                  <i className="bi bi-x" />
                </button>
              )

              }
              </>
            ) : (
              <div className="w-[150px] h-[150px] rounded-full border border-gray-600 overflow-hidden flex items-center justify-center bg-white">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="bi bi-person-fill text-7xl text-gray-500"></i>
                )}
              </div>
            )}

          </div>

            {/* Profile Info */}
            <div className="flex flex-col justify-center flex-grow">
              <h2 className="text-2xl font-bold">{contactInfo[0].value}</h2>
              {contactInfo.slice(1).map((info, index) => (
                <div key={index} className="text-gray-600 flex items-center gap-2 mt-1">
                  <i
                    className={`bi ${
                      info.label === "Location"
                        ? "bi-geo-alt"
                        : info.label === "Contact Number"
                        ? "bi-telephone"
                        : "bi-envelope"
                    }`}
                  ></i>
                  {info.value}
                </div>
              ))}


              {/* Buttons */}
              <div className="flex gap-4 mt-4">
                <button
                  className={`${getButtonClass("github")} px-4 py-2 rounded-md flex items-center gap-2`}
                  onClick={() => {
                    if (isEditMode) {
                      setActiveField("github"); // or "linkedin", "portfolio"
                      setIsModalOpen(true);
                    } else {
                      const url = linkValues.github;
                      if (url) window.open(url.startsWith("http") ? url : `https://${url}`, "_blank");
                    }
                  }}
                >
                  <i className="bi bi-github"></i> GitHub
                </button>


                <button
                  className={`${getButtonClass("linkedin")} px-4 py-2 rounded-md flex items-center gap-2`}
                  onClick={() => {
                    if (isEditMode) {
                      setActiveField("linkedin"); // or "linkedin", "portfolio"
                      setIsModalOpen(true);
                    } else {
                      const url = linkValues.linkedin;
                      if (url) window.open(url.startsWith("http") ? url : `https://${url}`, "_blank");
                    }
                  }}
                >
                  <i className="bi bi-linkedin"></i> LinkedIn
                </button>

                <button
                  className={`${getButtonClass("portfolio")} px-4 py-2 rounded-md flex items-center gap-2`}
                  onClick={() => {
                    if (isEditMode) {
                      setActiveField("portfolio"); // or "linkedin", "portfolio"
                      setIsModalOpen(true);
                    } else {
                      const url = linkValues.portfolio;
                      if (url) window.open(url.startsWith("http") ? url : `https://${url}`, "_blank");
                    }
                  }}
                >
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

              {experienceData.map((exp, index) => (
                <div key={index} className="border-l-1 border-[#2A4D9B] pl-6 mb-6">
                  <div className="flex flex-row justify-between">
                    <div className="text-base text-neutral-700 font-semibold">
                      {exp.title}
                    </div>
                    <div className="text-gray-500 text-sm font-semibold">
                      {exp.date}
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm font-semibold">
                    {exp.company}
                  </div>
                  <ul className="text-gray-500 text-xs list-disc pl-6">
                    {exp.responsibilities.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <hr className="border-t border-gray-300 my-4" />

              <div className="text-xl font-semibold text-neutral-700">Technical Skills</div>
                <div className="mt-4 space-y-4">
                  {technicalSkills.map((skill, index) => (
                    <ProgressBar
                      key={index}
                      label={skill.label}
                      level={skill.level}
                      tags={skill.tags || []}
                    />
                  ))}
                </div>

              <hr className="border-t border-gray-300 my-4" />

              <div className="text-xl font-semibold text-neutral-700">Soft Skills</div>
                <div className="flex flex-wrap gap-2 mt-2">
                {softSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs text-neutral-700 font-semibold bg-[#EFEEEE] py-1 px-3 rounded-full"
                  >
                    {skill.label}
                  </span>
                ))}
                </div>
            </div>
          </div>

          <div className="w-full max-w-[976px] h-auto rounded-[20px] shadow-all-around bg-white p-10 overflow-visible">
            <div className="text-2xl font-bold text-neutral-700 mb-8">Certifications</div>
            <div className="flex flex-row gap-6 justify-start overflow-x-auto overflow-visible relative">
              {certificates.map((cert, idx) => (
              <CertificateCard
                key={idx}
                title={cert.title}
                description={cert.description}
                image={cert.image}
                onClick={() => setZoomedCertificate(cert)}
              />
            ))}
            </div>
          </div>

      </div>
    </div>
    
    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            Link to your {activeField.charAt(0).toUpperCase() + activeField.slice(1)} Profile
          </h2>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#2A4D9B]"
            placeholder={`https://${activeField}.com/yourusername`}
            value={linkValues[activeField]}
            onChange={(e) =>
              setLinkValues({ ...linkValues, [activeField]: e.target.value })
            }
          />
          <div className="flex justify-end gap-2">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-[#2A4D9B] text-white px-4 py-2 rounded-md"
              onClick={() => {
                console.log(`${activeField} saved:`, linkValues[activeField]);
                setIsModalOpen(false);
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )}
=  </div>
  );
}
export default ApplicantProfile;