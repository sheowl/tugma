import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import TugmaLogo from "../assets/TugmaLogo.svg";

const Employer_SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFEFF] font-montserrat pt-24 pb-12 px-2 sm:pt-32 sm:pb-20 sm:px-6 md:pt-[120px] md:pb-[80px] md:px-[120px]">
      <div className="absolute top-8 left-4 pl-4 sm:top-12 sm:left-16 sm:pl-12 md:top-20 md:left-40 md:pl-24">
        <img src={TugmaLogo} alt="Logo" className="w-40 h-16 sm:w-60 sm:h-20 md:w-[192px] md:h-[60px]" />
      </div>
      <div className="flex flex-col items-center bg-[#FFF7F2] justify-center w-[615px] h-[650px] px-2 sm:px-4 md:px-8 
      rounded-xl md:rounded-3xl mx-auto py-2 sm:py-3 md:py-4 mt-2 md:mt-4 shadow-all-around">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#E66F24] mb-10 md:mb-12 text-center">
          Log in to Tugma
        </h1>
        <form
          className="space-y-3 sm:space-y-4 w-full flex flex-col items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/EmployerHomePage");
          }}
        >
          <div className="w-full max-w-xs sm:max-w-xs md:max-w-md">
            <input
              id="username"
              type="text"
              className="w-full px-1 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-lg md:rounded-xl bg-[#F9F9F9] border border-[#6B7280] hover:border-2 text-black focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-orange-200 text-xs sm:text-sm md:text-base placeholder:font-montserrat placeholder:text-xs sm:placeholder:text-sm md:placeholder:text-base"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="relative w-full max-w-xs sm:max-w-xs md:max-w-md">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full px-1 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-lg md:rounded-xl bg-[#F9F9F9] border border-[#6B7280] hover:border-2 text-black focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-orange-200 text-xs sm:text-sm md:text-base placeholder:font-montserrat placeholder:text-xs sm:placeholder:text-sm md:placeholder:text-base"
              placeholder="Password"
              style={{ paddingRight: "3.5rem" }}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-2 right-3 sm:top-[12%] sm:right-4 transform -translate-y-1/2 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeIcon className="h-6 w-6 text-[#6B7280]" />
              ) : (
                <EyeSlashIcon className="h-6 w-6 text-[#6B7280]" />
              )}
            </button>
            <p className="text-left text-[#FF8032] font-semibold hover:underline cursor-pointer text-sm mt-1 mb-1 ml-1">
              <a href="#">Forgot password?</a>
            </p>
            <div className="h-[24px]" />
            <div className="flex items-center w-full max-w-xs sm:max-w-xs md:max-w-md gap-2 text-[#6B7280] text-xs sm:text-sm md:text-base">
              <hr className="flex-grow border-[#6B7280]" />
              <span className="italic">or</span>
              <hr className="flex-grow border-[#6B7280]" />
            </div>
            <div className="h-[24px]" />
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-[#6B7280] hover:border-2 rounded-full bg-[#FEFEFF] hover:bg-gray-50 transition w-full max-w-md h-[44px] mx-auto"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google"
                className="w-4 h-4"
              />
              <span className="text-base font-semibold text-[#E66F24]">
                Continue with Google
              </span>
            </button>
          </div>
          <div className="h-2" />
          <button
            type="submit"
            className="max-w-md bg-[#FF8032] text-white rounded-2xl hover:bg-[#E66F24] transition mt-4 h-[44px] w-[225px] font-semibold text-sm"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-[#6B7280] font-semibold mt-2">
          Doesn’t have an Account?
          <a href="/employer-email-registration" className="text-[#FF8032] hover:underline ml-2">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Employer_SignIn;
