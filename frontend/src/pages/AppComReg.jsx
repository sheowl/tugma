import React, { useState } from "react";
import AppHeader from "../components/AppHeader";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const EmpComReg = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFEFF] font-montserrat pt-32 pb-20 px-4 sm:pt-44 sm:pb-32 sm:px-12 md:pt-[180px] md:pb-[120px] md:px-[240px]">
      <AppHeader />
      <div className="w-full flex flex-col items-center mt-10 px-2 sm:px-4">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#2A4D9B] mb-8 md:mb-12 text-center">
          Complete the following steps to finish your registration
        </h1>
        <div className="h-2 sm:h-4 md:h-8" />
        <form className="flex flex-col gap-6 sm:gap-8 items-center">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full">
            <div className="w-full sm:w-1/2 max-w-xs sm:max-w-[410px]">
              <label
                htmlFor="firstName"
                className="block text-[#3C3B3B] font-semibold mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full h-12 sm:h-16 md:h-[80px] px-4 sm:px-6 border-2 border-[#3C3B3B] hover:border-4 bg-[#F9F9F9] rounded-xl md:rounded-2xl text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="w-full sm:w-1/2 max-w-xs sm:max-w-[410px]">
              <label
                htmlFor="lastName"
                className="block text-[#3C3B3B] font-semibold mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full h-12 sm:h-16 md:h-[80px] px-4 sm:px-6 border-2 border-[#3C3B3B] hover:border-4 bg-[#F9F9F9] rounded-xl md:rounded-2xl text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="relative flex flex-col w-full max-w-xs sm:max-w-md md:max-w-[850px]">
            <label
              htmlFor="password"
              className="block text-[#3C3B3B] font-bold mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full h-12 sm:h-16 md:h-[80px] px-4 sm:px-6 pr-10 sm:pr-16 border-2 border-[#3C3B3B] hover:border-4 bg-[#F9F9F9] rounded-xl md:rounded-2xl text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (8 or more characters)"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-3/4 right-4 -translate-y-1/2 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeIcon className="h-10 w-10 text-[#6B7280]" />
              ) : (
                <EyeSlashIcon className="h-10 w-10 text-[#6B7280]" />
              )}
            </button>
          </div>
          <div className="relative flex flex-col mt-4 w-full max-w-xs sm:max-w-md md:max-w-[850px]">
            <label
              htmlFor="ConfirmPassword"
              className="block text-[#3C3B3B] font-semibold mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="ConfirmPassword"
              className="w-full h-12 sm:h-16 md:h-[80px] px-4 sm:px-6 pr-10 sm:pr-16 border-2 border-[#3C3B3B] hover:border-4 bg-[#F9F9F9] rounded-xl md:rounded-2xl text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={ConfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-3/4 right-4 -translate-y-1/2 focus:outline-none"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeIcon className="h-10 w-10 text-[#6B7280]" />
              ) : (
                <EyeSlashIcon className="h-10 w-10 text-[#6B7280]" />
              )}
            </button>
          </div>
          <div className="flex items-center w-[850px] -mt-4">
            <label
              htmlFor="terms"
              className="flex items-center cursor-pointer select-none text-lg text-[#6B7280]"
            >
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="sr-only peer"
                required
              />
              <span className="w-5 h-5 mr-3 rounded-full border-2 border-[#6B7280] flex items-center justify-center transition-colors duration-200 peer-checked:bg-[#2A4D9B] peer-checked:border-[#2A4D9B]">
                {agreed && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
              I have read and agree to the{" "}
              <a
                href="/termslink"
                className="text-[#2A4D9B] ml-1 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions
              </a>{"\u00A0"}and{" "}
              <a
                href="/privacylink"
                className="text-[#2A4D9B] ml-1 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </label>
          </div>
          <div className="h-6" />
          <button
            type="button"
            onClick={() => navigate("/employer-sign-in")}
            className="bg-[#2A4D9B] text-white text-2xl rounded-lg font-bold hover:bg-[#16367D] transition w-[320px] h-[56px]"
          >
            Register
          </button>
        </form>

        <p className="text-center text-xl text-[#6B7280] mt-4">
          Already have an account?{" "}
          <a
            href="/applicant-sign-in"
            className="text-[#16367D] hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmpComReg;
