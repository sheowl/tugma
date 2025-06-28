import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppOnbStepOne from "../components/AppOnbStepOne";
import AppOnbStepTwo from "../components/AppOnbStepTwo";
import StepProgressFooter from "../components/StepProgressFooter";
import TugmaLogo from "../assets/TugmaLogo.svg";
import ApplicantWorkExpPopup from "../components/ApplicantWorkExpPopup";
import { fetchUserDetails, saveUserDetails } from "../services/userService";
import { supabase } from "../services/supabaseClient";

function ApplicantOnboarding() {
  const [step, setStep] = useState(1);
  const [segment, setSegment] = useState(1);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({
    contactDetails: {
      currentAddress: "",
      contactNumber: "",
      telephoneNumber: "",
    },
    educationDetails: {
      university: "",
      degree: "",
      yearGraduated: "",
    },
    field: "",
    preferred_worksetting: "",
    preferred_worktype: "",
  });
  const navigate = useNavigate();

  const totalSegments = step === 2 ? 10 : 3;

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) return;

      const res = await fetch(
        "http://localhost:8000/api/v1/applicants/onboarding-status",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await res.json();
      if (!data.needs_onboarding) {
        navigate("/applicantbrowsejobs");
      } else {
        // Load existing user details before showing onboarding
        const existingUserDetails = await fetchUserDetails();
        if (existingUserDetails) {
          setUserDetails(existingUserDetails);
        }
        setIsLoading(false); // Show onboarding form
      }
    };
    checkOnboardingStatus();
  }, [navigate]);

  const handleNextSegment = () => {
    if (step === 2 && segment === 10) {
      console.log("Redirecting to ApplicantProfile");
      navigate("/ApplicantProfile");
    } else if (segment < totalSegments) {
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
      setStep((prev) => prev - 1);
      setSegment(step === 2 ? 3 : 10);
    }
  };

  const handleSkipSegment = () => {
    if (step === 2 && segment === 10) {
      console.log("Redirecting to ApplicantProfile (Skip)");
      navigate("/ApplicantProfile");
    } else if (segment < totalSegments) {
      setSegment((prev) => prev + 1);
    } else {
      setSegment(1);
      setStep((prev) => prev + 1);
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

  const saveUserDetailsHandler = async (details) => {
    const success = await saveUserDetails(details);
    if (success) {
      console.log("User details saved successfully");
    } else {
      console.error("Failed to save user details");
    }
    return success;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-white">
      <div className="w-full h-[100px] pl-[112px] pt-[24px] pb-[24px] bg-white shadow-md z-10 relative">
        <img
          src={TugmaLogo}
          alt="Logo"
          className="w-40 h-16 sm:w-60 sm:h-20 md:w-[192px] md:h-[60px]"
        />
      </div>
      <div
        className="flex-grow px-4 bg-gray-50 flex flex-col items-center overflow-y-auto"
        style={{ height: "calc(100vh - 100px)" }}
      >
        {step === 1 && (
          <AppOnbStepOne
            step={step}
            segment={segment}
            onNext={handleNextSegment}
            onBack={handleBackSegment}
            onSkip={handleSkipSegment}
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            fetchUserDetails={fetchUserDetails}
            saveUserDetails={saveUserDetails}
          />
        )}
        {step === 2 && (
          <AppOnbStepTwo
            step={step}
            segment={segment}
            onNext={handleNextSegment}
            onBack={handleBackSegment}
            onSkip={handleSkipSegment}
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            saveUserDetails={saveUserDetails}
          />
        )}
      </div>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
            <ApplicantWorkExpPopup
              onSave={handleSaveWorkExperience}
              onCancel={() => {
                setShowPopup(false);
                setEditingExperience(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicantOnboarding;
