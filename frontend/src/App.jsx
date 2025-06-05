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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/applicant-sign-in" element={<ApplicantSignIn />} />
        <Route path="/employer-sign-in" element={<EmployerSignIn />} />
        <Route path="/applicant-email-registration" element={<ApplicantEmailRegistration />} />
        <Route path="/employer-email-registration" element={<EmployerEmailRegistration />} />
        <Route path="/empcomreg" element={<EmpComReg />} />
        <Route path="/appcomreg" element={<AppComReg />} />
        <Route path="/appverification" element={<AppVerification />} />
        <Route path="/empverification" element={<EmpVerification />} />
      </Routes>
    </Router>
  );
}

export default App;
