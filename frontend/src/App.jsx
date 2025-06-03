// import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./output.css";
import EmailRegistration from "./pages/EmailRegistration.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmailRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
