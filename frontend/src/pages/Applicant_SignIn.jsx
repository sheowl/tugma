import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import TugmaLogo from "../assets/TugmaLogo.svg";

const Applicant_SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFEFF] font-montserrat pt-[180px] pb-[120px] px-[240px]">
      <div className="absolute top-20 left-40 pl-24">
        <img src={TugmaLogo} alt="Logo" className="w-[520px] h-[126px]" />
      </div>
      <div className="flex flex-col items-center bg-[#E9EDF8] justify-center w-full px-14 rounded-[48px] max-w-[950px] mx-auto py-[120px] mt-[100px]">
        <h1 className="text-5xl font-bold text-[#2A4D9B] mb-16 text-center">
          Log in to Tugma
        </h1>
        <form
          className="space-y-8 w-full flex flex-col items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/appbrowesjobs");
          }}
        >
          <div className="w-full max-w-xl">
            <input
              id="username"
              type="text"
              className="w-full px-10 py-6 rounded-3xl bg-[#F9F9F9] border-2 border-[#6B7280] hover:border-4 text-black focus:outline-none focus:ring-4 focus:ring-white/30 text-2xl placeholder:font-montserrat placeholder:font-medium placeholder:text-2xl"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="relative w-full max-w-xl">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full px-10 py-6 rounded-3xl bg-[#F9F9F9] border-2 border-[#6B7280] hover:border-4 text-black focus:outline-none focus:ring-4 focus:ring-white/30 text-2xl placeholder:font-montserrat placeholder:font-medium placeholder:text-2xl"
              placeholder="Password"
              style={{ paddingRight: "3.5rem" }}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-[15%] right-6 transform -translate-y-1/2 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeIcon className="h-10 w-10 text-[#6B7280]" />
              ) : (
                <EyeSlashIcon className="h-10 w-10 text-[#6B7280]" />
              )}
             </button>
            <p className="text-left text-[#2A4D9B] font-semibold hover:underline cursor-pointer text-lg mt-2 mb-2 ml-2">
              <a href="#">Forgot password?</a>
            </p>
            <div className="h-10" />
            <div className="flex items-center w-full max-w-[632px] gap-2 text-[#6B7280] text-lg">
              <hr className="flex-grow border-[#6B7280]" />
              <span className="italic">or</span>
              <hr className="flex-grow border-[#6B7280]" />
            </div>
            <div className="h-10" />
            <button
              type="button"
              className="flex items-center justify-center gap-2 border-2 border-[#6B7280] rounded-full bg-[#FEFEFF] hover:bg-gray-50 transition w-full max-w-xl h-[65px] mx-auto"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google"
                className="w-8 h-8"
              />
              <span className="text-2xl font-bold text-[#2A4D9B]">
                Continue with Google
              </span>
            </button>
          </div>
          <div className="h-8" />
          <button
            type="submit"
            className="max-w-xl bg-[#2A4D9B] text-white rounded-2xl hover:bg-[#16367D] transition mt-10 h-[65px] w-[300px] font-semibold text-2xl"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-xl text-[#6B7280] mt-4">
          Doesn’t have an Account?
          <a href="/applicant-email-registration" className="text-[#16367D] hover:underline ml-2">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Applicant_SignIn;
