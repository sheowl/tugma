// Mock data for testing
const mockUserDetails = {
  contactDetails: {
    currentAddress: "#1 Kurt St. Brgy. Mapagmahal Silang, Cavite",
    contactNumber: "0992 356 7294",
    telephoneNumber: "8153-4137",
  },
  educationDetails: {
    university: "Polytechnic University of the Philippines",
    degree: "Bachelor of Science in Computer Science",
    yearGraduated: "2027",
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