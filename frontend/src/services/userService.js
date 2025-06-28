import { supabase } from "./supabaseClient";

// // Mock data for testing
// const mockUserDetails = {
//   contactDetails: {
//     currentAddress: "#1 Kurt St. Brgy. Mapagmahal Silang, Cavite",
//     contactNumber: "0992 356 7294",
//     telephoneNumber: "8153-4137",
//   },
//   educationDetails: {
//     university: "Polytechnic University of the Philippines",
//     degree: "Bachelor of Science in Computer Science",
//     yearGraduated: "2027",
//   },
//   workExperiences: [],
//   field: "",
// };

// Fetch user details (real API)
export const fetchUserDetails = async (useMock = false) => {
  if (useMock) {
    // Simulate an asynchronous call with mock data
    return new Promise((resolve) => setTimeout(() => resolve(mockUserDetails), 500));
  }

  // Get the current session and access token
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;
  if (!accessToken) return null;

  // Call your backend API to get user details
  const res = await fetch("http://localhost:8000/api/v1/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const userData = await res.json();

  // You may need to transform userData to match your frontend structure
  // For example:
  return {
    contactDetails: {
      currentAddress: userData.database_user.current_address || "",
      contactNumber: userData.database_user.contact_number || "",
      telephoneNumber: userData.database_user.telephone_number || "",
    },
    educationDetails: {
      university: userData.database_user.university || "",
      degree: userData.database_user.degree || "",
      yearGraduated: userData.database_user.year_graduated || "",
    },
    workExperiences: userData.database_user.work_experiences || [],
    field: userData.database_user.field || "",
  };
};

// Save user details (real API)
export const saveUserDetails = async (userDetails, useMock = false) => {
  if (useMock) {
    console.log("Mock Save:", userDetails);
    return new Promise((resolve) => setTimeout(() => resolve(true), 500));
  }
  // Real API call
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;
  if (!accessToken) return false;

  // Call your backend API to save user details (adjust endpoint as needed)
  const res = await fetch("http://localhost:8000/api/v1/applicants/onboarding-details", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(userDetails),
  });
  return res.ok;
};