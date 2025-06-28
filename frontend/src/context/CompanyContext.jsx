import React, { createContext, useContext, useState, useEffect } from 'react';
import CompanyService from '../services/CompanyService';
import AuthService from '../services/AuthService'; // ⭐ ADD THIS
import { useAuth } from './AuthContext';

const CompanyContext = createContext();

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
  const { isEmployer } = useAuth();
  const [companyProfile, setCompanyProfile] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [jobApplicants, setJobApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // ⭐ ADD AUTH TOKEN STATE
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ⭐ INITIALIZE AUTH STATE ON MOUNT
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    const token = AuthService.getToken();
    const userData = AuthService.getCurrentUser();
    const userType = AuthService.getUserType();
    
    console.log('🔍 CompanyContext Auth Initialization:', {
      token: token ? 'Present' : 'Missing',
      userData: userData ? 'Present' : 'Missing',
      userType: userType
    });
    
    if (token && userType === 'employer') {
      setAuthToken(token);
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      setAuthToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Profile operations
  const getCompanyProfile = async () => {
    if (!isEmployer()) {
      throw new Error('Only employers can access company profile');
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await CompanyService.getProfile();
      console.log('Profile response:', response);
      setCompanyProfile(response);
      return response;
    } catch (err) {
      console.error('Error getting profile:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyProfile = async (data) => {
    if (!isEmployer()) {
      throw new Error('Only employers can update company profile');
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log('Updating profile with data:', data);
      const response = await CompanyService.updateProfile(data);
      console.log('Update response:', response);
      setCompanyProfile(response);
      return response;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Onboarding operations
  const completeOnboarding = async (data) => {
    if (!isEmployer()) {
      throw new Error('Only employers can complete onboarding');
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await CompanyService.completeOnboarding(data);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOnboardingStatus = async () => {
    if (!isEmployer()) {
      throw new Error('Only employers can check onboarding status');
    }
    
    setLoading(true);
    setError(null);
    try {
      const status = await CompanyService.getOnboardingStatus();
      return status;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Dashboard operations
  const getDashboardStats = async () => {
    if (!isEmployer()) {
      throw new Error('Only employers can access dashboard stats');
    }
    
    setLoading(true);
    setError(null);
    try {
      const stats = await CompanyService.getDashboardStats();
      setDashboardStats(stats);
      return stats;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRecentApplicants = async () => {  // Remove limit parameter
    if (!isEmployer()) {
      throw new Error('Only employers can access recent applicants');
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await CompanyService.getRecentApplicants(); // No limit passed
      setRecentApplicants(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Job operations
  const getCompanyJobs = async () => {
    if (!isEmployer()) {
      throw new Error('Only employers can access company jobs');
    }
    
    setLoading(true);
    setError(null);
    try {
      const jobs = await CompanyService.getMyJobs();
      setCompanyJobs(jobs.jobs || jobs);
      return jobs;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData) => {
    console.log('🔄 CompanyContext: Creating job...', jobData);
    
    // Add guard to prevent duplicate calls
    if (loading) {
      console.log('❌ Already creating job, ignoring duplicate call');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await CompanyService.createJob(jobData);
      console.log('✅ CompanyContext: Job created successfully');
      
      // Refresh jobs list
      await getCompanyJobs();
      return result;
    } catch (err) {
      console.error('❌ CompanyContext: Error creating job:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (jobId, jobData) => {
    if (!isEmployer()) {
      throw new Error('Only employers can update jobs');
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 CompanyContext: Updating job with ID:', jobId);
      console.log('📝 CompanyContext: Job data:', jobData);
      
      const updatedJob = await CompanyService.updateJob(jobId, jobData);
      console.log('✅ CompanyContext: Job updated successfully:', updatedJob);
      
      // Refresh jobs list after update
      await getCompanyJobs();
      return updatedJob;
    } catch (err) {
      console.error('❌ CompanyContext: Error updating job:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!isEmployer()) {
      throw new Error('Only employers can delete jobs');
    }
    
    setLoading(true);
    setError(null);
    try {
      await CompanyService.deleteJob(jobId);
      // Refresh jobs list
      await getCompanyJobs();
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Applicant operations
  const getApplicants = async (jobId = null) => {
    if (!isEmployer()) {
      throw new Error('Only employers can access applicants');
    }
    
    setLoading(true);
    setError(null);
    try {
      const applicants = await CompanyService.getApplicants(jobId);
      return applicants;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add new method for job-specific applicants
  const getJobApplicants = async (jobId) => {
    if (!isEmployer()) {
      throw new Error('Only employers can access job applicants');
    }
    
    if (!jobId) {
      throw new Error('Job ID is required');
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log(`🔍 Fetching applicants for job ID: ${jobId}`);
      const response = await CompanyService.getJobApplicants(jobId);
      console.log('📋 Job applicants response:', response);
      
      setJobApplicants(response.applicants || []);
      return response;
    } catch (err) {
      console.error('❌ Error fetching job applicants:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    // State
    companyProfile,
    dashboardStats,
    recentApplicants,
    companyJobs,
    jobApplicants,
    loading,
    error,
    
    // ⭐ ADD AUTH-RELATED VALUES
    authToken,
    user,
    isAuthenticated,
    
    // ⭐ ADD AUTH METHODS
    initializeAuth,
    
    // Profile operations
    getCompanyProfile,
    updateCompanyProfile,
    
    // Onboarding operations
    completeOnboarding,
    getOnboardingStatus,
    
    // Dashboard operations
    getDashboardStats,
    getRecentApplicants,
    
    // Job operations
    getCompanyJobs,
    createJob,
    updateJob,
    deleteJob,
    
    // Applicant operations
    getApplicants,
    getJobApplicants, // Add this to the context value
    
    // Utility
    clearError,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};