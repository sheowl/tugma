import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-4">
      <input
        type="text"
        className="flex-1 border border-gray-400 rounded-[16px] px-6 py-3 text-[18px] outline-none"
        placeholder="What job are you looking for?"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="flex items-center gap-2 bg-[#FF8032] hover:bg-[#ff984d] text-white font-bold rounded-[12px] px-8 py-3 text-[18px] transition"
      >
        <FiSearch size={22} />
        Search
      </button>
    </form>
  );
};

export default SearchBar;