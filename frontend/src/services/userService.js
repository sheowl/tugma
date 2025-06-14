// Mock data for testing
const mockUserDetails = {
  contactDetails: {
    currentAddress: "123 Mock St.",
    contactNumber: "1234567890",
    telephoneNumber: "0987654321",
  },
  educationDetails: {
    university: "Mock University",
    degree: "Mock Degree",
    yearGraduated: "2025",
  },
  workExperiences: [],
  field: "",
};

// Fetch user details (mock or real)
export const fetchUserDetails = async (useMock = true) => {
  if (useMock) {
    // Simulate an asynchronous call with mock data
    return new Promise((resolve) => setTimeout(() => resolve(mockUserDetails), 500));
  }
  // Replace this with a real database call (e.g., API request)
  // Example: return await axios.get('/api/user/details');
};

// Save user details (mock or real)
export const saveUserDetails = async (userDetails, useMock = true) => {
  if (useMock) {
    console.log("Mock Save:", userDetails);
    return new Promise((resolve) => setTimeout(() => resolve(true), 500));
  }
  // Replace this with a real database call (e.g., API request)
  // Example: return await axios.post('/api/user/details', userDetails);
};