import React, { useState } from 'react';
import SoftwareDev from '../assets/SoftwareDev.png';
import DataScience from '../assets/DataScience.png';
import CyberSec from '../assets/CyberSec.png';
import Infrastructure from '../assets/Infrastructure.png';
import UIUX from '../assets/UIUX.png';
import AIML from '../assets/AIML.png';
import ApplicantWorkExp from './ApplicantWorkExp';

function AppOnbStepOne({ step, segment, onNext, onBack }) {
  const [selectedField, setSelectedField] = useState(null);
  const [showWorkExpForm, setShowWorkExpForm] = useState(false);


  const handleCardClick = (field) => {
    setSelectedField(field);
  };

  const handleContinue = () => {
    if (selectedField) {
      console.log('Selected Field:', selectedField); // Pass this value to the next step
      onNext(selectedField);
    } else {
      alert('Please select a field before continuing.');
    }
  };

  // Define card data for Segment 2
  const cardOptions = [
    { title: 'Software Development', image: SoftwareDev, value: 'Software Development' },
    { title: 'Infrastructure & System', image: Infrastructure, value: 'Infrastructure & System' },
    { title: 'AI & ML', image: AIML, value: 'AI and Machine Learning' },
    { title: 'Data Science', image: DataScience, value: 'Data Science' },
    { title: 'Cybersecurity', image: CyberSec, value: 'Cybersecurity' },
    { title: 'UI/UX', image: UIUX, value: 'UI/UX' },
  ];

  return (
    <div className="w-full h-screen font-montserrat overflow-hidden relative">
      <main className="pt-[80px] px-[112px]">
        {/* === Step 1: Segment 1 === */}
        {step === 1 && segment === 1 && (
          <div className="flex flex-col items-center space-y-10">
            {/* === Header Text === */}
            <div className="relative w-full">
              {/* Back Button */}
              

              {/* Header Text */}
              <div className="text-center">
                <h2 className="text-4xl text-[#2A4D9B] font-bold mb-[10px]">Let's get you started, User!</h2>
                <p className="text-base text-gray-600">Answer a few questions and start setting up your profile</p>
              </div>
            </div>

            {/* === Segment 1 Content === */}
            <div className="grid grid-cols-2 gap-10 font-montserrat">
              {/* Contact Details */}
              <div className="mt-[74px] mb-[70px] bg-white w-[560px] p-8 px-10 rounded-2xl shadow-all-around border space-y-5">
                <h3 className="text-2xl font-bold text-[#2A4D9B]">Contact Details</h3>
                <div className="space-y-2">
                  <label className="text-base font-semibold text-gray-500">Current Address</label>
                  <input className="w-full h-[50px] border border-gray-400 rounded-lg p-2" />
                </div>
                <div className="space-y-2">
                  <label className="text-base font-semibold text-gray-500">Contact Number</label>
                  <input className="w-full h-[50px] border border-gray-400 rounded-lg p-2" />
                </div>
                <div className="space-y-2">
                  <label className="text-base font-semibold text-gray-500">Telephone Number</label>
                  <input className="w-full h-[50px] border border-gray-400 rounded-lg p-2" />
                </div>
              </div>

              {/* Educational Background */}
              <div className="mt-[74px] mb-[70px] bg-white w-[560px] p-8 px-10 rounded-2xl shadow-all-around border space-y-5">
                <h3 className="text-2xl font-bold text-[#2A4D9B]">Educational Background</h3>
                <div className="space-y-2">
                  <label className="text-base font-semibold text-gray-500">University</label>
                  <input className="w-full h-[50px] border border-gray-400 rounded-lg p-2" />
                </div>
                <div className="space-y-2">
                  <label className="text-base font-semibold text-gray-500">Degree</label>
                  <input className="w-full h-[50px] border border-gray-400 rounded-lg p-2" />
                </div>
                <div className="space-y-2">
                  <label className="text-base font-semibold text-gray-500">Year Graduated</label>
                  <input className="w-full h-[50px] border border-gray-400 rounded-lg p-2" />
                </div>
              </div>
            </div>

            {/* === Footer Progress and Button === */}
            <div className="flex justify-between items-center w-full mt-12">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Step 1 of 2</p>
                <div className="flex gap-2">
                  {[1, 2].map((s) => (
                    <div
                      key={s}
                      className={`h-2 w-8 rounded-full ${
                        segment >= s ? 'bg-[#2A4D9B]' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={onNext}
                className="w-[192px] px-6 py-3 bg-[#2A4D9B] text-white font-medium rounded-md hover:bg-[#1f3d7a]"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* === Step 1: Segment 2 === */}
        {step === 1 && segment === 2 && (
          <div className="flex flex-col items-center space-y-10">
            {/* === Header Text === */}
            <div className="relative w-full mb-4">
              {/* Back Button */}
              <button
                onClick={onBack}
                className="absolute left-0 top-1/3 transform -translate-y-1/2 flex items-center text-[#2A4D9B] hover:text-[#16367D] font-medium"
              >
                <i className="bi bi-arrow-left mr-2 text-4xl"></i>
              </button>

              {/* Header Text */}
              <h2 className="text-4xl text-[#2A4D9B] font-bold text-center">Select the field you belong to</h2>
              <p className="text-base text-gray-600 text-center">Answer a few questions and start setting up your profile</p>
            </div>

            {/* === Segment Cards === */}
            <div className="grid grid-cols-3 gap-10 font-montserrat">
              {cardOptions.map((card) => (
                <div
                  key={card.value}
                  onClick={() => handleCardClick(card.value)}
                  className={`bg-white max-w-[200px] h-[250px] p-8 px-10 rounded-2xl shadow-all-around border cursor-pointer 
                    flex flex-col items-center justify-center space-y-5 text-center
                    ${selectedField === card.value ? 'border-[#2A4D9B]' : 'border-gray-200'}
                  `}
                >
                  <img src={card.image} alt={card.title} className="mx-auto" />
                  <span className="text-lg font-semibold text-[#2A4D9B]">{card.title}</span>
                </div>
              ))}
            </div>

            {/* === Footer Progress and Button === */}
            <div className="flex justify-between items-center w-full mt-12">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Step 1 of 2</p>
                <div className="flex gap-2">
                  {[1, 2].map((s) => (
                    <div
                      key={s}
                      className={`h-2 w-8 rounded-full ${
                        segment >= s ? 'bg-[#2A4D9B]' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={handleContinue}
                className="w-[192px] px-6 py-3 bg-[#2A4D9B] text-white font-medium rounded-md hover:bg-[#1f3d7a]"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* === Step 1: Segment 3 === */}
        {step === 1 && segment === 3 && (
          <div className="flex flex-col items-center space-y-10">
            {/* === Header Text === */}
            <div className="relative w-full mb-4">
              {/* Back Button */}
              <button
                onClick={onBack}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center text-[#2A4D9B] hover:text-[#16367D] font-medium"
              >
                <i className="bi bi-arrow-left mr-2 text-4xl"></i>
              </button>

              {/* Header Text */}
              <h2 className="text-4xl text-[#2A4D9B] font-bold text-center">Tell us about your experience</h2>
              <p className="text-base text-gray-600 text-center">Provide details about your work experience and skills</p>
            </div>

            {/* === Segment 3 Content === */}
            <div className="flex flex-row gap-10 font-montserrat">
              {/* Work Experience */}
              <div
                onClick={() => setShowWorkExpForm(true)}
                className="mt-[50px] mb-[70px w-[560px] h-[425px] p-8 px-10 rounded-2xl border border-dashed border-gray-400 space-y-5
                    flex flex-col items-center justify-center cursor-pointer hover:shadow-all-around transition-all"
                >
                <div className="flex flex-row items-center justify-center space-x-4">
                    <i className="bi bi-plus-circle text-2xl text-[#2A4D9B]" />
                    <h3 className="text-2xl font-bold text-[#2A4D9B] text-center">Add work experience</h3>
                </div>
            </div>
                    {showWorkExpForm && (
        <div className="w-full">
            <ApplicantWorkExp />
        </div>
        )}



            </div>

            {/* === Footer Progress and Button === */}
            <div className="flex justify-between items-center w-full mt-12">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Step 1 of 2</p>
                <div className="flex gap-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-2 w-8 rounded-full ${
                        segment >= s ? 'bg-[#2A4D9B]' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={onNext}
                className="w-[192px] px-6 py-3 bg-[#2A4D9B] text-white font-medium rounded-md hover:bg-[#1f3d7a]"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AppOnbStepOne;
