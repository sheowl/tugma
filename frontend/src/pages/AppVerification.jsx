import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";

const AppVerification = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleResend = async () => {
    setResending(true);
    try {
      const email = localStorage.getItem("pending_applicant_email");
      const res = await fetch("http://localhost:8000/api/v1/auth/applicant/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setCooldown(60); // Start 60s timer immediately
      } else if (res.status === 429) {
        setCooldown(60); // If backend says too soon, also start timer
      }
    } catch (err) {
      console.log("Error resending code:", err);
    }
    setResending(false);
  };

  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => Math.max(prev - 1, 0)), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleConfirm = async () => {
    setError("");
    const email = localStorage.getItem("pending_applicant_email");
    const otp = code.join("");
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/applicant/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/appcomreg");
      } else {
        setError(data.detail || "Invalid code. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFEFF] font-montserrat pt-32 pb-20 px-4 sm:pt-44 sm:pb-32 sm:px-12 md:pt-[180px] md:pb-[120px] md:px-[240px]">
      <AppHeader />
      <div className="w-full flex flex-col items-center mt-10 px-2 sm:px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2A4D9B] mb-1 md:mb-2 text-center">
          Enter Confirmation Code
        </h1>
        <p className="text-xs sm:text-sm md:text-sm text-[#6B7280] font-semibold mb-1 text-center">
          A 4-digit confirmation code was sent to your email
        </p>
        <div className="h-16 sm:h-24 md:h-32"/>
        <form className="flex flex-col gap-8 items-center">
          <div className="flex gap-2 sm:gap-3 justify-center">
            {[0, 1, 2, 3].map((idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 text-2xl sm:text-3xl md:text-4xl text-center border border-[#6B7280] hover:border-2 font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 bg-[#F9F9F9] mx-1"
                value={code[idx]}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  if (val.length <= 1) {
                    const newCode = [...code];
                    newCode[idx] = val;
                    setCode(newCode);
                    if (val && idx < 3) {
                      document.getElementById(`code-input-${idx + 1}`)?.focus();
                    }
                  }
                }}
                id={`code-input-${idx}`}
                autoFocus={idx === 0}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-xs sm:text-sm md:text-sm text-center">
              {error}
            </p>
          )}

          <p className="text-center text-xs sm:text-xs md:text-xs text-[#6B7280] font-semibold mt-[-10px]">
            Didn't Receive a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-[#16367D] font-semibold hover:underline bg-transparent border-none p-0 m-0"
              disabled={resending || cooldown > 0}
            >
              {cooldown > 0 ? `${cooldown}s` : "Resend"}
            </button>
          </p>

          <div className="h-24" />
          <button
            type="button"
            onClick={handleConfirm}
            className="max-w-md bg-[#2A4D9B] text-white rounded-2xl hover:bg-[#16367D] transition mt-4 h-[44px] w-[225px] font-semibold text-sm"
          >
            Confirm Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppVerification;
