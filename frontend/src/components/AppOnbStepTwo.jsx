import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TechnicalSkills from "./TechnicalSkills";
import ApplicantCertPopup from "./ApplicantCertPopup";
import ApplicantCertCard from "./ApplicantCertCard";
import StepProgressFooter from "./StepProgressFooter";
import { flattenUserDetails, mapWorkSettingToEnum, mapWorkTypeToEnum } from "../utils/userUtils"; 
import { supabase } from "../services/supabaseClient";

// FIXED: Updated category map to match your segment titles exactly
const categoryMap = {
  "Web Development": 1,
  "Programming Languages": 2,
  "Databases": 3,
  "AI/ML and Data Science": 4, // Changed from "AI/ML/Data Science"
  "DevOps": 5,
  "Cybersecurity": 7,
  "Mobile Development": 8,
  "Soft Skills": 9,
};

function AppOnbStepTwo({ step, segment, onNext, onBack, onSkip, userDetails, setUserDetails, saveUserDetails }) {
  const [skills, setSkills] = useState([]);
  const [proficiency, setProficiency] = useState({});
  const [softSkillsTags, setSoftSkillsTags] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [workExperiences, setWorkExperiences] = useState([]); // FIXED: Added missing state
  const [showCertPopup, setShowCertPopup] = useState(false);
  const [preferredWorkSetting, setPreferredWorkSetting] = useState("");
  const [preferredWorkType, setPreferredWorkType] = useState("");
  const popupRef = useRef(null);
  const navigate = useNavigate();

  const handleAddCertification = (certification) => {
    if (certification) {
      setCertifications((prev) => [...prev, certification]);
    }
  };

  const handleDeleteCertification = (certification) => {
    setCertifications((prev) => prev.filter((cert) => cert !== certification));
  };

  // FIXED: Complete handleContinue function
  const handleContinue = async () => {
    try {
      // Update userDetails with latest work settings
      const updatedUserDetails = {
        ...userDetails,
        preferred_worksetting: mapWorkSettingToEnum(preferredWorkSetting),
        preferred_worktype: mapWorkTypeToEnum(preferredWorkType),
      };

      // Save main applicant info
      await saveUserDetails(flattenUserDetails(updatedUserDetails));

      // Save work experiences
      if (workExperiences && workExperiences.length > 0) {
        await saveWorkExperiences(workExperiences);
      }

      // Save certificates
      if (certifications && certifications.length > 0) {
        await saveCertificates(certifications);
      }

      // Save proficiency with proper validation
      if (proficiency && Object.keys(proficiency).length > 0) {
        const proficiencyArr = Object.entries(proficiency)
          .map(([category, value]) => {
            const categoryId = categoryMap[category];
            if (!categoryId) {
              console.warn(`Unknown category: ${category}`);
              return null;
            }
            return {
              category_id: Number(categoryId),
              proficiency: Number(value),
            };
          })
          .filter(
            (item) =>
              item &&
              Number.isInteger(item.category_id) &&
              item.category_id > 0 &&
              Number.isInteger(item.proficiency) &&
              item.proficiency > 0 &&
              item.proficiency <= 5 // Ensure proficiency is between 1-5
          );
        
        console.log("Proficiency to send:", proficiencyArr);
        
        if (proficiencyArr.length > 0) {
          await saveProficiency(proficiencyArr);
        }
      }

      onNext();
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      alert("Failed to save data. Please try again.");
    }
  };

  // FIXED: Added missing saveWorkExperiences function
  const saveWorkExperiences = async (workExperiences) => {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    if (!accessToken) throw new Error("No access token");

    for (const exp of workExperiences) {
      const response = await fetch("http://localhost:8000/api/v1/applicants/me/experience", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: exp.company,
          start_date: exp.start_date, // Ensure this matches your backend schema
          end_date: exp.end_date,
          description: exp.description,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to save work experience:", errorText);
        throw new Error("Failed to save work experience");
      }
    }
  };

  const saveCertificates = async (certifications) => {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    if (!accessToken) throw new Error("No access token");

    for (const cert of certifications) {
      const response = await fetch("http://localhost:8000/api/v1/applicants/me/certificates", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          certificate_name: cert.certificate_name || cert.name,
          certificate_description: cert.certificate_description || cert.description || "",
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to save certificate:", errorText);
        throw new Error("Failed to save certificate");
      }
    }
  };

  const saveProficiency = async (proficiencyArr) => {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    if (!accessToken) throw new Error("No access token");

    for (const prof of proficiencyArr) {
      const response = await fetch("http://localhost:8000/api/v1/applicants/me/proficiency", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_id: prof.category_id,
          proficiency: prof.proficiency,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to save proficiency:", errorText);
        throw new Error("Failed to save proficiency");
      }
    }
  };

  const handleSkip = () => {
    if (step === 2 && segment === 9) {
      setPreferredWorkSetting("");
      setPreferredWorkType("");
    }
    onSkip();
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

  function RadioGroup({ title, name, options, value, onChange, grid = false }) {
    return (
      <div className="w-[420px] bg-white rounded-[10px] shadow-all-around p-6 h-auto min-h-[240px] font-montserrat">
        <h1 className="text-2xl font-bold text-[#2A4D9B] p-6">{title}</h1>
        <div className={grid ? "grid grid-cols-2 gap-x-10 gap-y-2" : "flex flex-col space-y-2"}>
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2 text-base pl-6">
              <input
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={() => onChange(option)}
                className="accent-[#2A4D9B] w-5 h-5"
              />
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
                value={preferredWorkSetting}
                onChange={setPreferredWorkSetting}
              />
              <RadioGroup
                title="Preferred Work Type"
                name="workType"
                options={workTypes}
                value={preferredWorkType}
                onChange={setPreferredWorkType}
                grid
              />
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
            ref={popupRef}
            className="bg-[#E9EDF8] p-6 rounded-[20px] shadow-lg w-[600px] relative"
          >
            <button
              onClick={() => setShowCertPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <i className="bi bi-x-lg text-xl text-red-600"></i>
            </button>
            <ApplicantCertPopup
              onSave={(certification) => {
                handleAddCertification(certification);
                setShowCertPopup(false);
              }}
              onCancel={() => setShowCertPopup(false)}
            />
          </div>
        </div>
      )}

      <StepProgressFooter
        step={step}
        segment={segment}
        onContinue={handleContinue}
        onSkip={handleSkip}
      />
    </div>
  );
}

export default AppOnbStepTwo;
