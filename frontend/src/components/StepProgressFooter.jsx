export default function StepProgressFooter({ step, segment, onContinue, onSkip }) {
  const totalSegments = step === 2 ? 10 : 3;

  const handleContinue = () => {
    if (step === 2 && segment === 10) {
      console.log("Redirecting to ApplicantProfile"); // Debugging
      onSkip(); // Redirect to ApplicantProfile
    } else {
      onContinue(); // Call the provided onContinue function for other steps/segments
    }
  };

  return (
    <div className="flex justify-between items-center w-full mt-12 px-[112px]">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          Step {step} of 2
        </p>
        <div className="flex gap-2">
          {Array.from({ length: totalSegments }, (_, index) => index + 1).map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full ${
                segment >= s ? "bg-[#2A4D9B]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        {step === 2 && (
          <button
            onClick={onSkip}
            className="w-[192px] px-6 py-3 text-[#2A4D9B] font-bold rounded-md hover:bg-[#E9EDF8]"
          >
            Skip
          </button>
        )}
        <button
          onClick={handleContinue} // Use the updated handleContinue function
          className="w-[192px] px-6 py-3 bg-[#2A4D9B] text-white font-bold rounded-md hover:bg-[#1f3d7a]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}