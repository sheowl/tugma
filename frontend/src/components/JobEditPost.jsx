import React, { useState } from "react";
import { exampleJobPosts } from "../context/jobPostsData";
import TAGS from "./Tags";

// Dropdown options
const modalityOptions = [
  { label: "On-site", value: "on-site" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Remote", value: "remote" },
];

const workTypeOptions = [
  { label: "Full-Time", value: "full-time" },
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
  { label: <span className="text-[#FF8032] font-bold">Web Development</span>, value: "Web Development" },
  { label: <span className="text-[#FF8032] font-bold">Programming Languages</span>, value: "Programming Languages" },
  { label: <span className="text-[#FF8032] font-bold">AI/ML/Data Science</span>, value: "AI/ML/Data Science" },
  { label: <span className="text-[#FF8032] font-bold">Databases</span>, value: "Databases" },
  { label: <span className="text-[#FF8032] font-bold">DevOps</span>, value: "DevOps" },
  { label: <span className="text-[#FF8032] font-bold">Cybersecurity</span>, value: "Cybersecurity" },
  { label: <span className="text-[#FF8032] font-bold">Mobile Development</span>, value: "Mobile Development" },
  { label: <span className="text-[#FF8032] font-bold">Soft Skills</span>, value: "Soft Skills" },
];

const proficiencyOptions = [
  { label: <span className="text-[#FF8032]">Level 1: <span className="font-bold">Novice</span></span>, value: "novice" },
  { label: <span className="text-[#FF8032]">Level 2: <span className="font-bold">Advanced Beginner</span></span>, value: "advanced-beginner" },
  { label: <span className="text-[#FF8032]">Level 3: <span className="font-bold">Competent</span></span>, value: "competent" },
  { label: <span className="text-[#FF8032]">Level 4: <span className="font-bold">Proficient</span></span>, value: "proficient" },
  { label: <span className="text-[#FF8032]">Level 5: <span className="font-bold">Expert</span></span>, value: "expert" },
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
  hideCaret,
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
          className="h-8 px-6 py-2 border-2 border-[#FF8032] focus:border-[#FF8032] hover:bg-[#FF8032]/10 text-[#FF8032] rounded-[10px] text-[14px] font-bold bg-white flex items-center gap-2 transition-colors focus:outline-none focus:ring-0"
          onClick={handleActionClick}
          type="button"
        >
          {selectedLabel} {!hideCaret && <i className="bi bi-caret-down-fill text-xs" />}
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

const JobEditPost = ({ open, onClose, onSave, jobData }) => {
  const [form, setForm] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    salary: "",
    modality: "",
    workType: "",
    description: "",
    availablePositions: "",
    tags: [],
    category: "",
    proficiency: ""
  });

  const [originalForm, setOriginalForm] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);// Initialize form with existing job data
  React.useEffect(() => {
    if (jobData && open) {
      // Find the complete job data from context
      const contextJob = exampleJobPosts.find(jobPost => 
        jobPost.id === jobData.id || 
        jobPost.jobTitle === jobData.jobTitle || 
        (jobPost.companyName === jobData.companyName && jobPost.jobTitle === jobData.jobTitle)
      );
      
      // Use context data for complete information, fallback to provided jobData
      const completeJobData = contextJob || jobData;
        const initialData = {
        jobTitle: completeJobData.jobTitle || "",
        companyName: completeJobData.companyName || "",
        location: completeJobData.location || "",
        salary: completeJobData.salary || "",
        modality: completeJobData.type || "",
        workType: completeJobData.employment || "",
        description: completeJobData.description || "",
        availablePositions: completeJobData.availablePositions || "",
        tags: completeJobData.tags || [],
        category: completeJobData.category || "",
        proficiency: completeJobData.proficiency || ""
      };
      
      setForm(initialData);
      setOriginalForm(initialData);
    }
  }, [jobData, open]);

  // Check if form has changes
  const hasChanges = React.useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(originalForm);
  }, [form, originalForm]);  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };  const handleDropdownSelect = (field, value) => {
    setForm({ ...form, [field]: value });
  };  const handleCancel = () => {
    setForm(originalForm);
    onClose();
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find the complete job data from context for reference
    const contextJob = exampleJobPosts.find(jobPost => 
      jobPost.id === jobData.id || 
      jobPost.jobTitle === jobData.jobTitle || 
      (jobPost.companyName === jobData.companyName && jobPost.jobTitle === jobData.jobTitle)
    );
    
    // Use context data as base, fallback to original jobData
    const baseJobData = contextJob || jobData;    // Preserve all original job data and only update the modified fields
    const updatedJobData = {
      ...baseJobData,
      jobTitle: form.jobTitle,
      companyName: form.companyName,
      location: form.location,
      salary: form.salary,
      type: form.modality,
      employment: form.workType,
      description: form.description,
      availablePositions: form.availablePositions,
      tags: form.tags,
      category: form.category,
      proficiency: form.proficiency
    };
    onSave(updatedJobData);
    onClose();
  };
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
          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#3C3B3B] mb-1">
              Job Salary
            </label>            
            <div className="flex items-center gap-2">              
              <CustomDropdown
                options={salaryOptions}
                selected={form.salary}
                onSelect={(value) => handleDropdownSelect('salary', value)}
                placeholder="Action"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                dropdownKey="salary"
              />
              <span className="text-[16px] text-[#262424]">monthly</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[16px] text-[#3C3B3B]">
              Job Modality
            </label>              
            <CustomDropdown
              options={modalityOptions}
              selected={form.modality}
              onSelect={(value) => handleDropdownSelect('modality', value)}
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
              selected={form.workType}
              onSelect={(value) => handleDropdownSelect('workType', value)}
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
              selected={form.availablePositions}
              onSelect={(value) => handleDropdownSelect('availablePositions', value)}
              placeholder="Action"
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
                onSelect={(value) => setForm({ ...form, category: value, tags: [] })}
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
                selected={form.proficiency}
                onSelect={(value) => setForm({ ...form, proficiency: value })}
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
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-transparent text-[#FF8032] font-semibold border-2 border-[#FF8032] px-3 py-1 rounded-full text-[12px] flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-1 text-[12px] text-[#FF8032] hover:text-red-500"
                    onClick={() => handleTagRemove(tag)}
                  >
                    &times;
                  </button>
                </span>
              ))}
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
                  + Tag
                </button>
              )}            
            </div>
          </div>            
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="w-[202px] h-[50px] bg-white text-[#828283] text-[16px] font-bold border border-[#828283] font-bold rounded-3xl hover:bg-[#828283]/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!hasChanges}
              className={`w-[202px] h-[50px] font-bold rounded-3xl transition text-[16px] ${
                hasChanges 
                  ? 'bg-[#FF8032] text-white hover:bg-[#E66F24]' 
                  : 'bg-[#979797] text-white cursor-not-allowed'
              }`}
            >
              Save Changes            
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};

export default JobEditPost;