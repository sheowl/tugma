import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployerSideBar from '../components/EmployerSideBar';
import ApplicantDashLogo from '../assets/ApplicantDashLogo.svg';

const EditCompanyPage = () => {
  const navigate = useNavigate();
    const [companyData, setCompanyData] = useState({
    name: 'Company Name',
    location: 'Company Location',
    type: 'Company Type',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    logo: null // Add logo to company data
  });

  const [socialUrls, setSocialUrls] = useState({
    linkedin: '',
    instagram: '',
    facebook: '',
    github: '',
    telegram: '',
    viber: ''
  });

  const [socialLinks, setSocialLinks] = useState({
    linkedin: false,
    instagram: false,
    facebook: false,
    github: false,
    telegram: false,
    viber: false
  });
  // Load existing company data when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('companyData');
    if (savedData) {
      const { companyData: savedCompanyData, socialLinks: savedSocialLinks } = JSON.parse(savedData);
      setCompanyData(savedCompanyData);
      setSocialUrls(savedSocialLinks);
      
      // Set socialLinks based on which URLs exist
      const activeSocialLinks = {};
      Object.keys(savedSocialLinks).forEach(key => {
        activeSocialLinks[key] = savedSocialLinks[key] && savedSocialLinks[key].trim() !== '';
      });
      setSocialLinks(activeSocialLinks);
      
      // Set original data only once when loading saved data
      setOriginalData(savedCompanyData);
      setOriginalLinks(activeSocialLinks);
      setOriginalUrls(savedSocialLinks);
    } else {
      // If no saved data, set original data to current default values
      setOriginalData(companyData);
      setOriginalLinks(socialLinks);
      setOriginalUrls(socialUrls);
    }
  }, []);

  const [showPopup, setShowPopup] = useState(null);
  const [tempUrl, setTempUrl] = useState('');

  const [originalData, setOriginalData] = useState({});
  const [originalLinks, setOriginalLinks] = useState({});
  const [originalUrls, setOriginalUrls] = useState({});
  const hasChanges = () => {
    return JSON.stringify(companyData) !== JSON.stringify(originalData) ||
           JSON.stringify(socialLinks) !== JSON.stringify(originalLinks) ||
           JSON.stringify(socialUrls) !== JSON.stringify(originalUrls);
  };
  const handleInputChange = (field, value) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCompanyData(prev => ({
            ...prev,
            logo: e.target.result
          }));
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file.');
      }
    }
  };

  const handleLogoClick = () => {
    document.getElementById('logoInput').click();
  };
  const toggleSocialLink = (platform) => {
    if (socialLinks[platform]) {
      // Remove the link
      setSocialLinks(prev => ({
        ...prev,
        [platform]: false
      }));
      setSocialUrls(prev => ({
        ...prev,
        [platform]: ''
      }));
    } else {
      // Show popup to add link
      setShowPopup(platform);
      setTempUrl(socialUrls[platform] || '');
    }
  };

  const handleAddLink = () => {
    if (tempUrl.trim()) {
      setSocialLinks(prev => ({
        ...prev,
        [showPopup]: true
      }));
      setSocialUrls(prev => ({
        ...prev,
        [showPopup]: tempUrl.trim()
      }));
    }
    setShowPopup(null);
    setTempUrl('');
  };

  const handleCancelPopup = () => {
    setShowPopup(null);
    setTempUrl('');
  };  const handleSave = () => {
    if (hasChanges()) {
      // Save changes to localStorage
      const updatedData = {
        companyData,
        socialLinks: socialUrls // Save the URLs, not the boolean flags
      };
      localStorage.setItem('companyData', JSON.stringify(updatedData));
      
      console.log('Saving changes...', companyData, socialUrls);
      // Navigate back to company page after saving
      navigate('/CompanyPage');
    }
  };
  const handleCancel = () => {
    setCompanyData(originalData);
    setSocialLinks(originalLinks);
    setSocialUrls(originalUrls);
    setShowPopup(null);
    setTempUrl('');
    // Navigate back to company page
    navigate('/CompanyPage');
  };

  const socialPlatforms = [
    { key: 'linkedin', name: 'LinkedIn', icon: 'bi-linkedin' },
    { key: 'instagram', name: 'Instagram', icon: 'bi-instagram' },
    { key: 'facebook', name: 'Facebook', icon: 'bi-facebook' },
    { key: 'github', name: 'GitHub', icon: 'bi-github' },
    { key: 'telegram', name: 'Telegram', icon: 'bi-telegram' },
    { key: 'viber', name: 'Viber', icon: 'bi-whatsapp' }
  ];

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
                  <div className="w-[150px] h-[150px] bg-gray-300 rounded-full flex items-center justify-center relative cursor-pointer" 
                    onClick={handleLogoClick}>
                    {companyData.logo ? (
                      <img 
                        src={companyData.logo} 
                        alt="Company Logo" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <i className="bi bi-building text-gray-500 text-5xl"></i>
                    )}
                    {/* Edit icon */}
                    <div className="absolute -bottom-2 -right-2 w-[44px] h-[44px] bg-[#FF8032] rounded-full flex items-center justify-center cursor-pointer z-20 shadow-lg">
                      <i className="bi bi-pencil-fill text-white text-[24px]"></i>
                    </div>
                  </div>
                  
                  {/* Hidden file input */}
                  <input
                    id="logoInput"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />                  
                  <div className="w-[320px]">                    
                    <div className="-mb-2 flex items-center justify-center gap-1">
                      <input
                        type="text"
                        value={companyData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="text-[24px] font-semibold text-[#3C3B3B] text-center bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 py-1"
                        maxLength={30}
                        title={companyData.name}
                        style={{ width: `${Math.max(100, Math.min(320, companyData.name.length * 14 + 20))}px` }}
                      />
                      <i className="bi bi-pencil-fill text-[#B4A598] text-[18px] flex-shrink-0"></i>
                    </div>                    
                    <div className="-mb-1 flex items-center justify-center gap-1">
                      <input
                        type="text"
                        value={companyData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="text-[#6C6C6C] text-[16px] font-semibold text-center bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 py-1"
                        style={{ width: `${Math.max(100, Math.min(320, companyData.location.length * 10 + 20))}px` }}
                      />
                      <i className="bi bi-pencil-fill text-[#B4A598] text-[18px] flex-shrink-0"></i>
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="text"
                        value={companyData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="text-[#3C3B3B] text-[15px] font-bold text-center bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 py-1"
                        style={{ width: `${Math.max(100, Math.min(320, companyData.type.length * 10 + 20))}px` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right side - Company Description */}
                <div className="flex-1 ml-8">
                  <h3 className="text-[24px] font-semibold text-[#3C3B3B] mb-3 mt-8">Company Description</h3>
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <textarea
                      value={companyData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full h-[204px] text-[#676767] text-[16px] font-semibold leading-relaxed bg-transparent border-none outline-none resize-none"
                      placeholder="Enter company description..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Company Links Section */}
            <div className="bg-white border-2 rounded-3xl shadow-xl p-8 mb-6">              
              <h3 className="text-[24px] font-semibold text-[#3C3B3B] mb-4">Company Links</h3>
              <div className="flex gap-4 flex-wrap justify-center">
                {socialPlatforms.map((platform) => (
                  <div key={platform.key}>
                    {socialLinks[platform.key] ? (
                      // Active social link
                      <button 
                        onClick={() => toggleSocialLink(platform.key)}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors relative group"
                      >
                        <i className={`bi ${platform.icon}`}></i>
                        {platform.name}
                        <i className="bi bi-x text-white ml-2 group-hover:text-[#FF8032]"></i>
                      </button>
                    ) : (                      // Placeholder for adding social link
                      <button 
                        onClick={() => toggleSocialLink(platform.key)}
                        className="flex items-center gap-2 border-2 border-dashed border-black text-black px-4 py-2 rounded-2xl hover:border-[#FF8032] hover:text-[#FF8032] transition-colors group"
                      >
                        <i className={`bi ${platform.icon}`}></i>
                        {platform.name}
                        <i className="bi bi-plus text-black group-hover:text-[#FF8032] ml-2"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-4">
                <button 
                  onClick={handleCancel}
                  className="w-[192px] h-[50px] px-8 py-3 border-2 border-gray-300 text-gray-600 rounded-3xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={!hasChanges()}
                  className={`w-[192px] h-[50px] px-8 py-3 rounded-3xl font-semibold transition-colors ${
                    hasChanges() 
                      ? 'bg-[#FF8032] text-white hover:bg-[#E66F24]' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Save Changes
                </button>              
                </div>
          </div>
        </main>

        {/* Social Media Link Popups */}
        {showPopup && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={handleCancelPopup}
            />
            
            {/* Popup Modal */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 p-6 min-w-[536px] min-h-[97px]">
              <div className="mb-4">
                <label className="block text-[#3C3B3B] text-[12px] font-semibold mb-2">
                  Link to your {socialPlatforms.find(p => p.key === showPopup)?.name} Profile
                </label>
                <input
                  type="url"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  className="w-full h-[30px] text-[12px] px-3 py-2 border-2 border-[#3C3B3B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8032] focus:border-transparent"
                  autoFocus
                />
              </div>
                <div className="flex justify-end gap-3 -mt-2">
                <button
                  onClick={handleCancelPopup}
                  className="w-[72px] h-[26px] px-4 rounded-lg font-semibold text-[10px] border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLink}
                  disabled={!tempUrl.trim()}
                  className={`w-[72px] h-[26px] px-4 rounded-lg font-semibold text-[10px] transition-colors ${
                    tempUrl.trim()
                      ? 'bg-[#FF8032] text-white hover:bg-[#E66F24]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Add
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditCompanyPage;
