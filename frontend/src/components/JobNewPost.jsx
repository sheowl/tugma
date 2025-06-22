import React, { useState } from "react";

//POST New Jobs
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

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
  };

  //POST new jobs
  const handleSubmit = e => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30">
      <div className="bg-white rounded-l-3xl shadow-lg p-10 w-full max-w-xl h-full overflow-y-auto relative flex flex-col">
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
            <input
              className="text-3xl font-bold text-[#232323] outline-none border-b-2 border-transparent focus:border-[#FF8032] w-full"
              name="jobTitle"
              placeholder="Job Title"
              value={form.jobTitle}
              onChange={handleChange}
              required
            />
            <div className="text-xl font-bold text-[#6B7280] mt-1">
              <input
                className="outline-none border-b-2 border-transparent focus:border-[#FF8032] w-full font-bold text-[#6B7280]"
                name="companyName"
                placeholder="Company Name"
                value={form.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="text-base text-[#6B7280] mt-1">
              <input
                className="outline-none border-b-2 border-transparent focus:border-[#FF8032] w-full text-[#6B7280]"
                name="location"
                placeholder="Job Location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#232323]">Job Salary</label>
            <div className="flex items-center gap-2">
              <input
                className="border rounded px-3 py-2 w-40"
                name="salary"
                placeholder="Amount"
                value={form.salary}
                onChange={handleChange}
                type="number"
                min="0"
              />
              <span className="text-[#6B7280]">monthly</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#232323]">Job Modality</label>
            <select
              className="border rounded px-3 py-2 w-60"
              name="modality"
              value={form.modality}
              onChange={handleChange}
              required
            >
              <option value="">Action</option>
              <option value="On-Site">On-Site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#232323]">Job Work Type</label>
            <select
              className="border rounded px-3 py-2 w-60"
              name="workType"
              value={form.workType}
              onChange={handleChange}
              required
            >
              <option value="">Action</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#232323]">Job Description</label>
            <textarea
              className="border rounded px-3 py-2"
              name="description"
              placeholder="Job Description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#232323]">Available positions</label>
            <input
              className="border rounded px-3 py-2 w-40"
              name="positions"
              placeholder="Number of positions"
              value={form.positions}
              onChange={handleChange}
              type="number"
              min="1"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#232323]">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-[#FF8032]/10 text-[#FF8032] px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-1 text-xs text-[#FF8032] hover:text-red-500"
                    onClick={() => handleTagRemove(tag)}
                  >
                    &times;
                  </button>
                </span>
              ))}
              {showTagInput ? (
                <input
                  className="border rounded px-2 py-1 text-sm w-24"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onBlur={() => setShowTagInput(false)}
                  onKeyDown={e => {
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
                  className="px-2 py-1 text-[#FF8032] border border-[#FF8032] rounded-full text-sm"
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