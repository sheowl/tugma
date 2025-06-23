import React, { useState } from "react";

<<<<<<< HEAD
//POST New Jobs
=======
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

const positionOptions = Array.from({ length: 20 }, (_, i) => ({
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

// Reusable Dropdown
const CustomDropdown = ({
  options,
  selected,
  onSelect,
  placeholder,
  openDropdown,
  setOpenDropdown,
  dropdownKey,
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
          {selectedLabel} <i className="bi bi-caret-down-fill text-xs" />
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

>>>>>>> frontend
const JobNewPost = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
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

  const [tagInput, setTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [selectedModality, setSelectedModality] = useState(null);
  const [selectedWorkType, setSelectedWorkType] = useState(null);
  const [availablePositions, setAvailablePositions] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [description, setDescription] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null); // shared state
  const [showPencil, setShowPencil] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

<<<<<<< HEAD
  //POST new jobs
  const handleSubmit = e => {
=======
  const handleSubmit = (e) => {
>>>>>>> frontend
    e.preventDefault();
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
        if (onSave) onSave(data); // Optionally notify parent
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
        // Optionally show error to user
        console.error(err);
      });
  };

  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-end bg-black/30 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white rounded-l-3xl shadow-lg p-10 w-full max-w-xl h-full overflow-y-auto relative flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Close Button */}
        <button
          className="absolute top-6 left-6 text-3xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &#8592;
        </button>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-10">
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
            <div className="text-[20px] font-bold text-[#6B7280] mt-1">
              <input
                className="outline-none border-b-2 border-[transparent] focus:border-[#FF8032] w-full font-bold text-[#6B7280] placeholder:text-[20px] placeholder:font-bold placeholder:text-[#6B7280]"
                name="companyName"
                placeholder="Company Name"
                value={form.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="text-[16px] text-[#6B7280] mt-1">
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
            <CustomDropdown
              options={salaryOptions}
              selected={selectedSalary}
              onSelect={setSelectedSalary}
              placeholder="Action"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              dropdownKey="salary"
            />
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

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[16px] text-[#3C3B3B]">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#FF8032]/10 text-[#FF8032] px-3 py-1 rounded-full text-[12px] flex items-center gap-1"
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
                  className="w-[53px] px-2 py-1 text-[#FF8032] border-2 border-[#FF8032] rounded-full text-[12px] font-semibold hover:bg-[#FF8032]/10 transition"
                  onClick={() => setShowTagInput(true)}
                >
                  + Tag
                </button>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="bg-[#FF8032] text-white font-bold py-3 rounded-lg mt-4 hover:bg-[#ff984d] transition text-lg"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobNewPost;