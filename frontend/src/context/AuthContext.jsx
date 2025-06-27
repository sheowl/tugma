import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import { supabase } from '../services/supabaseClient'; // Adjust the import based on your project structure

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // On mount, check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
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
  };

  return (
    <AuthContext.Provider value={{
      user,
      userType,
      loading,
      // ...other helpers
    }}>
      {children}
    </AuthContext.Provider>
  );
};
