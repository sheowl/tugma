import React, { useState, useEffect, useRef } from "react";
import { useJobs } from "../context/JobsContext";
import { useTags } from "../context/TagsContext";
import TagPopup from "./TagPopup";
import { getCategoryName, getProficiencyLevel, CATEGORIES, PROFICIENCY_LEVELS } from "../utils/jobMappings";

// Dropdown options (keep these as is)
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

const categoryOptions = Object.entries(CATEGORIES).map(([id, name]) => ({
  label: <span className="text-[#FF8032] font-bold">{name}</span>,
  value: parseInt(id)
}));

const proficiencyOptions = Object.entries(PROFICIENCY_LEVELS).map(([id, level]) => ({
  label: <span className="text-[#FF8032]">{level.replace('Level ', 'Level ')}</span>,
  value: parseInt(id)
}));

// Reusable Dropdown
const CustomDropdown = ({
  options,
  selected,
  onSelect,
  placeholder,
  openDropdown,
  setOpenDropdown,
  dropdownKey,
  hideCaret,
}) => {
  const isOpen = openDropdown === dropdownKey;

  const handleActionClick = () => setOpenDropdown(isOpen ? null : dropdownKey);

  const handleOptionClick = (option) => {
    onSelect(option.value);
    setOpenDropdown(null);
  };

  let displayLabel;
  if (dropdownKey === 'category' && selected) {
    displayLabel = getCategoryName(selected);
  } else if (dropdownKey === 'proficiency' && selected) {
    displayLabel = getProficiencyLevel(selected);
  } else {
    displayLabel = options.find((opt) => opt.value === selected)?.label || placeholder;
  }

  return (
    <div className="relative">        
      <button
        className="h-8 px-6 py-2 border-2 border-[#FF8032] focus:border-[#FF8032] hover:bg-[#FF8032]/10 text-[#FF8032] rounded-[10px] text-[14px] font-bold bg-white flex items-center gap-2 transition-colors focus:outline-none focus:ring-0 w-[219px] justify-center whitespace-nowrap"
        onClick={handleActionClick}
        type="button"
      >
        {displayLabel} {!hideCaret && <i className="bi bi-caret-down-fill text-xs" />}
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow z-40 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 hover:bg-[#FF8032]/10 cursor-pointer text-sm font-semibold ${
                selected === option.value ? "text-[#FF8032]" : "text-gray-700"
              }`}
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

const JobEditPost = ({ open, onClose, onSave, jobData, availableTags = [] }) => {
  const { updateJob, loading: contextLoading, error: contextError, clearError } = useJobs();
  const { flatTagMapping } = useTags();
  
  // Use refs to store persistent data that won't be affected by re-renders
  const jobDataRef = useRef(null);
  const isSubmittingRef = useRef(false);
  
  const [form, setForm] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    modality: "",
    workType: "",
    description: "",
    availablePositions: "",
    selectedTags: [], // Array of tag IDs
    category: "",
    proficiency: ""
  });

  const [originalForm, setOriginalForm] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showTagPopup, setShowTagPopup] = useState(false);

  // Store job data when modal opens and only update if it's genuinely new data
  useEffect(() => {
    if (open && jobData && !isSubmittingRef.current) {
      console.log('Initializing with jobData:', jobData);
      
      // Store the job data in ref for persistent access
      jobDataRef.current = { ...jobData };
      
      const initialData = {
        jobTitle: jobData.jobTitle || jobData.job_title || "",
        companyName: jobData.companyName || jobData.company_name || "",
        location: jobData.location || "",
        salaryMin: jobData.salaryMin ? jobData.salaryMin.toString() : "",
        salaryMax: jobData.salaryMax ? jobData.salaryMax.toString() : "",
        modality: jobData.type || jobData.setting || "",
        workType: jobData.employment || jobData.work_type || "",
        description: jobData.description || "",
        availablePositions: jobData.availablePositions || jobData.position_count || "",
        selectedTags: jobData.job_tags || jobData.selectedTags || [], // Array of tag IDs
        category: jobData.category || jobData.requiredCategoryId || "",
        proficiency: jobData.proficiency || jobData.requiredProficiency || ""
      };
      
      setForm(initialData);
      setOriginalForm(initialData);
      setInitialized(true);
      console.log('Form initialized with:', initialData);
    }
  }, [open, jobData]);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setInitialized(false);
      isSubmittingRef.current = false;
      jobDataRef.current = null;
      setForm({
        jobTitle: "",
        companyName: "",
        location: "",
        salaryMin: "",
        salaryMax: "",
        modality: "",
        workType: "",
        description: "",
        availablePositions: "",
        selectedTags: [],
        category: "",
        proficiency: ""
      });
      setOriginalForm({});
    }
  }, [open]);

  const hasChanges = React.useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(originalForm);
  }, [form, originalForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'salaryMin' || name === 'salaryMax') {
      // Allow any positive number, not just multiples of 1000
      const numericValue = value.replace(/[^0-9]/g, '');
      setForm({ ...form, [name]: numericValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleDropdownSelect = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleCancel = () => {
    setForm(originalForm);
    onClose();
  };

  const handleTagRemove = (tagId) => {
    setForm({ ...form, selectedTags: form.selectedTags.filter((id) => id !== tagId) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission and use stored ref data
    if (isSubmittingRef.current || !jobDataRef.current) {
      console.log('Submission blocked:', { submitting: isSubmittingRef.current, hasJobData: !!jobDataRef.current });
      return;
    }

    const storedJobData = jobDataRef.current;
    const jobId = storedJobData.id || storedJobData.job_id;
    
    if (!jobId) {
      console.error('No job ID available in stored data:', storedJobData);
      return;
    }
    
    if (!hasChanges || !isSalaryValid()) {
      console.log('No changes or invalid salary:', { hasChanges, isSalaryValid: isSalaryValid() });
      return;
    }

    try {
      isSubmittingRef.current = true; // Set flag to prevent interference
      setSaving(true);
      clearError();
      
      console.log('Submitting with job ID:', jobId);
      console.log('Form data:', form);
      
      const updatedJobData = {
        jobTitle: form.jobTitle,
        companyName: form.companyName,
        location: form.location,
        description: form.description,
        salaryMin: parseInt(form.salaryMin) || 0,
        salaryMax: parseInt(form.salaryMax) || 0,
        modality: form.modality,
        workType: form.workType,
        positions: parseInt(form.availablePositions) || 1,
        requiredCategoryId: parseInt(form.category) || null,
        requiredProficiency: parseInt(form.proficiency) || null,
        job_tags: form.selectedTags, // Send tag IDs to backend
        companyId: storedJobData.companyId || storedJobData.company_id || 2,
        status: storedJobData.status || 'Active',
        dateAdded: storedJobData.dateAdded || storedJobData.date_added || null,
        createdAt: storedJobData.createdAt || storedJobData.created_at || null
      };
      
      console.log('Sending update data:', updatedJobData);
      
      const result = await updateJob(jobId, updatedJobData);
      console.log('Update successful:', result);
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(result);
      }
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error('Update failed:', error);
      isSubmittingRef.current = false; // Reset flag on error
    } finally {
      setSaving(false);
    }
  };

  const isSalaryValid = () => {
    const min = parseInt(form.salaryMin) || 0;
    const max = parseInt(form.salaryMax) || 0;
    
    // Check for negative values
    if (min < 0 || max < 0) return false;
    
    // Check that both values are greater than 0 and min <= max
    return min > 0 && max > 0 && min <= max;
  };

  // Don't render the form until initialized or if modal is closed
  if (!open || !initialized) {
    return (
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 z-40 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
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
          <button
            className="absolute top-8 left-8 text-3xl text-gray-400 hover:text-black"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="bi bi-arrow-left text-[52px]" />
          </button>
          
          {contextError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-16">
              Error: {contextError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-16 ml-8">
            <div>            
              <div className="relative flex items-center">
                <input
                  className="text-[40px] font-bold text-black outline-none border-b-2 border-[transparent] focus:border-[#FF8032] w-full placeholder:text-[40px] placeholder:font-bold placeholder:text-[#000000] pr-12 truncate"
                  name="jobTitle"
                  placeholder="Job Title"
                  value={form.jobTitle}
                  onChange={handleChange}
                  required
                  title={form.jobTitle} 
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
                  value={form.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="text-[16px] text-[#6B7280]">
                <input
                  className="outline-none border-b-2 border-transparent focus:border-[#FF8032] w-full font-semibold text-[#6B7280] placeholder:text-[16px] placeholder:font-semibold placeholder:text-[#6B7280]"
                  name="location"
                  placeholder="Job Location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>          
            
            {/* Salary Range Fields */}
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
              {/* Enhanced validation message */}
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
              <label className="font-semibold text-[16px] text-[#3C3B3B]">Job Modality</label>              
              <CustomDropdown
                options={modalityOptions}
                selected={form.modality}
                onSelect={(value) => handleDropdownSelect('modality', value)}
                placeholder="Select Modality"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                dropdownKey="modality"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-[16px] text-[#3C3B3B]">Job Work Type</label>              
              <CustomDropdown
                options={workTypeOptions}
                selected={form.workType}
                onSelect={(value) => handleDropdownSelect('workType', value)}
                placeholder="Select Work Type"
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
              <label className="font-semibold text-[16px] text-[#3C3B3B]">Available positions</label>            
              <CustomDropdown
                options={positionOptions}
                selected={form.availablePositions}
                onSelect={(value) => handleDropdownSelect('availablePositions', value)}
                placeholder="Select Positions"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                dropdownKey="positions"
              />
            </div>

            <div className="flex flex-row gap-8">
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-semibold text-[16px] text-[#3C3B3B]">Required Category</label>
                <CustomDropdown
                  options={categoryOptions}
                  selected={form.category}
                  onSelect={(value) => setForm({ ...form, category: value, selectedTags: [] })}
                  placeholder={form.category ? getCategoryName(form.category) : "Select Category"}
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
                  selected={form.proficiency}
                  onSelect={(value) => setForm({ ...form, proficiency: value })}
                  placeholder={form.proficiency ? getProficiencyLevel(form.proficiency) : "Select Proficiency"}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  dropdownKey="proficiency"
                  hideCaret={true}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-[16px] text-[#3C3B3B]">Tags</label>
              
              {/* Selected Tags Display */}
              <div className="flex flex-wrap gap-2 mb-2">
                {form.selectedTags.map((tagId) => (
                  <span
                    key={tagId}
                    className="bg-[#FF8032] text-white font-semibold px-3 py-1 rounded-full text-[12px] flex items-center gap-1"
                  >
                    {flatTagMapping[tagId] || `Tag ${tagId}`}
                    <button
                      type="button"
                      className="ml-1 text-[12px] text-white hover:text-red-200"
                      onClick={() => handleTagRemove(tagId)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Tag Button */}
              <button
                type="button"
                className="w-[219px] px-2 py-1 bg-transparent text-[#FF8032] border-2 border-[#FF8032] rounded-xl text-[12px] font-semibold hover:bg-[#FF8032] hover:text-white transition"
                onClick={() => setShowTagPopup(true)}
              >
                + Tag
              </button>
            </div>            
            
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving || contextLoading}
                className="w-[202px] h-[50px] bg-white text-[#828283] text-[16px] font-bold border border-[#828283] font-bold rounded-3xl hover:bg-[#828283]/10 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!hasChanges || !isSalaryValid() || saving || contextLoading}
                className={`w-[202px] h-[50px] font-bold rounded-3xl transition text-[16px] ${
                  hasChanges && isSalaryValid() && !saving && !contextLoading
                    ? 'bg-[#FF8032] text-white hover:bg-[#E66F24]' 
                    : 'bg-[#979797] text-white cursor-not-allowed'
                }`}
              >
                {saving || contextLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
          
          <TagPopup
            open={showTagPopup}
            onClose={() => setShowTagPopup(false)}
            currentTags={form.selectedTags.map(tagId => flatTagMapping[tagId] || `Tag ${tagId}`)}
            onSave={(selectedTagNames) => {
              // Convert tag names back to IDs
              const tagIds = [];
              selectedTagNames.forEach(tagName => {
                // Find the tag ID for this tag name
                const tagId = Object.keys(flatTagMapping).find(id => flatTagMapping[id] === tagName);
                if (tagId) {
                  tagIds.push(parseInt(tagId));
                }
              });
              setForm({ ...form, selectedTags: tagIds });
            }}
          />
        </div>
      </div>
    </>
  );
};

export default JobEditPost;