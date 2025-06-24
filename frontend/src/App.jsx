// import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./output.css";
import ApplicantEmailRegistration from "./pages/Applicant_Email_Registration.jsx";
import EmployerEmailRegistration from "./pages/Employer_Email_Registration.jsx";
import ApplicantSignIn from "./pages/Applicant_SignIn.jsx";
import EmployerSignIn from "./pages/Employer_SignIn.jsx";    
import EmpComReg from "./pages/EmpComReg.jsx";
import AppComReg from "./pages/AppComReg.jsx";
import AppVerification from "./pages/AppVerification.jsx";
import EmpVerification from "./pages/EmpVerification.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ApplicantBrowseJobs from "./pages/ApplicantBrowseJobs.jsx";
import ApplicantApplications from "./pages/ApplicantApplications.jsx";
import ApplicantInbox from "./pages/ApplicantInbox.jsx";
import ApplicantProfile from "./pages/ApplicantProfile.jsx";
import EmployerApplicants from "./pages/EmployerApplicants.jsx";
import EmployerHomePage from "./pages/EmployerHomePage.jsx";
import EmployerJobPosts from "./pages/EmployerJobPosts.jsx";
import ApplicantOnboarding from "./pages/ApplicantOnboarding.jsx";
import EmployerOnboarding from "./pages/EmployerOnboarding.jsx";
import CompanyPage from "./pages/CompanyPage.jsx";
import EditCompanyPage from "./components/EditCompanyPage.jsx";
import ApplicantResume from "./components/ApplicantResume.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployerOnboarding />} />
        <Route path="/applicant-sign-in" element={<ApplicantSignIn />} />
        <Route path="/employer-sign-in" element={<EmployerSignIn />} />
        <Route path="/applicant-email-registration" element={<ApplicantEmailRegistration />} />
        <Route path="/employer-email-registration" element={<EmployerEmailRegistration />} />
        <Route path="/empcomreg" element={<EmpComReg />} />
        <Route path="/appcomreg" element={<AppComReg />} />
        <Route path="/appverification" element={<AppVerification />} />
        <Route path="/empverification" element={<EmpVerification />} />
        <Route path="/applicantbrowsejobs" element={<ApplicantBrowseJobs />} />
        <Route path="/applicantinbox" element={<ApplicantInbox />} />
        <Route path="/applicantapplications" element={<ApplicantApplications />} />
        <Route path="/applicantprofile" element={<ApplicantProfile />} />
        <Route path="/employerhomepage" element={<EmployerHomePage />} />
        <Route path="/employerapplicants" element={<EmployerApplicants />} />
        <Route path="/employerjobposts" element={<EmployerJobPosts />} />
        <Route path="/applicantonboarding" element={<ApplicantOnboarding />} />
        <Route path="/employeronboarding" element={<EmployerOnboarding />} />
        <Route path="/companypage" element={<CompanyPage />} />
        <Route path="/edit-company-profile" element={<EditCompanyPage />} />
        <Route path="/applicantresume" element={<ApplicantResume />} />
      </Routes>
    </Router>
  );
}

export default App;
