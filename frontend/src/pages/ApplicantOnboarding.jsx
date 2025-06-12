import { useState } from "react";
import AppOnbStepOne from "../components/AppOnbStepOne";
import TugmaLogo from "../assets/TugmaLogo.svg";

function ApplicantOnboarding() {
  const [step, setStep] = useState(1); // Tracks the current step
  const [segment, setSegment] = useState(1); // Tracks the current segment within a step

  const handleNextSegment = () => {
    if (segment < 3) {
      setSegment((prev) => prev + 1); // Move to the next segment
    } else {
      setSegment(1); // Reset segment and move to the next step
      setStep((prev) => prev + 1);
    }
  };

  const handleBackSegment = () => {
    if (segment > 1) {
      setSegment((prev) => prev - 1); // Move to the previous segment
    } else if (step > 1) {
      setSegment(3); // Move to the last segment of the previous step
      setStep((prev) => prev - 1);
    }
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
    />
  </div>
</div>

  );
}

export default ApplicantOnboarding;
