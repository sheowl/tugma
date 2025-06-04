import React, { useState } from "react";
import EmpHeader from "../components/EmpHeader";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const EmpComReg = () => {
  const [companyName, setcompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFEFF] font-montserrat pt-32 pb-20 px-4 sm:pt-44 sm:pb-32 sm:px-12 md:pt-[180px] md:pb-[120px] md:px-[240px]">
      <EmpHeader />
      <div className="w-full flex flex-col items-center mt-10 px-2 sm:px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#E66F24] mb-1 md:mb-2 text-center">
            Complete the following steps to finish your registration
        </h1>
        <div className="h-2 sm:h-4 md:h-8" />
        <form className="flex flex-col gap-6 sm:gap-8 items-center">
          <div className="w-full max-w-xl">
            <label
              htmlFor="companyName"
              className="block text-[#3C3B3B] font-semibold mb-2 sm:mb-3 text-sm sm:text-base md:text-lg"
            >
              Company Name
            </label>
            <input
              type="companyName"
              id="companyName"
              className="w-full h-12 sm:h-16 md:h-[45px] px-4 sm:px-6 border-2 border-[#3C3B3B] hover:border-4 bg-[#F9F9F9] rounded-xl md:rounded-2xl text-sm sm:text-xl md:text-2xl focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={companyName}
              onChange={(e) => setcompanyName(e.target.value)}
              placeholder=""
              required
            />
          </div>
            <div className="w-full max-w-xl relative">
            <label
              htmlFor="password"
              className="block text-[#3C3B3B] font-semibold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full h-10 sm:h-12 md:h-[40px] px-3 sm:px-4 border-2 border-[#3C3B3B] hover:border-4 bg-[#F9F9F9] rounded-lg md:rounded-xl text-base sm:text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-xs sm:placeholder:text-sm md:placeholder:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (8 or more characters)"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-3/4 right-3 -translate-y-1/2 focus:outline-none"
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
          <div className="w-full max-w-xl relative">
            <label
              htmlFor="ConfirmPassword"
              className="block text-[#3C3B3B] font-semibold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="ConfirmPassword"
              className="w-full h-10 sm:h-12 md:h-[40px] px-3 sm:px-4 border-2 border-[#3C3B3B] hover:border-4 bg-[#F9F9F9] rounded-lg md:rounded-xl text-base sm:text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-xs sm:placeholder:text-sm md:placeholder:text-base"
              value={ConfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-3/4 right-3 -translate-y-1/2 focus:outline-none"
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
          <div className="w-full max-w-2xl -mt-2">
            <label
              htmlFor="terms"
              className="flex items-start cursor-pointer select-none text-xs sm:text-sm md:text-sm text-[#6B7280]"
            >
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="sr-only peer"
                required
              />
              <span className="w-5 h-5 mr-3 mt-1 rounded-full border-2 border-[#6B7280] flex items-center justify-center transition-colors duration-200 peer-checked:bg-[#FF8032] peer-checked:border-[#FF8032]">
                {agreed && (
                  <svg
                    className="w-2 h-2 text-white"
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
              <span className="leading-tight">
                I have read and agree to the{" "}
                <a
                  href="/termslink"
                  className="text-[#FF8032] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/privacylink"
                  className="text-[#FF8032] hover:underline"
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
            onClick={() => navigate("/employer-sign-in")}
            className="bg-[#FF8032] text-white text-base rounded-2xl font-bold hover:bg-[#E66F24] transition w-[225px] h-[44px]"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-[#6B7280] mt-2">
          Already have an account?{" "}
          <a href="/employer-sign-in" className="text-[#FF8032] hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmpComReg;
