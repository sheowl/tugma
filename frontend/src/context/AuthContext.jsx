import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setUserType(session.user.user_metadata?.user_type || null);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    let mounted = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Only process if component is still mounted and session actually changed
        if (!mounted) return;
        
        // Ignore token refresh events if user data hasn't changed
        if (event === 'TOKEN_REFRESHED' && user?.id === session?.user?.id) {
          return;
        }
        
        if (session?.user) {
          // Only update if user actually changed
          if (!user || user.id !== session.user.id) {
            setUser(session.user);
            setUserType(session.user.user_metadata?.user_type || null);
          }
        } else {
          setUser(null);
          setUserType(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Company authentication methods using Supabase
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

  // Applicant authentication methods using Supabase
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

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    setUserType(null);
  };

  // Check functions using Supabase session
  const isAuthenticated = () => {
    return !!user;
  };

  const isEmployer = () => {
    return userType === 'employer' || user?.user_metadata?.user_type === 'employer';
  };

  const isApplicant = () => {
    return userType === 'applicant' || user?.user_metadata?.user_type === 'applicant';
  };

  const value = {
    // State
    user,
    userType,
    loading,
    
    // Authentication methods
    logout,
    isAuthenticated,
    
    // Company-specific methods
    companyLogin,
    companySignup,
    
    // Applicant-specific methods
    applicantLogin,
    applicantSignup,
    
    // Helper methods
    isEmployer,
    isApplicant,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
