// Fallback category mapping (in case database is not available)
const FALLBACK_CATEGORIES = {
  1: "Web Development",
  2: "Programming Languages", 
  3: "Databases",
  4: "AI/ML/Data Science",
  5: "DevOps",
  7: "Cybersecurity",
  8: "Mobile Development",
  9: "Soft Skills"
};

// Fallback proficiency mapping
const FALLBACK_PROFICIENCY_LEVELS = {
  1: "Level 1: Novice",
  2: "Level 2: Advanced Beginner",
  3: "Level 3: Competent", 
  4: "Level 4: Proficient",
  5: "Level 5: Expert"
};

// Category mapping with fallback
export const getCategoryName = (categoryId, categoryMapping = null) => {
  if (categoryMapping) {
    return categoryMapping[categoryId] || "No Category";
  }
  return FALLBACK_CATEGORIES[categoryId] || "No Category";
};

// Proficiency mapping (static - assuming this doesn't change often)
export const getProficiencyLevel = (proficiencyId) => {
  return FALLBACK_PROFICIENCY_LEVELS[proficiencyId] || "No Proficiency";
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

// Helper functions for dropdown options using dynamic data
export const getCategoryOptions = (categoryMapping = null) => {
  const mapping = categoryMapping || FALLBACK_CATEGORIES;
  return Object.entries(mapping)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([id, name]) => ({
      value: parseInt(id),
      label: name
    }));
};

export const getProficiencyOptions = () => {
  return Object.entries(FALLBACK_PROFICIENCY_LEVELS)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([id, level]) => ({
      value: parseInt(id),
      label: level
    }));
};

// Export all mappings as an object for easier importing
export const JobMappings = {
  getCategoryName,
  getProficiencyLevel,
  getWorkSetting,
  getWorkType,
  getCategoryOptions,
  getProficiencyOptions
};

// Export constants for backward compatibility (fallback values)
export const CATEGORIES = FALLBACK_CATEGORIES;
export const PROFICIENCY_LEVELS = FALLBACK_PROFICIENCY_LEVELS;

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

// utils/jobMapping.js
// Helper function to format salary range for display only
const formatSalary = (salary) => {
  if (!salary || salary < 1000) return "1K"; // Floor salary to 1000
  return `${Math.floor(salary / 1000)}K`; // Convert to "K" format
};

// Helper function to calculate days ago
const calculateDaysAgo = (createdAt) => {
  if (!createdAt) return 0;
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Tag ID to name mapping (you should fetch this from your tags API)
const TAG_MAPPING = {
  1: "JavaScript",
  2: "Python", 
  3: "React",
  4: "Node.js",
  5: "Java",
  6: "SQL",
  7: "HTML/CSS",
  8: "TypeScript",
  9: "PHP",
  10: "C++",
  11: "C#",
  12: "MongoDB",
  13: "PostgreSQL",
  14: "AWS",
  15: "Docker",
  16: "Git",
  17: "Linux",
  18: "Angular",
  19: "Vue.js",
  20: "Laravel"
  // Add more mappings as needed
};

// Function to get tag name by ID
export const getTagNameById = (tagId) => {
  return TAG_MAPPING[tagId] || `Tag ${tagId}`;
};

// Function to map job tags from backend format
export const mapJobTags = (jobTags) => {
  if (!jobTags || !Array.isArray(jobTags)) return [];
  
  return jobTags.map(tag => ({
    tag_id: tag.tag_id,
    is_required: tag.is_required,
    tag_name: getTagNameById(tag.tag_id)
  }));
};

// Main job mapping function
export const mapJobData = (job, companyProfile = {}) => {
  return {
    id: job.job_id, // Backend: job_id → Frontend: id
    jobTitle: job.job_title, // Backend: job_title → Frontend: jobTitle
    companyName: companyProfile.company_name || "Company Name", // Use company info
    location: companyProfile.location || "Location not specified", // Use company location
    type: job.setting, // Backend: setting → Frontend: type
    employment: job.work_type, // Backend: work_type → Frontend: employment
    description: job.description || "No description available",
    status: job.status || "Active",

    // Keep raw salary values for editing
    salaryMin: parseInt(job.salary_min, 10) || 0, // Keep as numbers for editing
    salaryMax: parseInt(job.salary_max, 10) || 0, // Keep as numbers for editing
    
    // Formatted salary for display
    salaryMinDisplay: formatSalary(parseInt(job.salary_min, 10)), 
    salaryMaxDisplay: formatSalary(parseInt(job.salary_max, 10)),
    salaryRange: `${formatSalary(parseInt(job.salary_min, 10))} - ${formatSalary(parseInt(job.salary_max, 10))}`, // Combined range for display

    // Position mapping
    availablePositions: parseInt(job.position_count, 10) || 0, // Parse position_count

    // Add applicant count from backend
    applicantCount: parseInt(job.applicant_count, 10) || 0, // Backend: applicant_count → Frontend: applicantCount

    // Category and proficiency mapping
    category: parseInt(job.required_category_id, 10) || null, // Parse required_category_id
    proficiency: parseInt(job.required_proficiency, 10) || null, // Parse required_proficiency

    // Dates
    dateAdded: job.date_added,
    createdAt: job.created_at,
    postedDaysAgo: calculateDaysAgo(job.created_at),

    // NEW: Job tags mapping
    jobTags: mapJobTags(job.job_tags), // Map job tags with names
    jobTagIds: job.job_tags ? job.job_tags.map(tag => tag.tag_id) : [], // Just the IDs for easy access

    // Additional fields
    company_id: job.company_id,
  };
};