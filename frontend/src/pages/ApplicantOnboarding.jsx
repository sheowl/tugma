import { useState } from "react";
import AppOnbStepOne from "../components/AppOnbStepOne";
import TugmaLogo from "../assets/TugmaLogo.svg";
import ApplicantWorkExpPopup from "../components/ApplicantWorkExpPopup";
import { fetchUserDetails, saveUserDetails } from "../services/userService";

function ApplicantOnboarding() {
  const [step, setStep] = useState(1);
  const [segment, setSegment] = useState(1);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const handleNextSegment = () => {
    if (segment < 3) {
      setSegment((prev) => prev + 1);
    } else {
      setSegment(1);
      setStep((prev) => prev + 1);
    }
  };

  const handleBackSegment = () => {
    if (segment > 1) {
      setSegment((prev) => prev - 1);
    } else if (step > 1) {
      setSegment(3);
      setStep((prev) => prev - 1);
    }
  };

  const handleSaveWorkExperience = (workExperience) => {
    console.log("Adding Work Experience:", workExperience);
    setWorkExperiences((prev) => [...prev, workExperience]);
    setShowPopup(false);
  };

  const handleEditWorkExperience = (workExperience) => {
    console.log("Editing Work Experience:", workExperience);
    setEditingExperience(workExperience);
    setShowPopup(true);
  };

  const handleDeleteWorkExperience = (workExperience) => {
    console.log("Deleting Work Experience:", workExperience);
    setWorkExperiences((prev) => prev.filter((exp) => exp !== workExperience));
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Header */}
      <div className="w-full h-[100px] pl-[112px] pt-[24px] pb-[24px] bg-white shadow-md z-10 relative">
        <img
          src={TugmaLogo}
          alt="Logo"
          className="w-40 h-16 sm:w-60 sm:h-20 md:w-[192px] md:h-[60px]"
        />
      </div>

      {/* Onboarding content (fills remaining space) */}
      <div
        className="flex-grow px-4 bg-gray-50 flex justify-center items-start overflow-y-auto"
        style={{ height: "calc(100vh - 100px)" }} // subtract header height
      >
        <AppOnbStepOne
          step={step}
          segment={segment}
          onNext={handleNextSegment}
          onBack={handleBackSegment}
          fetchUserDetails={() => fetchUserDetails(true)} // Use mock data
          saveUserDetails={(data) => saveUserDetails(data, true)} // Use mock save
        />
      </div>

      {/* Work Experience Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
            <ApplicantWorkExpPopup
              onSave={handleSaveWorkExperience} // Pass the onSave function
              onCancel={() => {
                setShowPopup(false);
                setEditingExperience(null); // Reset editing state
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicantOnboarding;
