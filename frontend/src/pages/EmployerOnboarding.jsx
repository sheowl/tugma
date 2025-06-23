import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployerOnboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    companySize: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (value) => {
    setFormData(prev => ({
      ...prev,
      companySize: value
    }));
  };

  const handleContinue = () => {
    // Here you would typically validate the form and send data to backend
    console.log('Form data:', formData);
    // Navigate to next step or employer dashboard
    navigate('/employerhomepage');
  };

  const companySizeOptions = [
    { value: 'just-me', label: "It's just me" },
    { value: 'micro', label: 'Micro' },
    { value: 'small', label: 'Small Corporation' },
    { value: 'medium', label: 'Medium Corporation' },
    { value: 'large', label: 'Large Corporation' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">         
      <div className="bg-[#F9F9F9] shadow-lg min-h-[128px]">
        <div className="w-full px-0">
          <div className="flex justify-start items-center">
            <div className="flex items-center mt-10 ml-[112px]">
              <img src="/src/assets/TugmaLogo.svg" alt="Tugma" className="w-48 h-15" style={{width: '192px', height: '60px'}} />
            </div>
          </div>
        </div>
      </div>      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-[36px] font-bold text-[#FF8032] mb-2">
            Let's get you hiring
          </h1>
          <p className="text-[16px] text-[#3C3B3B] font-semibold">
            Answer a few questions to start posting jobs and finding the right candidates.
          </p>
        </div>            {/* Form Card */}
        <div className="bg-[#FEFEFF] rounded-[24px] shadow-2xl mx-auto border border-gray-100" style={{width: '1152px', height: '438px'}}>
          <h2 className="text-[24px] font-bold text-[#FF8032] mb-10 mt-4 text-center">
            Company Information
          </h2>
          
          <div className="grid grid-cols-2 gap-36">
            {/* Left Side - Location and Description */}
            <div className="space-y-8 ml-16">
              {/* Location Field */}
              <div>
                <label className="block text-[16px] font-semibold text-[#3C3B3B] mb-3">
                  Location of the Company
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-[#6B7280] rounded-[8px] focus:ring-2 focus:ring-[#FF8032] focus:border-[#FF8032] outline-none transition-colors text-[14px]"
                  placeholder=""
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-[14px] font-semibold text-[#3C3B3B] mb-3">
                  Brief Description of the Company
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-4 py-3 border-2 border-[#6B7280] rounded-[8px] focus:ring-2 focus:ring-[#FF8032] focus:border-[#FF8032] outline-none transition-colors resize-none text-[14px]"
                  placeholder=""
                />
              </div>
            </div>

            {/* Right Side - Company Size */}
            <div>
              <label className="block text-[16px] font-semibold text-[#3C3B3B] mb-6">
                How many people are in your company?
              </label>
              <div className="space-y-5">
                {companySizeOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center cursor-pointer group"
                    onClick={() => handleRadioChange(option.value)}
                  >
                    <input
                      type="radio"
                      name="companySize"
                      value={option.value}
                      checked={formData.companySize === option.value}
                      onChange={() => handleRadioChange(option.value)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                      formData.companySize === option.value
                        ? 'border-[#FF8032] bg-white'
                        : 'border-[#D1D5DB] bg-white group-hover:border-[#FF8032]'
                    }`}>
                      {formData.companySize === option.value && (
                        <div className="w-4 h-4 rounded-full bg-[#FF8032]"></div>
                      )}
                    </div>
                    <span className={`text-[14px] text-[#3C3B3B] font-semibold transition-colors ${
                      formData.companySize === option.value
                        ? 'text-[#374151]'
                        : 'text-[#374151] group-hover:text-[#FF8032]'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button - Outside the form */}
        <div className="flex justify-end max-w-4xl mx-auto mt-8">
          <button
            onClick={handleContinue}
            className="bg-[#FF8032] hover:bg-[#e6722d] text-white font-semibold px-8 py-3 rounded-[8px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF8032] focus:ring-offset-2 text-[14px]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployerOnboarding;
