import React, { useState } from "react";
import AppHeader from "../components/AppHeader";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const AppComReg = () => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFEFF] font-montserrat pt-32 pb-20 px-4 sm:pt-44 sm:pb-32 sm:px-12 md:pt-[180px] md:pb-[120px] md:px-[240px]">
      <AppHeader />
      <div className="w-full flex flex-col items-center mt-10 px-2 sm:px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2A4D9B] mb-1 md:mb-2 text-center">
            Complete the following steps to finish your registration
        </h1>
        <div className="h-2 sm:h-4 md:h-8" />
        <form className="flex flex-col gap-6 sm:gap-8 items-center w-full max-w-2xl mx-auto">
          <div className="w-full flex gap-3">
            <div className="w-1/2">
              <label
                htmlFor="firstName"
                className="block text-[#3C3B3B] font-semibold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full h-12 sm:h-16 md:h-[45px] px-4 sm:px-6 border border-[#3C3B3B] hover:border-2 bg-[#F9F9F9] rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-blue-200"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="lastName"
                className="block text-[#3C3B3B] font-semibold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full h-12 sm:h-16 md:h-[45px] px-4 sm:px-6 border border-[#3C3B3B] hover:border-2 bg-[#F9F9F9] rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-blue-200"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="w-full relative">
            <label
              htmlFor="password"
              className="block text-[#3C3B3B] font-semibold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full h-12 sm:h-16 md:h-[45px] px-4 sm:px-6 border border-[#6B7280] hover:border-2 bg-[#F9F9F9] rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (8 or more characters)"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-[85%] right-3 -translate-y-1/2 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeIcon className="h-6 w-6 text-[#6B7280]" />
              ) : (
                <EyeSlashIcon className="h-6 w-6 text-[#6B7280]" />
              )}
            </button>
          </div>
          <div className="w-full max-w-5xl relative mb-0 pb-0">
            <label
              htmlFor="ConfirmPassword"
              className="block text-[#3C3B3B] font-semibold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="ConfirmPassword"
              className="w-full h-12 sm:h-16 md:h-[45px] px-4 sm:px-6 border border-[#6B7280] hover:border-2 bg-[#F9F9F9] rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-blue-200"
              value={ConfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-[85%] right-3 -translate-y-1/2 focus:outline-none"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeIcon className="h-6 w-6 text-[#6B7280]" />
              ) : (
                <EyeSlashIcon className="h-6 w-6 text-[#6B7280]" />
              )}
            </button>
          </div>
          <div className="w-full mt-[-16px]">
            <label
              htmlFor="terms"
              className="flex items-center cursor-pointer select-none font-semibold text-[10px] sm:text-xs md:text-xs text-[#6B7280]"
            >
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="appearance-none w-4 h-4 rounded-md border-2 border-[#6B7280] checked:bg-[#16367D] checked:border-[#16367D] focus:outline-none transition-colors duration-200 mr-2"
                required
              />
              <span className="leading-tight text-xs sm:text-xs md:text-sm">
                I have read and agree to the{" "}
                <a
                  href="/termslink"
                  className="text-[#2A4D9B] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/privacylink"
                  className="text-[#2A4D9B] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>.
              </span>
            </label>
          </div>
          <div className="h-6" />
          <button
            type="button"
            onClick={() => navigate("/applicantonboarding")}
            className="max-w-md bg-[#2A4D9B] text-white rounded-2xl hover:bg-[#16367D] transition mt-4 h-[44px] w-[225px] font-semibold text-sm"
          >
            Register
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

export default AppComReg;
