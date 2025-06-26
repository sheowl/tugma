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

// Function to get tag name by ID (fallback when tagMapping is not available)
export const getTagNameById = (tagId, tagMapping = {}) => {
  return tagMapping[tagId] || `Tag ${tagId}`;
};

// Function to map job tags from backend format with dynamic tag mapping
export const mapJobTags = (jobTags, tagMapping = {}) => {
  if (!jobTags || !Array.isArray(jobTags)) return [];
  
  return jobTags.map(tag => ({
    tag_id: tag.tag_id,
    is_required: tag.is_required,
    tag_name: getTagNameById(tag.tag_id, tagMapping)
  }));
};

// Main job mapping function with tag mapping support
export const mapJobData = (job, companyProfile = {}, tagMapping = {}) => {
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

    // Job tags mapping with dynamic tag names
    jobTags: mapJobTags(job.job_tags, tagMapping), // Map job tags with names from tagMapping
    jobTagIds: job.job_tags ? job.job_tags.map(tag => tag.tag_id) : [], // Just the IDs for easy access

    // Additional fields
    company_id: job.company_id,
  };
};
