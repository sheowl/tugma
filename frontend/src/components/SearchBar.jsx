import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ onSearch, mode = "applicant" }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  // Determine placeholder and styles based on mode
  const isEmployerMode = mode === "employer";
  const placeholderText = isEmployerMode
    ? "Search for applicants..."
    : "What job are you looking for?";
  const buttonColor = isEmployerMode
    ? "bg-[#FF8032] hover:bg-[#ff984d]" // Employer mode: Blue
    : "bg-[#2A4D9B] hover:bg-[#1f3c7b]"; // Applicant mode: Orange

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-4">
      <input
        type="text"
        className="flex-1 border border-gray-400 rounded-[16px] px-6 py-3 text-[18px] outline-none"
        placeholder={placeholderText}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className={`flex items-center gap-2 ${buttonColor} text-white font-bold rounded-[12px] px-8 py-3 text-[18px] transition`}
      >
        <FiSearch size={22} />
        Search
      </button>
    </form>
  );
};

export default SearchBar;