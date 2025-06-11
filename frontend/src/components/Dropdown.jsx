import React, { useState, useRef, useEffect } from "react";

// reusable dropdown
const Dropdown = ({
  label,
  options = [], // sort by 
  onSelect,
  width = "w-40",
  buttonClass = "",
  dropdownClass = "",
  optionClass = "",
  zIndex = "z-30",
  customContent = null, // filter by
  color,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className={`relative flex flex-col items-end ${zIndex}`} ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-1 focus:outline-none rounded px-5 py-1 transition-colors duration-150 text-[16px] ${open ? `bg-[${color}] text-white min-w-[96px]` : 'bg-white text-[#000000]/20'} ${buttonClass}`}
        style={{ boxShadow: 'none', padding: 0 }}
      >
        <span className="w-full text-center">{label}</span>
        <i
          className={`bi bi-caret-down-fill text-base cursor-pointer ${open ? 'text-white' : 'text-[#000000]/20]'}`}
          style={{ marginLeft: 2 }}
        ></i>
      </button>
      {open && (
        <div
          className={`mt-2 ${width} border rounded shadow ${zIndex} bg-white text-[#6B7280] font-opensans text-[14px] font-semibold ${dropdownClass}`}
          style={{ position: 'absolute', top: '100%', right: 0 }}
        >
          {customContent}
        </div>
      )}
    </div>
  );
};

export default Dropdown;