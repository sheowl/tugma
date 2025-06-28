import React, { useState, useEffect } from "react";
import { Mail, PhoneCall } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCompany } from "../context/CompanyContext";
import Dropdown from "./Dropdown";

const ApplicationFullDetails = ({ open, onClose, applicant, jobId, onStatusUpdate, applicantTags = [], tagNames = [] }) => {
  const navigate = useNavigate();
  
  // Use CompanyContext for authentication and API calls
  const { authToken, user, isAuthenticated, loading: contextLoading, getCompanyProfile } = useCompany();
  
  const [applicationStatus, setApplicationStatus] = useState("applied");
  const [finalDecision, setFinalDecision] = useState(null);
  const [isInterviewConfirmed, setIsInterviewConfirmed] = useState(false);
  const [appliedTimestamp] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [profileFetched, setProfileFetched] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [remarksText, setRemarksText] = useState("");
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [interviewExists, setInterviewExists] = useState(false);
  const [interviewData, setInterviewData] = useState({
    jobTitle: applicant?.jobTitle || "Software Developer",
    company: "Loading...",
    interview_type: "",
    interview_date: "",
    interview_time: "",
    remarks: "",
    interview_status: "confirmed",
    applicant_id: applicant?.applicant_id || 0,
    job_id: jobId || 0
  });

  // Add missing variables
  const matchScoreColor = applicant?.matched >= 80 ? "text-green-600" : 
                         applicant?.matched >= 60 ? "text-yellow-600" : "text-red-600";

  const tempContactInfo = {
    location: applicant?.location || "Location not provided",
    phone: applicant?.phone || "+1 (555) 123-4567",
    email: applicant?.email || "email@example.com"
  };

  const tempSkillMatches = {
    matched: applicant?.matchedSkills || ["JavaScript", "React", "Node.js"],
    notMatched: applicant?.unmatchedSkills || ["Python", "Django"],
    moreNotMatched: applicant?.moreUnmatched || 0
  };

  // Fetch company profile when component opens - only once
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      if (open && getCompanyProfile && !profileFetched) {
        try {
          setProfileFetched(true); // Set flag before making request
          const profile = await getCompanyProfile();
          if (profile) {
            setCompanyProfile(profile);
            setInterviewData(prev => ({
              ...prev,
              company: profile.company_name || "Company Name"
            }));
          }
        } catch (error) {
          console.error('Failed to fetch company profile:', error);
          // Fallback to default
          setInterviewData(prev => ({
            ...prev,
            company: "Microsoft"
          }));
        }
      }
    };

    fetchCompanyProfile();
  }, [open, getCompanyProfile, profileFetched]);

  // Reset profile fetched flag when component closes
  useEffect(() => {
    if (!open) {
      setProfileFetched(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && applicant) {
      // Use the actual status from the applicant data
      setApplicationStatus(applicant.status || "applied");
      setIsInterviewConfirmed(false);
      setFinalDecision(null);
      setError(null);
      setInterviewExists(false);
      
      setInterviewData(prev => ({
        jobTitle: applicant?.jobTitle || "Software Developer",
        company: companyProfile?.company_name || "Loading...",
        interview_type: "",
        interview_date: "",
        interview_time: "",
        remarks: "Please ensure that you are available at the scheduled time, as rescheduling opportunities may be limited. We encourage you to research our company, review the job description, our company background, and prepare any relevant materials or portfolio beforehand. More detailed instructions, including the interview link and any attachments, have been sent to your registered email. Should you have any unavoidable conflicts, inform us as soon as possible.",
        interview_status: "confirmed",
        applicant_id: applicant.applicant_id,
        job_id: jobId
      }));

      // Check if interview already exists when status is interview
      if (applicant.status === "interview") {
        checkExistingInterview();
      }
    }
  }, [open, applicant, jobId, companyProfile]);

  // Check if interview already exists
  const checkExistingInterview = async () => {
    try {
      const token = getAuthToken();
      if (!token) return false;

      const response = await fetch(`http://localhost:8000/api/v1/interviews/${applicant.applicant_id}/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const interview = await response.json();
        if (interview) {
          setInterviewExists(true);
          setIsInterviewConfirmed(true);
          setInterviewData(prev => ({
            ...prev,
            interview_type: interview.interview_type,
            interview_date: interview.interview_date,
            interview_time: interview.interview_time?.replace('.000Z', ''),
            remarks: interview.remarks,
            interview_status: interview.interview_status
          }));
          return true;
        }
      } else if (response.status === 404) {
        // Interview not found - show interview creator
        setInterviewExists(false);
        setIsInterviewConfirmed(false);
        return false;
      }
      return false;
    } catch (error) {
      console.log('No existing interview found or error checking:', error);
      setInterviewExists(false);
      setIsInterviewConfirmed(false);
      return false;
    }
  };

  // Get auth token with fallback to localStorage
  const getAuthToken = () => {
    // First try to get from context
    if (authToken) {
      console.log('✅ Using token from CompanyContext');
      return authToken;
    }
    
    // Fallback to localStorage
    const localToken = localStorage.getItem('company_token') || 
                     localStorage.getItem('authToken') || 
                     localStorage.getItem('token');
    
    if (localToken) {
      console.log('✅ Using token from localStorage');
      return localToken;
    }
    
    console.log('❌ No token found in context or localStorage');
    return null;
  };

  // API call to update application status
  const updateApplicationStatus = async (newStatus, remarks = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      console.log(`🔄 Updating application status to: ${newStatus}`);
      console.log(`📋 Applicant ID: ${applicant.applicant_id}, Job ID: ${jobId}`);

      const response = await fetch(`http://localhost:8000/api/v1/applications/${applicant.applicant_id}/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          remarks: remarks
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to update application status';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Status updated:', result);
      
      // Update local state
      setApplicationStatus(newStatus);
      
      // If updating to interview, check for existing interview
      if (newStatus === 'interview') {
        if (result.predefined_remarks) {
          setInterviewData(prev => ({
            ...prev,
            remarks: result.predefined_remarks
          }));
        }
        // Check if interview already exists
        await checkExistingInterview();
      }
      
      // Notify parent component
      if (onStatusUpdate) {
        onStatusUpdate(applicant.applicant_id, newStatus);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error updating application status:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // API call to create interview
  const createInterview = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Format time properly - ensure it's in HH:MM:SS.000Z format
      let formattedTime = interviewData.interview_time;
      if (formattedTime && !formattedTime.includes(':00.000Z')) {
        formattedTime = formattedTime + ":00.000Z";
      }

      // Prepare interview data for API
      const interviewPayload = {
        interview_type: interviewData.interview_type,
        interview_date: interviewData.interview_date,
        interview_time: formattedTime,
        remarks: interviewData.remarks,
        interview_status: "confirmed", // Force to confirmed as per backend requirements
        applicant_id: applicant.applicant_id,
        job_id: jobId
      };

      const response = await fetch('http://localhost:8000/api/v1/interviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(interviewPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        let errorMessage = 'Failed to create interview';
        try {
          const errorData = JSON.parse(errorText);
          
          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail.map(err => {
                return `${err.loc?.join?.('.') || 'Field'}: ${err.msg}`;
              }).join(', ');
            } else {
              errorMessage = errorData.detail;
            }
          }
        } catch (parseError) {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setIsInterviewConfirmed(true);
      setInterviewExists(true);
      return result;
    } catch (error) {
      console.error('❌ Error creating interview:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewDataChange = (field, value) => {
    setInterviewData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReject = async () => {
    setPendingStatusChange("rejected");
    setShowRemarksModal(true);
  };

  const handleAcceptAndProceed = async () => {
    try {
      if (applicationStatus === "applied") {
        // Update status to interview
        await updateApplicationStatus("interview");
      } else if (applicationStatus === "interview" && !isInterviewConfirmed) {
        // Validate interview data
        if (interviewData.interview_type && interviewData.interview_date && interviewData.interview_time) {
          // Create interview
          await createInterview();
        } else {
          setError("Please fill in all interview details before proceeding.");
          return;
        }
      }
    } catch (error) {
      console.error('Failed to accept and proceed:', error);
    }
  };

  const handleRemarksSubmit = async () => {
    try {
      if (pendingStatusChange) {
        await updateApplicationStatus(pendingStatusChange, remarksText);
        setFinalDecision(pendingStatusChange === "rejected" ? "Rejected" : "Accepted");
      }
      setShowRemarksModal(false);
      setRemarksText("");
      setPendingStatusChange(null);
    } catch (error) {
      console.error('Failed to update application with remarks:', error);
    }
  };

  const handleRejectApplicant = async () => {
    setPendingStatusChange("rejected");
    setShowRemarksModal(true);
  };

  const handleAcceptApplicant = async () => {
    setPendingStatusChange("accepted");
    setShowRemarksModal(true);
  };

  // Check if status is final (accepted/rejected)
  const isFinalStatus = () => {
    return applicationStatus === "accepted" || applicationStatus === "rejected";
  };

  // Helper to check if interview is done and confirmed
  const isInterviewDoneAndConfirmed = () => {
    if (!isInterviewConfirmed || !interviewExists) return false;
    if (!interviewData.interview_date || !interviewData.interview_time) return false;
    const interviewDateTime = new Date(`${interviewData.interview_date}T${interviewData.interview_time}`);
    return interviewDateTime < new Date();
  };

  // Display current status for UI
  const getDisplayStatus = () => {
    switch(applicationStatus) {
      case 'applied': return 'Applied';
      case 'interview': return 'For Interview';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return applicationStatus;
    }
  };

  // Check if we have auth token
  const hasAuthToken = getAuthToken() !== null;

  // Show authentication error if no token
  if (!hasAuthToken) {
    return (
      <>
        <div
          className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 z-40 ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
        />
        <div
          className={`fixed top-0 right-0 h-full w-[640px] bg-white shadow-2xl z-50 transform transition-transform duration-300 rounded-tl-[30px] rounded-bl-[30px] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="text-center">
              <div className="text-red-500 text-lg font-bold mb-4">Authentication Required</div>
              <div className="text-gray-600 mb-6">Please log in to manage applications</div>
              
              <button
                onClick={onClose}
                className="bg-[#FF8032] text-white px-6 py-2 rounded-lg hover:bg-[#E66F24] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Remarks Modal */}
      {showRemarksModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">
              {pendingStatusChange === "rejected" ? "Rejection" : "Acceptance"} Remarks
            </h3>
            <textarea
              className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FF8032]"
              placeholder={`Enter ${pendingStatusChange === "rejected" ? "rejection" : "acceptance"} remarks...`}
              value={remarksText}
              onChange={(e) => setRemarksText(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRemarksModal(false);
                  setRemarksText("");
                  setPendingStatusChange(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRemarksSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#FF8032] text-white rounded-lg hover:bg-[#E66F24] disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 z-40 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      
      <div
        className={`fixed top-0 right-0 h-full w-[640px] bg-white shadow-2xl z-50 transform transition-transform duration-300 rounded-tl-[30px] rounded-bl-[30px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">          
          <div className="flex-shrink-0 p-8 border-b-2 border-gray-200 ml-16 mr-16">
            <div className="flex justify-between items-center mb-2">
              <button
                className="text-gray-600 hover:text-black transition-colors"
                onClick={onClose}
                aria-label="Back"
              >
                <i className="bi bi-arrow-left text-[50px]" />
              </button>
              
              <span className={`${matchScoreColor} text-[18px] font-bold`}>{applicant?.matched || 60}% Matched</span>
            </div>            
            
            <div className="flex items-center gap-4 -mb-2">
              <div className="w-[160px] h-[160px] min-w-[160px] min-h-[160px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center overflow-hidden shadow-lg border-4 border-white flex-shrink-0">
                {applicant?.profilePhoto || applicant?.avatar ? (
                  <img 
                    src={applicant.profilePhoto || applicant.avatar} 
                    alt={`${applicant.candidateName || "Applicant"}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="bi bi-person-fill text-gray-400 text-[48px]" />
                )}
              </div>
              <div>
                <h2 className="text-[24px] font-bold text-gray-800">{applicant?.candidateName || "Candidate Name"}</h2>                  
                <div className="flex items-center gap-1 text-[#6B7280] font-semibold text-[14px]">
                  <i className="bi bi-geo-alt" />
                  <span>{tempContactInfo.location}</span>
                </div>
                <div className="flex items-center gap-1 text-[#6B7280] font-semibold text-[14px]">
                  <PhoneCall size={14} />
                  <span>{tempContactInfo.phone}</span>
                </div>
                <div className="flex items-center gap-1 text-[#6B7280] font-semibold text-[14px]">
                  <Mail size={14} />
                  <span>{tempContactInfo.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 ml-16 mr-16">
            <h3 className="text-[#E66F24] text-[25px] font-bold mb-6 -mt-4">Application Status</h3>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {(loading || contextLoading) && (
              <div className="text-blue-600 mb-4">
                Updating...
              </div>
            )}
            
            <div className="mb-8 relative ml-2 flex flex-col">
              {/* Application Created */}
              <div className="relative z-10 flex items-stretch gap-4 min-h-[56px]">
                <div className="flex flex-col items-center mr-3 h-full min-h-[40px] justify-center">
                  <div className="w-5 h-5 rounded-full bg-[#27AE60] z-10" />
                  <div className="absolute top-[20px] left-[8px] w-[4px] h-full bg-[#27AE60] z-0" />
                </div>
                <div className="flex flex-col justify-center h-full min-h-[40px] py-1">
                  <div className="font-semibold text-gray-800 leading-tight">Applied</div>
                  <div className="text-gray-500 text-[12px] italic leading-tight">
                    {appliedTimestamp.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              </div>

              {/* Current Status (if not applied) */}
              {applicationStatus !== "applied" && (
                <div className="relative z-10 flex items-stretch gap-4 min-h-[56px]">
                  <div className="flex flex-col items-center mr-3 h-full min-h-[40px] justify-center">
                    <div className={`w-5 h-5 rounded-full ${
                      applicationStatus === "accepted" ? "bg-[#27AE60]" : 
                      applicationStatus === "rejected" ? "bg-[#E74C3C]" : 
                      "bg-[#27AE60]"
                    } z-10`} />
                  </div>
                  <div className="flex flex-col justify-center h-full min-h-[40px] py-1">
                    <div className="font-semibold text-gray-800 leading-tight">
                      {getDisplayStatus()}
                    </div>
                    <div className="text-gray-500 text-[12px] italic leading-tight">
                      {new Date().toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {isInterviewDoneAndConfirmed() && !isFinalStatus() && (
              <div className="bg-[#FF8032] rounded-xl p-6 mb-8 shadow-lg flex flex-col items-center">
                <h3 className="text-white text-[16px] font-bold text-lg mb-2 w-full text-left">Interview Result</h3>
                <p className="text-white text-[12px] font-medium mb-4 w-full text-left">
                  After reviewing the applicant's interview, you may now choose to either accept them and proceed with a job offer or reject them if they will not be moving forward.
                </p>
                <div className="flex gap-4 w-full justify-center">
                  <button 
                    onClick={handleRejectApplicant} 
                    disabled={loading || contextLoading}
                    className="w-[167px] h-[29px] bg-white text-[#FF8032] text-[11px] font-bold rounded-lg px-6 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Reject Applicant
                  </button>
                  <button 
                    onClick={handleAcceptApplicant} 
                    disabled={loading || contextLoading}
                    className="w-[167px] h-[29px] bg-white text-[#FF8032] text-[11px] font-bold rounded-lg px-6 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Accept Applicant
                  </button>
                </div>
              </div>
            )}
            
            <div className={`${isInterviewDoneAndConfirmed() && !isFinalStatus() ? 'bg-[#FEFEFF] text-[#FF8032] border shadow-lg' : 'bg-[#FF8032] text-white'} rounded-lg p-6 mb-8 ml-4 mr-4`}>
              <div className="flex justify-between items-center mb-4">
                <h4 className={`font-bold text-[16px] ${isInterviewDoneAndConfirmed() && !isFinalStatus() ? 'text-[#FF8032]' : 'text-white'}`}>Status Details</h4>
                <span className={`font-semibold text-[12px] ${isInterviewDoneAndConfirmed() && !isFinalStatus() ? 'text-[#FF8032]' : 'text-white'}`}>{getDisplayStatus()}</span>
              </div>
              
              {applicationStatus === "interview" ? (
                <div>
                  <p className={`${isInterviewDoneAndConfirmed() && !isFinalStatus() ? 'text-[#FF8032]' : 'text-white'} text-[12px] font-medium mb-6`}>
                    {interviewExists ? "Interview details:" : "Set a date and time for the interview."}
                  </p>
                  
                  {interviewExists && isInterviewConfirmed ? (
                    <div className={`space-y-4 mb-6 ml-8 ${isInterviewDoneAndConfirmed() && !isFinalStatus() ? 'text-[#FF8032]' : 'text-[#E9EDF8]'} text-[12px] font-medium`}>
                      <div className="flex">
                        <div className="w-[180px]">Job Title</div>
                        <div>{interviewData.jobTitle}</div>
                      </div>
                      <div className="flex">
                        <div className="w-[180px]">Company</div>
                        <div>{interviewData.company}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-[180px]">Interview Type</div>
                        <div className="text-inherit">
                          {interviewData.interview_type === 'online' ? 'Online' : 
                           interviewData.interview_type === 'onsite' ? 'Onsite' : 
                           interviewData.interview_type}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-[180px]">Interview Date</div>
                        <div className="text-inherit">
                          {interviewData.interview_date ? new Date(interviewData.interview_date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          }) : ''}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-[180px]">Interview Time</div>
                        <div className="text-inherit">
                          {interviewData.interview_time ? 
                            new Date(`2000-01-01T${interviewData.interview_time}`).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit', 
                              hour12: true 
                            }) + ' (PST)' : ''}
                        </div>
                      </div>
                    </div>
                  ) : !interviewExists ? (
                    <div className="space-y-4 mb-6 ml-8 text-[#E9EDF8] text-[12px] font-medium">
                      <div className="flex">
                        <div className="w-[180px]">Job Title</div>
                        <div>{interviewData.jobTitle}</div>
                      </div>
                      <div className="flex">
                        <div className="w-[180px]">Company</div>
                        <div>{interviewData.company}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-[180px]">Interview Type</div>
                        <div className="w-[125px] h-[30px] relative z-50">
                          <Dropdown
                            label={
                              <span className="flex items-center justify-between w-full text-[11px] text-black">
                                <span>
                                  {interviewData.interview_type === 'online' ? 'Online' : interviewData.interview_type === 'onsite' ? 'Onsite' : ''}
                                </span>
                                <i className="bi bi-caret-down-fill text-xs ml-1" style={{ color: '#FF8032' }} />
                              </span>
                            }
                            options={[
                              { label: "Online", value: "online" },
                              { label: "Onsite", value: "onsite" }
                            ]}
                            onSelect={(option) => handleInterviewDataChange('interview_type', option.value)}
                            width="w-full"
                            buttonClass="w-[125px] h-[30px] bg-white text-[12px] font-medium px-3 py-1 rounded-lg border-0 focus:outline-none"
                            hideDefaultIcon={true}
                          />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-[180px] text-[#E9EDF8] text-[12px] font-medium">Interview Date</div>
                        <div className="relative w-[125px] h-[30px]">
                          <input 
                            type="date"
                            id="interviewDate"
                            ref={(input) => (window.dateInput = input)} 
                            className="w-full h-full bg-white rounded-lg px-3 py-1 text-[#000000] text-[10px] font-medium border-0 focus:ring-2 focus:ring-white pr-8"
                            value={interviewData.interview_date}
                            onChange={(e) => handleInterviewDataChange('interview_date', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            style={{ colorScheme: 'light' }}
                          />
                          <i 
                            className="bi bi-calendar3 absolute right-2 top-1/2 transform -translate-y-1/2 text-[#FF8032] text-[14px] cursor-pointer"
                            onClick={() => window.dateInput?.showPicker()}
                          />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-[180px] text-[#E9EDF8] text-[12px] font-medium">Interview Time</div>
                        <div className="w-[125px] h-[30px]">
                          <Dropdown
                            label={
                              interviewData.interview_time ? (
                                <span className="flex items-center justify-between w-full text-[11px] text-black">
                                  <span>
                                    {new Date(`2000-01-01T${interviewData.interview_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                  </span>
                                  <i className="bi bi-caret-down-fill text-xs ml-1" style={{ color: '#FF8032' }} />
                                </span>
                              ) : (
                                <span className="flex items-center justify-end w-full text-[11px] text-black">
                                  <i className="bi bi-caret-down-fill text-xs ml-1" style={{ color: '#FF8032' }} />
                                </span>
                              )
                            }
                            options={[
                              { label: "8:00 AM", value: "08:00" },
                              { label: "8:30 AM", value: "08:30" },
                              { label: "9:00 AM", value: "09:00" },
                              { label: "9:30 AM", value: "09:30" },
                              { label: "10:00 AM", value: "10:00" },
                              { label: "10:30 AM", value: "10:30" },
                              { label: "11:00 AM", value: "11:00" },
                              { label: "11:30 AM", value: "11:30" },
                              { label: "12:00 PM", value: "12:00" },
                              { label: "12:30 PM", value: "12:30" },
                              { label: "1:00 PM", value: "13:00" },
                              { label: "1:30 PM", value: "13:30" },
                              { label: "2:00 PM", value: "14:00" },
                              { label: "2:30 PM", value: "14:30" },
                              { label: "3:00 PM", value: "15:00" },
                              { label: "3:30 PM", value: "15:30" },
                              { label: "4:00 PM", value: "16:00" },
                              { label: "4:30 PM", value: "16:30" },
                              { label: "5:00 PM", value: "17:00" }
                            ]}
                            onSelect={(option) => handleInterviewDataChange('interview_time', option.value)}
                            width="w-full"
                            buttonClass="w-[125px] h-[30px] bg-white text-[12px] font-medium px-3 py-1 rounded-lg border-0 focus:outline-none"
                            hideDefaultIcon={true}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                  
                  <div className="mb-6">
                    <h5 className={`${isInterviewDoneAndConfirmed() && !isFinalStatus() ? 'text-[#FF8032]' : 'text-[#FEFEFF]'} text-[14px] font-bold mb-3`}>Remarks</h5>
                    <div className={`bg-white rounded-lg p-4 ${isInterviewDoneAndConfirmed() && !isFinalStatus() ? 'border-2 border-[#FF8032]' : ''}`}>
                      <textarea
                        className={`w-full ${isInterviewDoneAndConfirmed() && !isFinalStatus() ? 'text-[#FF8032]' : 'text-[#E66F24]'} text-[10px] font-medium leading-relaxed ml-4 mr-4 border-none resize-none outline-none bg-transparent`}
                        value={interviewData.remarks}
                        onChange={(e) => handleInterviewDataChange('remarks', e.target.value)}
                        disabled={interviewExists}
                        rows={6}
                        placeholder="Enter interview remarks..."
                      />
                    </div>                  
                  </div>  
                  
                  {!isFinalStatus() && (
                    <div className="ml-1 flex gap-3">
                      {interviewExists && !isInterviewDoneAndConfirmed() ? (
                        <>
                          <button 
                            onClick={handleReject}
                            disabled={loading || contextLoading}
                            className="w-[167px] h-[29px] bg-white text-[#FF8032] px-5 py-1 rounded-lg font-bold text-[11px] hover:bg-gray-100 hover:text-[#E66F24] transition-colors disabled:opacity-50"
                          >
                            Cancel Application
                          </button>
                          <button 
                            onClick={() => setInterviewExists(false)}
                            disabled={loading || contextLoading}
                            className="w-[167px] h-[29px] bg-white text-[#FF8032] px-5 py-1 rounded-lg font-bold text-[11px] hover:bg-gray-100 hover:text-[#E66F24] transition-colors disabled:opacity-50"
                          >
                            Edit Details
                          </button>
                        </>
                      ) : !interviewExists ? (
                        <>
                          <button 
                            onClick={handleReject}
                            disabled={loading || contextLoading}
                            className="w-[167px] h-[29px] bg-white text-[#FF8032] px-5 py-1 rounded-lg font-bold text-[11px] hover:bg-gray-100 hover:text-[#E66F24] transition-colors disabled:opacity-50"
                          >
                            Reject Application
                          </button>
                          <button 
                            onClick={handleAcceptAndProceed}
                            disabled={loading || contextLoading}
                            className="w-[167px] h-[29px] bg-white text-[#FF8032] px-5 py-1 rounded-lg font-bold text-[11px] hover:bg-gray-100 hover:text-[#E66F24] transition-colors disabled:opacity-50"
                          >
                            Accept and Proceed
                          </button>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : applicationStatus === "applied" && !isFinalStatus() ? (
                <div>
                  <p className="text-white text-[12px] mb-6">
                    Review and decide whether to move forward with this applicant. You may accept the application to proceed with the interview process, or reject the application to indicate that they will not be moving forward in the hiring process.
                  </p>
                  <div className="ml-1 flex gap-3">
                    <button 
                      onClick={handleReject}
                      disabled={loading || contextLoading}
                      className="w-[167px] h-[29px] bg-white text-[#FF8032] px-6 py-1 rounded-lg font-bold text-[11px] hover:bg-gray-100 hover:text-[#E66F24] transition-colors disabled:opacity-50"
                    >
                      Reject Application
                    </button>
                    <button 
                      onClick={handleAcceptAndProceed}
                      disabled={loading || contextLoading}
                      className="w-[167px] h-[29px] bg-white text-[#FF8032] px-4 py-1 rounded-lg font-bold text-[11px] hover:bg-gray-100 hover:text-[#E66F24] transition-colors disabled:opacity-50"
                    >
                      Accept and Proceed
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-white text-[12px] mb-6">
                    This application has been {applicationStatus}. No further actions are available.
                  </p>
                </div>
              )}
            </div>
            
            {/* Tag Matches (renamed from All Applicant Tags) */}
            <div className="mb-8">
              <h4 className="font-bold text-[16px] text-gray-800 mb-4">Tag Matches</h4>
              <div className="flex flex-wrap gap-2">
                {tagNames.length > 0
                  ? tagNames.map((tag, idx) => (
                      <span key={idx} className="border-2 border-[#FF8032] text-[#FF8032] px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FFF7F2]">
                        {tag}
                      </span>
                    ))
                  : <span className="text-gray-500">No tags found.</span>
                }
              </div>
            </div>

            <div className="mb-8 justify-center items-center flex">
              <button
                className="w-[285px] h-[48px] bg-[#FF8032] text-white py-3 rounded-lg font-bold text-[16px] hover:bg-[#E66F24] transition-colors"
                onClick={() => navigate('/applicantresume')}
              >
                View Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationFullDetails;