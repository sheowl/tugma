import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import TechnicalSkills from "./TechnicalSkills";
import ApplicantCertPopup from "./ApplicantCertPopup";
import ApplicantCertCard from "./ApplicantCertCard";
import StepProgressFooter from "./StepProgressFooter";

function AppOnbStepTwo({ step, segment, onBack }) {
  const [skills, setSkills] = useState([]);
  const [proficiency, setProficiency] = useState({});
  const [softSkillsTags, setSoftSkillsTags] = useState([]);
  const [certifications, setCertifications] = useState([]); // State for certifications
  const [showCertPopup, setShowCertPopup] = useState(false); // State for showing the popup
  const popupRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleAddCertification = (certification) => {
    if (certification) {
      setCertifications((prev) => [...prev, certification]);
    }
  };

  const handleDeleteCertification = (certification) => {
    setCertifications((prev) => prev.filter((cert) => cert !== certification));
  };

  const handleContinue = () => {
    if (step === 2 && segment === 10) {
      console.log("Navigating to ApplicantProfile"); // Debugging
      navigate("/ApplicantProfile"); // Redirect to ApplicantProfile
    }
  };

  const programmingLanguageTags = [
    "Python", "Java", "JavaScript", "C++", "C#", "Go",
    "Rust", "PHP", "TypeScript", "Ruby", "Kotlin", "Swift", "R", "Bash/Shell"
  ];

  const webDevelopmentTags = [
    "HTML", "CSS", "Tailwind CSS", "React", "Vue", 
    "Next", "Svelte", "Express", "Bootstrap", "Angular"
  ];

  const aiMlDataScienceTags = [
    "TensorFlow", "PyTorch", "NumPy", "Keras", "Pandas",
    "Scikit-learn", "Jupyter Notebooks", "Matplotlib/Seaborn",
    "OpenCV", "Natural Language Processing", "Model Deployment (e.g., ONNX)"
  ];

  const databaseTags = [
    "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Cassandra",
    "DynamoDB", "Redis", "Firebase"
  ];

  const devOpsTags = [
    "AWS", "Docker", "Apache", "Microsoft Azure",
    "Kubernetes", "Terraform", "NGINX",
    "Google Cloud Platform (GCP)", "Linux Server Management", "CI/CD (GitHub Actions, Jenkins, etc.)"
  ];

  const cybersecurityTags = [
    "Penetration Testing", "Metasploit", "OWASP Top 10", 
    "Wireshark", "Security Auditing", "Network Security", "SIEM (e.g., Splunk)"
  ];

  const mobileDevelopmentTags = [
    "React Native", "Flutter", "Android (Java/Kotlin)", "iOS (Swift)", "Dart"
  ];

  const softSkillsTagsList = [
    "Communication", "Leadership", "Team Collaboration", "Time Management",
    "Problem Solving", "Adaptability", "Critical Thinking"
  ];

  const Header = () => (
    <div className="relative w-full mb-4">
      <button
        onClick={onBack}
        className="absolute left-0 top-0 flex items-center text-[#2A4D9B] hover:text-[#16367D] font-medium"
      >
        <i className="bi bi-arrow-left mr-2 text-4xl"></i>
      </button>
      <div className="flex justify-center">
        <div className="text-center max-w-[1088px]">
          <h2 className="text-4xl text-[#2A4D9B] font-bold mb-[10px]">
            Select your technical skills using tags and specify your proficiency level for each.
          </h2>
          <p className="text-base text-gray-600">
            Answer a few questions and start setting up your profile
          </p>
        </div>
      </div>
    </div>
  );

  const workSettings = ["Hybrid", "Remote", "On-Site"];
  const workTypes = ["Part-Time", "Full-Time", "Contractual", "Internship"];

  function RadioGroup({ title, name, options, grid = false }) {
    return (
      <div className="w-[420px] bg-white rounded-[10px] shadow-all-around p-6 h-auto min-h-[240px] font-montserrat">
        <h1 className="text-2xl font-bold text-[#2A4D9B] p-6">{title}</h1>
        <div className={grid ? "grid grid-cols-2 gap-x-10 gap-y-2" : "flex flex-col space-y-2"}>
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2 text-base pl-6">
              <input type="radio" name={name} value={option} className="accent-[#2A4D9B] w-5 h-5" />
              {option}
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen font-montserrat overflow-hidden relative">
      <main className="pt-[80px] px-[112px]">
        {step === 2 && segment === 1 && (
          <div className="flex flex-col items-center space-y-10">
            <Header />
            <TechnicalSkills
              title="Programming Languages"
              skills={skills}
              setSkills={setSkills}
              tags={programmingLanguageTags}
              selectedProficiency={proficiency}
              setProficiency={setProficiency}
            />
          </div>
        )}

        {step === 2 && segment === 2 && (
          <div className="flex flex-col items-center space-y-10">
            <Header />
            <TechnicalSkills
              title="Web Development"
              skills={skills}
              setSkills={setSkills}
              tags={webDevelopmentTags}
              selectedProficiency={proficiency}
              setProficiency={setProficiency}
            />
          </div>
        )}

        {step === 2 && segment === 3 && (
          <div className="flex flex-col items-center space-y-10">
            <Header />
            <TechnicalSkills
              title="AI/ML and Data Science"
              skills={skills}
              setSkills={setSkills}
              tags={aiMlDataScienceTags}
              selectedProficiency={proficiency}
              setProficiency={setProficiency}
            />
          </div>
        )}

        {step === 2 && segment === 4 && (
          <div className="flex flex-col items-center space-y-10">
            <Header />
            <TechnicalSkills
              title="Databases"
              skills={skills}
              setSkills={setSkills}
              tags={databaseTags}
              selectedProficiency={proficiency}
              setProficiency={setProficiency}
            />
          </div>
        )}

        {step === 2 && segment === 5 && (
          <div className="flex flex-col items-center space-y-10">
            <Header />
            <TechnicalSkills
              title="DevOps"
              skills={skills}
              setSkills={setSkills}
              tags={devOpsTags}
              selectedProficiency={proficiency}
              setProficiency={setProficiency}
            />
          </div>
        )}

        {step === 2 && segment === 6 && (
          <div className="flex flex-col items-center space-y-10">
            <Header />
            <TechnicalSkills
              title="Cybersecurity"
              skills={skills}
              setSkills={setSkills}
              tags={cybersecurityTags}
              selectedProficiency={proficiency}
              setProficiency={setProficiency}
            />
          </div>
        )}

        {step === 2 && segment === 7 && (
          <div className="flex flex-col items-center space-y-10">
            <Header />
            <TechnicalSkills
              title="Mobile Development"
              skills={skills}
              setSkills={setSkills}
              tags={mobileDevelopmentTags}
              selectedProficiency={proficiency}
              setProficiency={setProficiency}
            />
          </div>
        )}

        {step === 2 && segment === 8 && (
          <div className="flex flex-col items-center space-y-10">
            <Header />
            <TechnicalSkills
              title="Soft Skills"
              skills={softSkillsTags}
              setSkills={setSoftSkillsTags}
              tags={softSkillsTagsList}
              showProficiency={false}
            />
          </div>
        )}

        {step === 2 && segment === 9 && (
          <div className="flex flex-col items-center space-y-10">
            <Header />
            <div className="flex flex-row gap-6 justify-center items-center">
              <RadioGroup
                title="Preferred Work Settings"
                name="workSettings"
                options={workSettings}
              />
                <RadioGroup title="Preferred Work Type" 
                name="workType" 
                options={workTypes} 
                grid />

             </div>
          </div>
        )}

        {step === 2 && segment === 10 && (
          <div className="flex flex-col items-center space-y-10">
            <Header />
            <div
              onClick={() => setShowCertPopup(true)}
              className="mt-[74px] mb-[140px] flex-shrink-0 w-[416px] h-[200px] p-8 px-10 rounded-2xl border border-dashed border-gray-400 space-y-5
                  flex flex-col items-center justify-center cursor-pointer hover:shadow-all-around transition-all"
            >
              <div className="flex flex-row items-center justify-center space-x-4">
                <i className="bi bi-plus-circle text-2xl text-[#2A4D9B]" />
                <h3 className="text-2xl font-bold text-[#2A4D9B] text-center">Add Certification</h3>
              </div>
            </div>

            <div className="flex flex-row gap-6 mt-[74px] mb-[70px]">
              {certifications.map((certification, index) => (
                <ApplicantCertCard
                  key={index}
                  certification={certification}
                  onDelete={handleDeleteCertification}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Popup Component */}
      {showCertPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={popupRef} // Attach the ref to the popup container
            className="bg-[#E9EDF8] p-6 rounded-[20px] shadow-lg w-[600px] relative"
          >
            <button
              onClick={() => setShowCertPopup(false)} // Close popup on click
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <i className="bi bi-x-lg text-xl text-red-600"></i>
            </button>
            <ApplicantCertPopup
              onSave={(certification) => {
                handleAddCertification(certification);
                setShowCertPopup(false); // Close popup after saving
              }}
              onCancel={() => setShowCertPopup(false)} // Close popup on cancel
            />
          </div>
        </div>
      )}


    </div>
  );
}

export default AppOnbStepTwo;
