import React, { useState } from "react";
import TAGS from "./Tags";

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

const salaryOptions = [
  { label: "₱10,000 - ₱15,000", value: "10k-15k" },
  { label: "₱15,001 - ₱20,000", value: "15k-20k" },
  { label: "₱20,001 - ₱30,000", value: "20k-30k" },
  { label: "₱30,001 - ₱50,000", value: "30k-50k" },
  { label: "₱50,001+", value: "50k-up" },
];

const categoryOptions = [
  { label: <span className="text-[#FF8032] font-bold">Web Development</span>, value: "web-development" },
  { label: <span className="text-[#FF8032] font-bold">Programming Languages</span>, value: "programming-languages" },
  { label: <span className="text-[#FF8032] font-bold">AI/ML/Data Science</span>, value: "ai-ml-data-science" },
  { label: <span className="text-[#FF8032] font-bold">Databases</span>, value: "databases" },
  { label: <span className="text-[#FF8032] font-bold">DevOps</span>, value: "devops" },
  { label: <span className="text-[#FF8032] font-bold">Cybersecurity</span>, value: "cybersecurity" },
  { label: <span className="text-[#FF8032] font-bold">Mobile Development</span>, value: "mobile-development" },
  { label: <span className="text-[#FF8032] font-bold">Soft Skills</span>, value: "soft-skills" },
];

// Also fix proficiencyOptions to use numeric values for backend
const proficiencyOptions = [
  { label: <span className="text-[#FF8032]">Level 1: <span className="font-bold">Novice</span></span>, value: 1 },
  { label: <span className="text-[#FF8032]">Level 2: <span className="font-bold">Advanced Beginner</span></span>, value: 2 },
  { label: <span className="text-[#FF8032]">Level 3: <span className="font-bold">Competent</span></span>, value: 3 },
  { label: <span className="text-[#FF8032]">Level 4: <span className="font-bold">Proficient</span></span>, value: 4 },
  { label: <span className="text-[#FF8032]">Level 5: <span className="font-bold">Expert</span></span>, value: 5 },
];

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
const JobNewPost = ({ open, onClose, onSave, companyData, userData }) => {
  // Use AuthContext and props for data
  const { user, isAuthenticated } = useAuth();
  const { createJob, loading: contextLoading, error: contextError, clearError } = useJobs();
  
  // Use company data from props (companyProfile from CompanyContext)
  const company = companyData || {};
  const currentUser = userData || user;

  // Update form state to include salary min/max
  const [form, setForm] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    tags: [],
    category: "",
    proficiency: ""
  });

  const [tagInput, setTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [selectedModality, setSelectedModality] = useState(null);
  const [selectedWorkType, setSelectedWorkType] = useState(null);
  const [availablePositions, setAvailablePositions] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProficiency, setSelectedProficiency] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null); // shared state

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

  const handleTagAdd = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
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
<<<<<<<<< Temporary merge branch 1
    fetch("http://127.0.0.1:8000/api/v1/jobs/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to post job");
        return res.json();
      })
      .then(data => {
        if (onSave) onSave(data);
        setForm({
          jobTitle: "",
          companyName: "",
          location: "",
          salary: "",
          modality: "",
          workType: "",
          description: "",
          positions: "",
          tags: [],
        });
        setShowTagInput(false);
      })
      .catch(err => {
        console.error(err);
      });
=========
    // Create the job data with form values 
    const jobData = {
      jobTitle: form.jobTitle,
      companyName: form.companyName,
      location: form.location,
      salary: selectedSalary, 
      type: selectedModality,
      employment: selectedWorkType,
      description: form.description,
      availablePositions: availablePositions,
      tags: form.tags,
      applicantCount: form.applicantCount || 0,
      category: selectedCategory,
      proficiency: selectedProficiency
    };
    onSave(jobData);
    setForm({
      jobTitle: "",
      companyName: "",
      location: "",
      salary: "",
      modality: "",
      workType: "",
      description: "",
      positions: "",
      tags: [],
      category: "",
      proficiency: ""
    });
    setSelectedModality(null);
    setSelectedWorkType(null);
    setAvailablePositions(null);
    setSelectedSalary(null);
    setSelectedCategory(null);
    setSelectedProficiency(null);
    setShowTagInput(false);
>>>>>>>>> Temporary merge branch 2
  };
  
  // Get tags for the selected category
  const availableTags = selectedCategory ? TAGS[categoryOptions.find(opt => opt.value === selectedCategory)?.label.props.children] || [] : [];

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
                selected={form.category}
                onSelect={val => setForm({ ...form, category: val })}
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
          
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[16px] text-[#3C3B3B]">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {/* Show tags for selected category */}
              {availableTags.length > 0 && availableTags.map((tag) => {
                const isSelected = form.tags.includes(tag);
                return (
                  <button
                    type="button"
                    className={`px-3 py-1 rounded-full text-[12px] font-semibold border-2 transition-colors flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#FF8032] text-white border-[#FF8032]'
                        : 'bg-white text-[#FF8032] border-[#FF8032] hover:bg-[#FF8032]/10'
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
                      } else {
                        setForm({ ...form, tags: [...form.tags, tag] });
                      }
                    }}
                  >
                    + {tag}
                  </button>
                );
              })}
              {showTagInput ? (
                <input
                  className="border-2 focus:border-[#FF8032] focus:outline-none focus:ring-0 rounded px-2 py-1 text-[12px] w-24"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onBlur={() => setShowTagInput(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleTagAdd();
                      setShowTagInput(false);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  className="w-[53px] px-2 py-1 bg-[#FF8032] text-white rounded-full text-[12px] font-semibold hover:bg-[#E66F24] transition"
                  onClick={() => setShowTagInput(true)}
                >
                  Tag +
                </button>
              )}
            </div>
          </div>
          <TagPopup
            open={showTagPopup}
            onClose={() => setShowTagPopup(false)}
            currentTags={form.tags}
            onTagSelect={(tag) => {
              if (!form.tags.includes(tag)) {
                setForm({ ...form, tags: [...form.tags, tag] });
              }
            }}
            onSave={(selectedTags) => {
              // Replace the current tags with the selected tags
              setForm({ ...form, tags: selectedTags });
            }}
          />

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
        
        <TagPopup
          open={showTagPopup}
          onClose={() => setShowTagPopup(false)}
          currentTags={form.tags}
          onTagSelect={(tag) => {
            if (!form.tags.includes(tag)) {
              setForm({ ...form, tags: [...form.tags, tag] });
            }
          }}
          onSave={(selectedTags) => {
            setForm({ ...form, tags: selectedTags });
          }}
        />
        </div>
      </div>
    </>
  );
};

export default JobNewPost;