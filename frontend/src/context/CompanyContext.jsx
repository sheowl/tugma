import React, { createContext, useContext, useState, useEffect } from 'react';
import CompanyService from '../services/CompanyService';
import { useAuth } from './AuthContext';

const CompanyContext = createContext();

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
  const { isEmployer } = useAuth();
  const [companyProfile, setCompanyProfile] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const getRecentApplicants = async (limit = 3) => {
    if (!isEmployer()) {
      throw new Error('Only employers can access recent applicants');
    }
    
    setLoading(true);
    setError(null);
    try {
      const applicants = await CompanyService.getRecentApplicants(limit);
      setRecentApplicants(applicants);
      return applicants;
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
    if (!isEmployer()) {
      throw new Error('Only employers can create jobs');
    }
    
    setLoading(true);
    setError(null);
    try {
      // Transform frontend data to backend format
      const backendJobData = {
        job_title: jobData.jobTitle,
        salary_min: parseInt(jobData.salaryMin) || 0,
        salary_max: parseInt(jobData.salaryMax) || 0,
        setting: jobData.type,
        work_type: jobData.employment,
        description: jobData.description,
        position_count: parseInt(jobData.availablePositions) || 1,
        required_category_id: jobData.category ? parseInt(jobData.category) : null,
        required_proficiency: jobData.proficiency ? parseInt(jobData.proficiency) : null,
        job_tags: jobData.selectedTags || [] // NEW: Send tag IDs as array
      };

      console.log('CompanyContext: Creating job with data:', backendJobData);
      
      const response = await CompanyService.createJob(backendJobData);
      
      console.log('CompanyContext: Job created successfully:', response);
      
      return response;
    } catch (error) {
      console.error('CompanyContext: Error creating job:', error);
      setError(error.message || 'Failed to create job');
      throw error;
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
      // Transform frontend data to backend format
      const backendJobData = {
        job_title: jobData.jobTitle,
        salary_min: parseInt(jobData.salaryMin) || 0,
        salary_max: parseInt(jobData.salaryMax) || 0,
        setting: jobData.type,
        work_type: jobData.employment,
        description: jobData.description,
        position_count: parseInt(jobData.availablePositions) || 1,
        required_category_id: jobData.category ? parseInt(jobData.category) : null,
        required_proficiency: jobData.proficiency ? parseInt(jobData.proficiency) : null,
        job_tags: jobData.selectedTags || [] // NEW: Send tag IDs as array
      };

      console.log('CompanyContext: Updating job with data:', backendJobData);
      
      const response = await CompanyService.updateJob(jobId, backendJobData);
      
      console.log('CompanyContext: Job updated successfully:', response);
      
      return response;
    } catch (error) {
      console.error('CompanyContext: Error updating job:', error);
      setError(error.message || 'Failed to update job');
      throw error;
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
    loading,
    error,
    
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
    
    // Utility
    clearError,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};