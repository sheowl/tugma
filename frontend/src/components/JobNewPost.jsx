import React, { useState } from "react";
import { useJobs } from "../context/JobsContext";
import { useAuth } from "../context/AuthContext";
import { getProficiencyLevel, getProficiencyOptions } from "../utils/jobMappings";

// Dropdown options - Update values to match backend
const modalityOptions = [
  { label: "On-site", value: "onsite" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Remote", value: "remote" },
];

const workTypeOptions = [
  { label: "Full-Time", value: "fulltime" },
  { label: "Contractual", value: "contractual" },
  { label: "Part-Time", value: "part-time" },
  { label: "Internship", value: "internship" },
];

const positionOptions = Array.from({ length: 100 }, (_, i) => ({
  label: `${i + 1}`,
  value: i + 1,
}));

// Fix the categoryOptions to match your TAGS object keys exactly
const categoryOptions = [
  { label: <span className="text-[#FF8032] font-bold">Web Development</span>, value: "Web Development" },
  { label: <span className="text-[#FF8032] font-bold">Programming Languages</span>, value: "Programming Languages" },
  { label: <span className="text-[#FF8032] font-bold">AI/ML/Data Science</span>, value: "AI/ML/Data Science" },
  { label: <span className="text-[#FF8032] font-bold">Databases</span>, value: "Databases" },
  { label: <span className="text-[#FF8032] font-bold">DevOps</span>, value: "DevOps" },
  { label: <span className="text-[#FF8032] font-bold">Cybersecurity</span>, value: "Cybersecurity" },
  { label: <span className="text-[#FF8032] font-bold">Mobile Development</span>, value: "Mobile Development" },
  { label: <span className="text-[#FF8032] font-bold">Soft Skills</span>, value: "Soft Skills" },
];

// Also fix proficiencyOptions to use numeric values for backend
const proficiencyOptions = [
  { label: <span className="text-[#FF8032]">Level 1: <span className="font-bold">Novice</span></span>, value: 1 },
  { label: <span className="text-[#FF8032]">Level 2: <span className="font-bold">Advanced Beginner</span></span>, value: 2 },
  { label: <span className="text-[#FF8032]">Level 3: <span className="font-bold">Competent</span></span>, value: 3 },
  { label: <span className="text-[#FF8032]">Level 4: <span className="font-bold">Proficient</span></span>, value: 4 },
  { label: <span className="text-[#FF8032]">Level 5: <span className="font-bold">Expert</span></span>, value: 5 },
];

// Reusable Dropdown
const CustomDropdown = ({
  options,
  selected,
  onSelect,
  placeholder,
  openDropdown,
  setOpenDropdown,
  dropdownKey,
  hideCaret
}) => {
  const isOpen = openDropdown === dropdownKey;

  const handleActionClick = () => setOpenDropdown(isOpen ? null : dropdownKey);

  const handleOptionClick = (option) => {
    onSelect(option.value);
    setOpenDropdown(null);
  };

  const selectedLabel =
    options.find((opt) => opt.value === selected)?.label || placeholder;

  return (
    <div className="relative">
      <button
        className={`h-8 px-6 py-2 border-2 border-[#FF8032] focus:border-[#FF8032] hover:bg-[#FF8032]/10 text-[#FF8032] rounded-[10px] text-[14px] font-bold bg-white flex items-center gap-2 transition-colors focus:outline-none focus:ring-0 w-[219px] justify-center whitespace-nowrap`}
        onClick={handleActionClick}
        type="button"
      >
        {selectedLabel}
        {!hideCaret && <i className="bi bi-caret-down-fill text-xs" />}
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow z-40 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 hover:bg-[#FF8032]/10 cursor-pointer text-sm font-semibold ${
                selected === option.value ? "text-[#FF8032]" : "text-gray-700"}
              `}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

//POST New Jobs
const JobNewPost = ({ open, onClose, onSave, companyData, userData, availableTags = [] }) => {
  // Use AuthContext and props for data
  const { user, isAuthenticated } = useAuth();
  const { createJob, loading: contextLoading, error: contextError, clearError } = useJobs();
  
  // Use company data from props (companyProfile from CompanyContext)
  const company = companyData || {};
  const currentUser = userData || user;

  // Update form state to include selected tag IDs instead of tag strings
  const [form, setForm] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    selectedTags: [], // Changed: now stores tag IDs
  });

  const [selectedModality, setSelectedModality] = useState(null);
  const [selectedWorkType, setSelectedWorkType] = useState(null);
  const [availablePositions, setAvailablePositions] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProficiency, setSelectedProficiency] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle salary fields
    if (name === 'salaryMin' || name === 'salaryMax') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setForm({ ...form, [name]: numericValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Updated tag handling functions
  const handleTagToggle = (tagId) => {
    setForm(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter(id => id !== tagId)
        : [...prev.selectedTags, tagId]
    }));
  };

  // Add salary validation
  const isSalaryValid = () => {
    const min = parseInt(form.salaryMin) || 0;
    const max = parseInt(form.salaryMax) || 0;
    if (min < 0 || max < 0) return false;
    return min > 0 && max > 0 && min <= max;
  };

  // Update handleSubmit to use the passed company data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSalaryValid()) {
      alert('Please enter valid salary amounts');
      return;
    }

    // Check authentication first
    if (!isAuthenticated) {
      alert('Please log in to create a job posting.');
      return;
    }

    // Make sure we have company data
    if (!company || !company.company_id) {
      alert('Company information is not available. Please try refreshing the page.');
      return;
    }

    // Validate required fields with detailed logging
    const missingFields = [];
    
    if (!form.jobTitle?.trim()) missingFields.push('Job Title');
    if (!form.description?.trim()) missingFields.push('Job Description');
    if (!selectedModality) missingFields.push('Job Modality');
    if (!selectedWorkType) missingFields.push('Work Type');
    if (!availablePositions) missingFields.push('Available Positions');
    if (!form.salaryMin || parseInt(form.salaryMin) <= 0) missingFields.push('Minimum Salary');
    if (!form.salaryMax || parseInt(form.salaryMax) <= 0) missingFields.push('Maximum Salary');

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields:\n• ${missingFields.join('\n• ')}`);
      return;
    }

    try {
      setSaving(true);
      clearError();
      
      // Map category name to category ID for backend
      const categoryMapping = {
        "Web Development": 1,
        "Programming Languages": 2, 
        "Databases": 3,
        "AI/ML/Data Science": 4,
        "DevOps": 5,
        "Cybersecurity": 7,
        "Mobile Development": 8,
        "Soft Skills": 9
      };
      
      // Transform data to match backend expected format exactly
      const jobData = {
        jobTitle: form.jobTitle.trim(), // Frontend format for CompanyContext
        salaryMin: parseInt(form.salaryMin),
        salaryMax: parseInt(form.salaryMax),
        type: selectedModality,
        employment: selectedWorkType,
        description: form.description.trim(),
        availablePositions: parseInt(availablePositions),
        category: selectedCategory ? (categoryMapping[selectedCategory] || null) : null,
        proficiency: parseInt(selectedProficiency) || null,
        selectedTags: form.selectedTags // Include selected tag IDs
      };
      
      // Final validation with detailed error messages
      const validationErrors = [];
      
      if (!jobData.job_title) validationErrors.push(`Job title is missing: "${jobData.job_title}"`);
      if (!jobData.salary_min || jobData.salary_min <= 0) validationErrors.push(`Invalid salary_min: ${jobData.salary_min}`);
      if (!jobData.salary_max || jobData.salary_max <= 0) validationErrors.push(`Invalid salary_max: ${jobData.salary_max}`);
      if (jobData.salary_min > jobData.salary_max) validationErrors.push(`salary_min (${jobData.salary_min}) > salary_max (${jobData.salary_max})`);
      if (!jobData.setting) validationErrors.push(`Missing setting: "${jobData.setting}"`);
      if (!jobData.work_type) validationErrors.push(`Missing work_type: "${jobData.work_type}"`);
      if (!jobData.description) validationErrors.push(`Missing description: "${jobData.description}"`);
      if (!jobData.position_count || jobData.position_count <= 0) validationErrors.push(`Invalid position_count: ${jobData.position_count}`);
      if (!jobData.company_id) validationErrors.push(`Missing company_id: ${jobData.company_id}`);
      
      // Check if these are valid enum values
      const validSettings = ['onsite', 'hybrid', 'remote'];
      const validWorkTypes = ['fulltime', 'contractual', 'part-time', 'internship'];
      
      if (!validSettings.includes(jobData.setting)) {
        validationErrors.push(`Invalid setting enum: "${jobData.setting}". Must be one of: ${validSettings.join(', ')}`);
      }
      
      if (!validWorkTypes.includes(jobData.work_type)) {
        validationErrors.push(`Invalid work_type enum: "${jobData.work_type}". Must be one of: ${validWorkTypes.join(', ')}`);
      }
      
      if (validationErrors.length > 0) {
        alert('Validation errors found:\n\n' + validationErrors.join('\n'));
        return;
      }
      
      const result = await createJob(jobData);
      
      if (onSave) {
        onSave(result);
      }
      
      // Reset form
      setForm({
        jobTitle: "",
        companyName: "",
        location: "",
        salaryMin: "",
        salaryMax: "",
        description: "",
        tags: [],
      });
      setSelectedModality(null);
      setSelectedWorkType(null);
      setAvailablePositions(null);
      setSelectedCategory(null);
      setSelectedProficiency(null);
      
      onClose();
      
    } catch (error) {
      // Try to get more detailed error information
      if (error.message.includes('422')) {
        alert('Backend validation error: Please check all required fields.');
      } else {
        alert(`Failed to create job: ${error.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  // Check authentication
  if (!isAuthenticated) {
    return (
      <>
        <div
          className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 z-40 ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
        />
        
        <div
          className={`fixed top-0 right-0 h-full w-[640px] bg-white shadow-2xl z-50 transform transition-transform duration-300 rounded-tl-[30px] rounded-bl-[30px] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-10 w-full h-full flex items-center justify-center">
            <div className="text-red-500 font-semibold text-lg text-center">
              Please log in to create job postings.
            </div>
          </div>
        </div>
      </>
    );
  }

  // Check company data (companyProfile)
  if (!company || !company.company_id) {
    return (
      <>
        <div
          className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 z-40 ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
        />
        
        <div
          className={`fixed top-0 right-0 h-full w-[640px] bg-white shadow-2xl z-50 transform transition-transform duration-300 rounded-tl-[30px] rounded-bl-[30px] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-10 w-full h-full flex items-center justify-center">
            <div className="text-red-500 font-semibold text-lg text-center">
              Company profile not loaded.<br />
              Available properties: {Object.keys(company || {}).join(', ')}<br />
              Please ensure you're logged in as an employer.
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 z-40 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      
      <div
        className={`fixed top-0 right-0 h-full w-[640px] bg-white shadow-2xl z-50 transform transition-transform duration-300 rounded-tl-[30px] rounded-bl-[30px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-10 w-full h-full overflow-y-auto relative flex flex-col">
        {/* Close Button */}
        <button
          className="absolute top-8 left-8 text-3xl text-gray-400 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          <i className="bi bi-arrow-left text-[52px]" />
        </button>
        
        {/* Error display */}
        {contextError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-16">
            Error: {contextError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-16 ml-12">
          <div>
            <div className="relative flex items-center">
              <input
                className="text-[40px] font-bold text-black outline-none border-b-2 border-[transparent] focus:border-[#FF8032] w-full placeholder:text-[40px] placeholder:font-bold placeholder:text-[#000000] pr-12"
                name="jobTitle"
                placeholder="Job Title"
                value={form.jobTitle}
                onChange={handleChange}
                required
              />
              {form.jobTitle === '' && (
                <span className="absolute left-48 top-[70%] -translate-y-1/2 flex items-center pointer-events-none">
                  <i className="bi bi-pencil-fill text-[#B4A598] text-xl"></i>
                </span>
              )}
            </div>
            <div className="text-[20px] font-bold text-[#6B7280] -mt-2">
              <input
                className="outline-none border-b-2 border-[transparent] focus:border-[#FF8032] w-full font-bold text-[#6B7280] placeholder:text-[20px] placeholder:font-bold placeholder:text-[#6B7280]"
                name="companyName"
                placeholder="Company Name"
                value={form.companyName || company.company_name || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="text-[16px] text-[#6B7280]">
              <input
                className="outline-none border-b-2 border-transparent focus:border-[#FF8032] w-full font-semibold text-[#6B7280] placeholder:text-[16px] placeholder:font-semibold placeholder:text-[#6B7280]"
                name="location"
                placeholder="Job Location"
                value={form.location || company.location || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>          
          
          {/* Replace salary dropdown with min/max inputs */}
          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#3C3B3B] mb-1">
              Job Salary Range
            </label>            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[16px] text-[#262424] font-semibold">₱</span>
                <input
                  type="number"
                  name="salaryMin"
                  placeholder="Minimum"
                  value={form.salaryMin}
                  onChange={handleChange}
                  className="h-8 px-3 py-2 border-2 border-[#FF8032] focus:border-[#FF8032] focus:outline-none focus:ring-0 text-[#FF8032] rounded-[10px] text-[14px] font-bold bg-white w-[120px]"
                  min="0"
                  step="1"
                  required
                />
              </div>
              <span className="text-[16px] text-[#262424] font-semibold">-</span>
              <div className="flex items-center gap-2">
                <span className="text-[16px] text-[#262424] font-semibold">₱</span>
                <input
                  type="number"
                  name="salaryMax"
                  placeholder="Maximum"
                  value={form.salaryMax}
                  onChange={handleChange}
                  className="h-8 px-3 py-2 border-2 border-[#FF8032] focus:border-[#FF8032] focus:outline-none focus:ring-0 text-[#FF8032] rounded-[10px] text-[14px] font-bold bg-white w-[120px]"
                  min="0"
                  step="1"
                  required
                />
              </div>
              <span className="text-[16px] text-[#262424] font-semibold">monthly</span>
            </div>
            {/* Validation message */}
            {(form.salaryMin || form.salaryMax) && !isSalaryValid() && (
              <p className="text-red-500 text-[12px] mt-1">
                {parseInt(form.salaryMin) < 0 || parseInt(form.salaryMax) < 0
                  ? "Salary cannot be negative"
                  : parseInt(form.salaryMin) > parseInt(form.salaryMax) 
                  ? "Minimum salary cannot be greater than maximum salary" 
                  : "Please enter valid salary amounts"}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[16px] text-[#3C3B3B]">
              Job Modality
            </label>
            <CustomDropdown
              options={modalityOptions}
              selected={selectedModality}
              onSelect={setSelectedModality}
              placeholder="Action"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              dropdownKey="modality"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[16px] text-[#3C3B3B]">
              Job Work Type
            </label>
            <CustomDropdown
              options={workTypeOptions}
              selected={selectedWorkType}
              onSelect={setSelectedWorkType}
              placeholder="Action"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              dropdownKey="worktype"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#232323]">Job Description</label>
            <textarea
              className="border-2 border-[#A6A6A6] focus:border-[#FF8032] focus:outline-none focus:ring-0 rounded px-3 py-2"
              name="description"
              placeholder="Job Description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[16px] text-[#3C3B3B]">
              Available positions
            </label>
            <CustomDropdown
              options={positionOptions}
              selected={availablePositions}
              onSelect={setAvailablePositions}
              placeholder="Action"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              dropdownKey="positions"
            />
          </div>

          {/* Category and Proficiency Row */}
          <div className="flex flex-row gap-8">
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-semibold text-[16px] text-[#3C3B3B]">Required Category</label>
              <CustomDropdown
                options={categoryOptions}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                placeholder="Tag +"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                dropdownKey="category"
                hideCaret={true}
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-semibold text-[16px] text-[#3C3B3B]">Required Proficiency</label>
              <CustomDropdown
                options={proficiencyOptions}
                selected={selectedProficiency}
                onSelect={setSelectedProficiency}
                placeholder="Tag +"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                dropdownKey="proficiency"
                hideCaret={true}
              />
            </div>
          </div>
          
          {/* Updated Tags section with backend tags */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[16px] text-[#3C3B3B]">
              Required Skills/Tags
            </label>
            
            {/* Tag selection grid */}
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
              {availableTags.map(tag => (
                <label key={tag.tag_id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.selectedTags.includes(tag.tag_id)}
                    onChange={() => handleTagToggle(tag.tag_id)}
                    className="rounded border-gray-300 text-[#FF8032] focus:ring-[#FF8032]"
                  />
                  <span className="text-sm text-gray-700">{tag.tag_name}</span>
                </label>
              ))}
            </div>
            
            {/* Display selected tags */}
            {form.selectedTags.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected tags:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {form.selectedTags.map(tagId => {
                    const tag = availableTags.find(t => t.tag_id === tagId);
                    return (
                      <span
                        key={tagId}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#FF8032] text-white"
                      >
                        {tag ? tag.tag_name : `Tag ${tagId}`}
                        <button
                          type="button"
                          onClick={() => handleTagToggle(tagId)}
                          className="ml-1 text-white hover:text-gray-200"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>  

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={saving || contextLoading || !isSalaryValid()}
              className={`w-[243px] h-[48px] font-bold rounded-lg transition text-[16px] ${
                !saving && !contextLoading && isSalaryValid()
                  ? 'bg-[#FF8032] text-white hover:bg-[#E66F24]' 
                  : 'bg-[#979797] text-white cursor-not-allowed'
              }`}
            >
              {saving || contextLoading ? 'Creating...' : 'Post Job'}
            </button>          
          </div>
        </form>
        </div>
      </div>
    </>
  );
};

export default JobNewPost;