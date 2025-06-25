// Category mapping
export const getCategoryName = (categoryId) => {
  const categories = {
    1: "Web Development",
    2: "Programming Languages", 
    3: "Databases",
    4: "AI/ML/Data Science",
    5: "DevOps",
    7: "Cybersecurity",
    8: "Mobile Development",
    9: "Soft Skills",
    10: "Testing"
  };
  return categories[categoryId] || "No Category";
};

// Proficiency mapping
export const getProficiencyLevel = (proficiencyId) => {
  const proficiencyLevels = {
    1: "Level 1: Novice",
    2: "Level 2: Advanced Beginner",
    3: "Level 3: Competent", 
    4: "Level 4: Proficient",
    5: "Level 5: Expert"
  };
  return proficiencyLevels[proficiencyId] || "No Proficiency";
};

// Work setting mapping
export const getWorkSetting = (setting) => {
  const settings = {
    "hybrid": "Hybrid",
    "remote": "Remote",
    "onsite": "On-site",
    "on-site": "On-site"
  };
  return settings[setting?.toLowerCase()] || setting || "Remote";
};

// Work type mapping
export const getWorkType = (workType) => {
  const types = {
    "part-time": "Part-Time",
    "full-time": "Full-Time",
    "fulltime": "Full-Time",
    "contractual": "Contractual",
    "internship": "Internship"
  };
  return types[workType?.toLowerCase()] || workType || "Contractual";
};

// Export all mappings as an object for easier importing
export const JobMappings = {
  getCategoryName,
  getProficiencyLevel,
  getWorkSetting,
  getWorkType
};

// Export constants for direct access to mapping objects
export const CATEGORIES = {
  1: "Web Development",
  2: "Programming Languages", 
  3: "Databases",
  4: "AI/ML/Data Science",
  5: "DevOps",
  7: "Cybersecurity",
  8: "Mobile Development",
  9: "Soft Skills",
  10: "Testing"
};

export const PROFICIENCY_LEVELS = {
  1: "Level 1: Novice",
  2: "Level 2: Advanced Beginner",
  3: "Level 3: Competent", 
  4: "Level 4: Proficient",
  5: "Level 5: Expert"
};

export const WORK_SETTINGS = {
  "hybrid": "Hybrid",
  "remote": "Remote",
  "onsite": "On-site",
  "on-site": "On-site"
};

export const WORK_TYPES = {
  "part-time": "Part-Time",
  "full-time": "Full-Time",
  "fulltime": "Full-Time",
  "contractual": "Contractual",
  "internship": "Internship"
};