import React, { useState } from "react";
import TechnicalSkills from "./TechnicalSkills";

function AppOnbStepTwo({ step, segment, onNext, onBack }) {
  const [skills, setSkills] = useState([]);
  const [proficiency, setProficiency] = useState({});
  const [softSkillsTags, setSoftSkillsTags] = useState([]); // Define state for soft skills tags

  // Tags for different categories
  const programmingLanguageTags = [
    "Python", "Java", "JavaScript", "C++", "C#", "Go",
    "Rust", "PHP", "TypeScript", "Ruby", "Kotlin", "Swift", "R", "Bash/Shell"
  ];

  const webDevelopmentTags = [
    "HTML", "CSS", "Tailwind CSS", "React", "Vue", 
    "Next",  "Svelte", "Express",  "Bootstrap", "Angular"
  ];

  const aiMlDataScienceTags = [
    "TensorFlow", "PyTorch", "NumPy","Keras", "Pandas",
    "Scikit-learn", "Jupyter Notebooks", "Matplotlib/Seaborn",
    "OpenCV", "Natural Language Processing", "Model Deployment (e.g., ONNX)"
  ];

  const databaseTags = [
    "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Cassandra", "DynamoDB" ,
    "Redis","Firebase"
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

  return (
    <div className="w-full h-screen font-montserrat overflow-hidden relative">
      <main className="pt-[80px] px-[112px]">
        {/* === Step 2: Segment 1 === */}
        {step === 2 && segment === 1 && (
          <div className="flex flex-col items-center space-y-10">
            {/* Header Section */}
            <div className="relative w-full mb-4">
              <button
                onClick={onBack}
                className="absolute left-0 top-0 flex items-center text-[#2A4D9B] hover:text-[#16367D] font-medium"
              >
                <i className="bi bi-arrow-left mr-2 text-4xl"></i>
              </button>
              <h2 className="text-4xl text-[#2A4D9B] font-bold text-center max-w-[1088px] mx-auto">
                Select your programming language skills and specify your proficiency level.
              </h2>
            </div>

            {/* Segment 1 Content */}
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

        {/* === Step 2: Segment 2 === */}
        {step === 2 && segment === 2 && (
          <div className="flex flex-col items-center space-y-10">
            {/* Header Section */}
            <div className="relative w-full mb-4">
              <button
                onClick={onBack}
                className="absolute left-0 top-0 flex items-center text-[#2A4D9B] hover:text-[#16367D] font-medium"
              >
                <i className="bi bi-arrow-left mr-2 text-4xl"></i>
              </button>
              <h2 className="text-4xl text-[#2A4D9B] font-bold text-center max-w-[1088px] mx-auto">
                Select your web development skills and specify your proficiency level.
              </h2>
            </div>

            {/* Segment 2 Content */}
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

        {/* === Step 2: Segment 3 === */}
        {step === 2 && segment === 3 && (
          <div className="flex flex-col items-center space-y-10">
            {/* Header Section */}
            <div className="relative w-full mb-4">
              <button
                onClick={onBack}
                className="absolute left-0 top-0 flex items-center text-[#2A4D9B] hover:text-[#16367D] font-medium"
              >
                <i className="bi bi-arrow-left mr-2 text-4xl"></i>
              </button>
              <h2 className="text-4xl text-[#2A4D9B] font-bold text-center max-w-[1088px] mx-auto">
                Select your AI/ML and data science skills and specify your proficiency level.
              </h2>
            </div>

            {/* Segment 3 Content */}
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

        {/* === Step 2: Segment 4 === */}
        {step === 2 && segment === 4 && (
          <div className="flex flex-col items-center space-y-10">
            {/* Header Section */}
            <div className="relative w-full mb-4">
              <button
                onClick={onBack}
                className="absolute left-0 top-0 flex items-center text-[#2A4D9B] hover:text-[#16367D] font-medium"
              >
                <i className="bi bi-arrow-left mr-2 text-4xl"></i>
              </button>
              <h2 className="text-4xl text-[#2A4D9B] font-bold text-center max-w-[1088px] mx-auto">
                Select your database skills and specify your proficiency level.
              </h2>
            </div>

            {/* Segment 4 Content */}
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

        {/* === Step 2: Segment 5 === */}
        {step === 2 && segment === 5 && (
          <div className="flex flex-col items-center space-y-10">
            {/* Header Section */}
            <div className="relative w-full mb-4">
              <button
                onClick={onBack}
                className="absolute left-0 top-0 flex items-center text-[#2A4D9B] hover:text-[#16367D] font-medium"
              >
                <i className="bi bi-arrow-left mr-2 text-4xl"></i>
              </button>
              <h2 className="text-4xl text-[#2A4D9B] font-bold text-center max-w-[1088px] mx-auto">
                Select your DevOps skills and specify your proficiency level.
              </h2>
            </div>

            {/* Segment 5 Content */}
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

        {/* === Step 2: Segment 6 === */}
        {step === 2 && segment === 6 && (
          <div className="flex flex-col items-center space-y-10">
            {/* Header Section */}
            <div className="relative w-full mb-4">
              <button
                onClick={onBack}
                className="absolute left-0 top-0 flex items-center text-[#2A4D9B] hover:text-[#16367D] font-medium"
              >
                <i className="bi bi-arrow-left mr-2 text-4xl"></i>
              </button>
              <h2 className="text-4xl text-[#2A4D9B] font-bold text-center max-w-[1088px] mx-auto">
                Select your cybersecurity skills and specify your proficiency level.
              </h2>
            </div>

            {/* Segment 6 Content */}
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
        {/* === Step 2: Segment 7 === */}  
        {step === 2 && segment === 7 && (
          <div className="flex flex-col items-center space-y-10">
            {/* Header Section */}
            <div className="relative w-full mb-4">
              <button
                onClick={onBack}
                className="absolute left-0 top-0 flex items-center text-[#2A4D9B] hover:text-[#16367D] font-medium"
              >
                <i className="bi bi-arrow-left mr-2 text-4xl"></i>
              </button>
              <h2 className="text-4xl text-[#2A4D9B] font-bold text-center max-w-[1088px] mx-auto">
                Select your technical skills using tags and specify your proficiency level for each.
              </h2>
            </div>

            {/* Segment 7 Content */}
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

        {/* === Step 2: Segment 8 === */}  
        {step === 2 && segment === 8 && (
          <div className="flex flex-col items-center space-y-10">
            {/* Header Section */}
            <div className="relative w-full mb-4">
              <button
                onClick={onBack}
                className="absolute left-0 top-0 flex items-center text-[#2A4D9B] hover:text-[#16367D] font-medium"
              >
                <i className="bi bi-arrow-left mr-2 text-4xl"></i>
              </button>
              <h2 className="text-4xl text-[#2A4D9B] font-bold text-center max-w-[1088px] mx-auto">
                Select your soft skills and specify your proficiency level.
              </h2>
            </div>

            {/* Segment 8 Content */}
            <TechnicalSkills
              title="Soft Skills"
              skills={softSkillsTags}
              setSkills={setSoftSkillsTags} // Pass the state setter
              tags={softSkillsTagsList}
              showProficiency={false} // Soft skills don't require proficiency
            />
          </div>
        )}

        
      </main>
    </div>
  );
}

export default AppOnbStepTwo;