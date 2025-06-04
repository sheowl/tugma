import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";

const Applicant_Email_Registration = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFEFF] font-montserrat pt-[180px] pb-[120px] px-[240px]">
      <AppHeader />
      <div className="w-full flex flex-col items-center mt-10 px-4">
        <h1 className="text-6xl font-bold text-[#2A4D9B] mb-12 text-center">
          Register to find jobs that match your skills
        </h1>
        <div className="h-14" />
        <form className="flex flex-col gap-8 items-center">
          <div>
            <label
              htmlFor="email"
              className="block text-[#3C3B3B] font-bold mb-3 text-3xl"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-[850px] h-[80px] px-6 border-2 border-[#3C3B3B] hover:border-4 bg-[#F9F9F9] rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              required
            />
          </div>
          <div className="h-6" />
          <div className="flex items-center w-[850px] gap-6 text-[#6B7280] text-2xl">
            <hr className="flex-grow border-[#6B7280]" />
              <span className="italic">or</span>
            <hr className="flex-grow border-[#6B7280]" />
          </div>

          <div className="h-6" />

          <button
            type="button"
            className="flex items-center justify-center gap-3 border-2 border-[#6B7280] rounded-full hover:bg-gray-50 transition w-[520px] h-[56px]"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
              className="w-7 h-7"
            />
            <span className="text-2xl font-bold text-[#2A4D9B]">
              Continue with Google
            </span>
          </button>

          <div className="h-6" />

          <button
            type="button"
            onClick={() => navigate("/appverification")}
            className="bg-[#2A4D9B] text-white text-2xl rounded-2xl font-bold hover:bg-[#16367D] transition w-[320px] h-[56px]"
          >
            Verify Email
          </button>
        </form>

        <p className="text-center text-xl text-[#6B7280] mt-4">
          Already have an account?{" "}
          <a href="/applicant-sign-in" className="text-[#16367D] hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Applicant_Email_Registration;
