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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFEFF] font-montserrat pt-[180px] pb-[120px] px-[240px]">
      <AppHeader />
      <div className="w-full flex flex-col items-center mt-10 px-4">
        <h1 className="text-6xl font-bold text-[#2A4D9B] mb-12 text-center">
          Complete the following steps to finish your registration
        </h1>
        <div className="h-4" />
        <form className="flex flex-col gap-8 items-center">
          <div className="flex gap-8">
            <div>
              <label
                htmlFor="firstName"
                className="block text-[#3C3B3B] font-semibold mb-3 text-3xl"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-[410px] h-[80px] px-6 border-2 border-[#3C3B3B] hover:border-4 bg-[#F9F9F9] rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-[#3C3B3B] font-semibold mb-3 text-3xl"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="w-[410px] h-[80px] px-6 border-2 border-[#3C3B3B] hover:border-4 bg-[#F9F9F9] rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="relative flex flex-col">
            <label
              htmlFor="password"
              className="block text-[#3C3B3B] font-semibold mb-3 text-3xl"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-[850px] h-[80px] px-6 pr-16 border-2 border-[#3C3B3B] hover:border-4 bg-[#F9F9F9] rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (8 or more characters)"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-[70%] right-6 transform -translate-y-1/2 focus:outline-none"
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
          <div className="relative flex flex-col mt-4">
            <label
              htmlFor="ConfirmPassword"
              className="block text-[#3C3B3B] font-semibold mb-3 text-3xl"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="ConfirmPassword"
              className="w-[850px] h-[80px] px-6 pr-16 border-2 border-[#3C3B3B] hover:border-4 bg-[#F9F9F9] rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={ConfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-[70%] right-6 transform -translate-y-1/2 focus:outline-none"
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
