import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployerSideBar from '../components/EmployerSideBar';
import ApplicantDashLogo from '../assets/ApplicantDashLogo.svg';

const CompanyPage = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({
    name: 'Tugma Solutions Inc.',
    location: 'Makati City, Metro Manila, Philippines',
    type: 'Information Technology & Services',
    description: 'Tugma Solutions Inc. is a leading provider of innovative IT solutions, specializing in software development, cloud computing, and cybersecurity. Our mission is to empower businesses through technology and deliver exceptional value to our clients. With a passionate team and a culture of excellence, we have served over 200 clients worldwide.',
    logo: null // Add logo to company data
  });

  const [socialLinks, setSocialLinks] = useState({
    linkedin: 'https://linkedin.com/company/tugma-solutions',
    instagram: 'https://instagram.com/tugmasolutions',
    github: 'https://github.com/tugmasolutions',
    telegram: 'https://t.me/tugmasolutions',
    viber: '' // Empty - won't show
  });

  const socialPlatforms = [
    { key: 'linkedin', name: 'LinkedIn', icon: 'bi-linkedin' },
    { key: 'instagram', name: 'Instagram', icon: 'bi-instagram' },
    { key: 'facebook', name: 'Facebook', icon: 'bi-facebook' },
    { key: 'github', name: 'GitHub', icon: 'bi-github' },
    { key: 'telegram', name: 'Telegram', icon: 'bi-telegram' },
    { key: 'viber', name: 'Viber', icon: 'bi-whatsapp' }
  ];

  const activeSocialPlatforms = socialPlatforms.filter(platform => 
    socialLinks[platform.key] && socialLinks[platform.key].trim() !== ''
  );

  const handleEditProfile = () => {
    // localStorage.setItem('companyData', JSON.stringify({
    //   companyData,
    //   socialLinks
    // }));
    navigate('/edit-company-profile');
  };

  // Load saved data when component mounts
  // useEffect(() => {
  //   const savedData = localStorage.getItem('companyData');
  //   if (savedData) {
  //     const { companyData: savedCompanyData, socialLinks: savedSocialLinks } = JSON.parse(savedData);
  //     setCompanyData(savedCompanyData);
  //     setSocialLinks(savedSocialLinks);
  //   }
  // }, []);

  return (
    <div className="min-h-screen bg-[#FF8032] flex items-start overflow-hidden">
      <EmployerSideBar />
      <div className="flex-1 h-screen bg-[#FEFEFF] rounded-tl-[40px] overflow-y-auto p-2 sm:p-4 md:p-6 shadow-md w-full max-w-full">        
        <div className="flex justify-between items-center p-4 pl-[112px] pr-[118px] mt-8">
          <div className="flex items-center gap-8">
            <img 
              src={ApplicantDashLogo} 
              alt="Dashboard Logo" 
              className="w-[136px] h-[84px]"
            />
            <h1 className="text-[48px] font-bold text-[#FF8032] -mb-1">Company Profile</h1>
          </div>
        </div>        
          
        {/* Content */}
        <main className="flex-1 px-8 pb-8 mt-16">
          <div className="max-w-6xl mx-auto">            
            {/* Company Profile Section */}
            <div className="bg-white border-2 rounded-3xl shadow-xl p-16 mb-6">
              <div className="flex gap-8 items-start">
                {/* Left side - Company Logo and Info stacked vertically */}
                <div className="flex flex-col items-center text-center space-y-6 flex-shrink-0">                  
                {/* Company Logo */}
                  <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {companyData.logo ? (
                      <img 
                        src={companyData.logo} 
                        alt="Company Logo" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <i className="bi bi-building text-gray-500 text-5xl"></i>
                    )}
                  </div>                  
                {/* Company Info */}
                  <div>
                    <h2 className="text-[24px] font-semibold text-[#3C3B3B] mb-2 truncate max-w-[300px]" title={companyData.name}>{companyData.name}</h2>
                    <p className="text-[#6C6C6C] text-[16px] font-semibold mb-1">{companyData.location}</p>
                    <p className="text-[#3C3B3B] text-[15px] font-bold">{companyData.type}</p>
                  </div>
                </div>

                {/* Right side - Company Description */}
                <div className="flex-1 ml-8">
                  <h3 className="text-[24px] font-semibold text-[#3C3B3B] mb-3 mt-8">Company Description</h3>
                  <p className="text-[#676767] text-[16px] font-semibold leading-relaxed">
                    {companyData.description}
                  </p>
                </div>
              </div>
            </div>            
            {/* Company Links Section */}
            <div className="bg-white items-center border-2 rounded-3xl shadow-xl p-8 mb-6">              
              <h3 className="text-[24px] font-semibold text-[#3C3B3B] mb-4">Company Links</h3>
              {activeSocialPlatforms.length > 0 ? (
                <div className="flex gap-4 flex-wrap justify-center">
                  {activeSocialPlatforms.map((platform) => (
                    <button 
                      key={platform.key}
                      onClick={() => window.open(socialLinks[platform.key], '_blank')}
                      className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-[40px] hover:bg-gray-800 transition-colors"
                    >
                      <i className={`bi ${platform.icon}`}></i>
                      {platform.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>No social media links added yet.</p>
                  <p className="text-sm mt-2">Click "Edit Profile" to add your company's social media links.</p>
                </div>
              )}
            </div>
            {/* Edit Profile Button */}
              <div className="flex justify-end mt-6">
                <button 
                  onClick={handleEditProfile}
                  className="text-[#FF8032] text-[16px] px-6 py-2 rounded-lg hover:text-[#E66F24] hover:underline transition-colors font-semibold"
                >
                  Edit Profile
                </button>
              </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyPage;
