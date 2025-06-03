import React, { useState } from "react";
import TugmaLogo from "../assets/TugmaLogo.png";

const EmailRegistration = () => {
  const [email, setEmail] = useState("");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 font-montserrat">
      <div className="absolute top-8 left-8 pl-8">
        <img src={TugmaLogo} alt="Logo" className="w-[298.21px] h-[79px]" />
      </div>
      <div className="absolute top-8 right-8 text-xl text-gray-700">
        Here to hire applicants?{" "}
        <a href="#" className="text-blue-700 hover:underline font-semibold">
          Join as an Employer
        </a>
      </div>

      <div className="w-full flex flex-col items-center mt-32 px-4">
        <h1 className="text-5xl font-bold text-[#2A4D9B] mb-10 text-center">
          Register to find jobs that match your skills
        </h1>

        <form className="flex flex-col gap-6 items-center">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2 text-2xl"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-[632px] h-[70px] px-4 border border-gray-400 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              required
            />
          </div>

          {/* OR separator with full-width lines */}
          <div className="flex items-center w-full max-w-[632px] gap-4 text-gray-500 text-xl">
            <hr className="flex-grow border-gray-300" />
            <span>or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="h-4" />

          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-full hover:bg-gray-50 transition w-[405px] h-[44px]"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-xl font-semibold text-[#2A4D9B]">
              Continue with Google
            </span>
          </button>

          <div className="h-4" />

          <button
            type="submit"
            className="bg-[#2A4D9B] text-white text-xl rounded-md font-semibold hover:bg-[#213d7d] transition w-[225px] h-[44px]"
          >
            Verify Email
          </button>
        </form>

        <p className="text-center text-xl text-gray-800 mt-8">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmailRegistration;
