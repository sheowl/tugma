import React, { createContext, useContext, useReducer, useEffect } from 'react';
import jobService from '../services/jobService';

const JobsContext = createContext();

// Action types
const JOBS_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_JOBS: 'SET_JOBS',
  ADD_JOB: 'ADD_JOB',
  UPDATE_JOB: 'UPDATE_JOB',
  DELETE_JOB: 'DELETE_JOB',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  jobs: [],
  loading: false,
  error: null
};

// Reducer
function jobsReducer(state, action) {
  switch (action.type) {
    case JOBS_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case JOBS_ACTIONS.SET_JOBS:
      return { ...state, jobs: action.payload, loading: false, error: null };
    
    case JOBS_ACTIONS.ADD_JOB:
      return { 
        ...state, 
        jobs: [action.payload, ...state.jobs], 
        loading: false, 
        error: null 
      };
    
    case JOBS_ACTIONS.UPDATE_JOB:
      return {
        ...state,
        jobs: state.jobs.map(job => 
          job.id === action.payload.id ? action.payload : job
        ),
        loading: false,
        error: null
      };
    
    case JOBS_ACTIONS.DELETE_JOB:
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== action.payload),
        loading: false,
        error: null
      };
    
    case JOBS_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case JOBS_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
}

// Provider component
export function JobsProvider({ children }) {
  const [state, dispatch] = useReducer(jobsReducer, initialState);

  // Simplified fetch jobs (backend already includes applicant counts)
  const fetchJobs = async (companyId = 2) => {
    dispatch({ type: JOBS_ACTIONS.SET_LOADING, payload: true });
    try {
      const backendJobs = await jobService.getCompanyJobs(companyId);
      console.log('Raw backend jobs:', backendJobs); // Debug log
      
      // Transform jobs (applicant_count already included from backend)
      const transformedJobs = backendJobs.map(job => {
        const transformed = jobService.transformJobData(job);
        console.log('Transformed job:', transformed); // Debug log
        return transformed;
      });
      
      dispatch({ type: JOBS_ACTIONS.SET_JOBS, payload: transformedJobs });
    } catch (error) {
      console.error('Error in fetchJobs:', error);
      dispatch({ type: JOBS_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Fetch all jobs (also with applicant counts from backend)
  const fetchAllJobs = async () => {
    dispatch({ type: JOBS_ACTIONS.SET_LOADING, payload: true });
    try {
      const backendJobs = await jobService.getAllJobs();
      console.log('Raw backend jobs (all):', backendJobs); // Debug log
      
      const transformedJobs = backendJobs.map(job => {
        const transformed = jobService.transformJobData(job);
        console.log('Transformed job (all):', transformed); // Debug log
        return transformed;
      });
      
      dispatch({ type: JOBS_ACTIONS.SET_JOBS, payload: transformedJobs });
    } catch (error) {
      console.error('Error in fetchAllJobs:', error);
      dispatch({ type: JOBS_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const createJob = async (jobData) => {
    dispatch({ type: JOBS_ACTIONS.SET_LOADING, payload: true });
    try {
      const backendJobData = jobService.transformToBackendFormat(jobData);
      console.log('Creating job with data:', backendJobData); // Debug log
      
      const newJob = await jobService.createJob(backendJobData);
      console.log('Created job response:', newJob); // Debug log
      
      const transformedJob = jobService.transformJobData(newJob);
      dispatch({ type: JOBS_ACTIONS.ADD_JOB, payload: transformedJob });
      return transformedJob;
    } catch (error) {
      console.error('Error in createJob:', error);
      dispatch({ type: JOBS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateJob = async (jobId, jobData) => {
    dispatch({ type: JOBS_ACTIONS.SET_LOADING, payload: true });
    try {
      const backendJobData = jobService.transformToBackendFormat(jobData);
      const updatedJob = await jobService.updateJob(jobId, backendJobData);
      const transformedJob = jobService.transformJobData(updatedJob);
      dispatch({ type: JOBS_ACTIONS.UPDATE_JOB, payload: transformedJob });
      return transformedJob;
    } catch (error) {
      dispatch({ type: JOBS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const deleteJob = async (jobId) => {
    dispatch({ type: JOBS_ACTIONS.SET_LOADING, payload: true });
    try {
      await jobService.deleteJob(jobId);
      dispatch({ type: JOBS_ACTIONS.DELETE_JOB, payload: jobId });
    } catch (error) {
      dispatch({ type: JOBS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: JOBS_ACTIONS.CLEAR_ERROR });
  };

  // Auto-fetch company jobs on mount
  useEffect(() => {
    // Only fetch if logged in and company_id exists
    const accessToken = localStorage.getItem("access_token");
    const companyId = localStorage.getItem("company_id");
    if (accessToken && companyId) {
      fetchJobs(companyId);
    }
  }, []);

  const value = {
    jobs: state.jobs,
    loading: state.loading,
    error: state.error,
    fetchJobs,
    fetchAllJobs,
    createJob,
    updateJob,
    deleteJob,
    clearError
  };

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
}

// Custom hook - MUST BE EXPORTED
export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}

// Export the context as well for direct access if needed
export { JobsContext };