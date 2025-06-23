import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import CompanyService from '../services/CompanyService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    const currentUserType = AuthService.getUserType();
    setUser(currentUser);
    setUserType(currentUserType);
    setLoading(false);
  }, []);

  // Company authentication methods
  const companyLogin = async (company_email, password) => {
    const result = await AuthService.companyLogin(company_email, password);
    if (result.success) {
      setUser(result.data.user);
      setUserType('employer');
    }
    return result;
  };

  const companySignup = async (company_email, password, company_name) => {
    const result = await AuthService.companySignup(company_email, password, company_name);
    if (result.success) {
      setUser(result.data.user);
      setUserType('employer');
    }
    return result;
  };

  // Applicant authentication methods
  const applicantLogin = async (email, password) => {
    const result = await AuthService.applicantLogin(email, password);
    if (result.success) {
      setUser(result.data.user);
      setUserType('applicant');
    }
    return result;
  };

  const applicantSignup = async (email, password, userData) => {
    const result = await AuthService.applicantSignup(email, password, userData);
    if (result.success) {
      setUser(result.data.user);
      setUserType('applicant');
    }
    return result;
  };

  // Generic login method (backwards compatibility)
  const login = async (identifier, password, type = 'company') => {
    if (type === 'company') {
      return await companyLogin(identifier, password);
    } else {
      return await applicantLogin(identifier, password);
    }
  };

  // Generic register method (backwards compatibility)
  const register = async (userData, type = 'company') => {
    if (type === 'company') {
      return await companySignup(userData.email, userData.password, userData.company_name);
    } else {
      return await applicantSignup(userData.email, userData.password, userData);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setUserType(null);
  };

  // Helper methods
  const isEmployer = () => userType === 'employer';
  const isApplicant = () => userType === 'applicant';
  const isAuthenticated = () => !!user && !!userType;

  // Company-specific methods
  const getCompanyProfile = async () => {
    if (!isEmployer()) {
      throw new Error('Only employers can access company profile');
    }
    return await AuthService.getCompanyProfile();
  };

  const updateCompanyProfile = async (data) => {
    if (!isEmployer()) {
      throw new Error('Only employers can update company profile');
    }
    return await AuthService.updateCompanyProfile(data);
  };

  const completeOnboarding = async (data) => {
    if (!isEmployer()) {
      throw new Error('Only employers can complete onboarding');
    }
    return await CompanyService.completeOnboarding(data);
  };

  const getOnboardingStatus = async () => {
    if (!isEmployer()) {
      throw new Error('Only employers can check onboarding status');
    }
    return await CompanyService.getOnboardingStatus();
  };

  const value = {
    // State
    user,
    userType,
    loading,
    
    // Authentication methods
    login,
    register,
    logout,
    
    // Company-specific methods
    companyLogin,
    companySignup,
    
    // Applicant-specific methods
    applicantLogin,
    applicantSignup,
    
    // Helper methods
    isEmployer,
    isApplicant,
    isAuthenticated,
    
    // Company profile methods
    getCompanyProfile,
    updateCompanyProfile,
    completeOnboarding,
    getOnboardingStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
