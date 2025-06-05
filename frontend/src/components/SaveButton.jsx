import React, { useState } from "react";
import ActiveSaveIcon from "../assets/ActiveSaveIcon.svg";
import InactiveSaveIcon from "../assets/InactiveSaveIcon.svg";

function SaveButton({ className = "" }) {
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <button onClick={toggleSave} className={`p-1 ${className}`}>
       <img
        src={isSaved ? ActiveSaveIcon : InactiveSaveIcon}
        alt="Save"
        className="" // you can adjust size here
      />
    </button>
  );
}

export default SaveButton;
