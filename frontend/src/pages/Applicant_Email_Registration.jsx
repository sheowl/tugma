import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";

const Applicant_Email_Registration = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFEFF] font-montserrat pt-32 pb-20 px-4 sm:pt-44 sm:pb-32 sm:px-12 md:pt-[180px] md:pb-[120px] md:px-[240px]">
      <AppHeader />
      <div className="w-full flex flex-col items-center mt-10 px-2 sm:px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2A4D9B] mb-8 md:mb-12 text-center">
          Register to find jobs that match your skills
        </h1>
        <div className="h-4 sm:h-8 md:h-10" />
        <form className="flex flex-col gap-4 sm:gap-6 items-center w-full">
          <div className="w-full max-w-xl">
            <label
              htmlFor="email"
              className="block text-[#3C3B3B] font-semibold mb-2 sm:mb-3 text-base sm:text-lg md:text-xl"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full h-12 sm:h-16 md:h-[45px] px-4 sm:px-6 border border-[#6B7280] hover:border-2 bg-[#F9F9F9] rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              required
            />
          </div>
          <div className="h-1 sm:h-2" /> 
          <div className="flex items-center w-full text-[#6B7280] text-semibold max-w-xl gap-2 sm:gap-6 text-base sm:text-lg md:text-xl">
            <hr className="flex-grow border-[#6B7280]" />
              <span className="italic">or</span>
            <hr className="flex-grow border-[#6B7280]" />
          </div>
          <div className="h-4 sm:h-6" />
          <button
            type="button"
            className="flex items-center justify-center gap-2 sm:gap-3 border border-[#6B7280] hover:border-2 rounded-full hover:bg-gray-50 transition w-[405px] h-[44px]"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
              className="w-4 h-4 sm:w-6 sm:h-6"
            />
            <span className="text-base font-semibold text-[#2A4D9B]">
              Continue with Google
            </span>
          </button>

          <div className="h-6" />

          <button
            type="button"
            onClick={() => navigate("/appverification")}
            className="max-w-md bg-[#2A4D9B] text-white rounded-2xl hover:bg-[#16367D] transition mt-4 h-[44px] w-[225px] font-semibold text-sm"
          >
            Verify Email
          </button>
        </form>

        <p className="text-center text-sm text-[#6B7280] font-semibold mt-2">
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
