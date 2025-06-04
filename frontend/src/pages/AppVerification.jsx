import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";

const EmpComReg = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const navigate = useNavigate(); 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFEFF] font-montserrat pt-[180px] pb-[120px] px-[240px]">
      <AppHeader />
      <div className="w-full flex flex-col items-center mt-10 px-4">
        <h1 className="text-6xl font-bold text-[#2A4D9B] mb-4 text-center">
          Enter Confirmation Code
        </h1>
        <p className="text-2xl text-[#6B7280] font-semibold mb-8 text-center">
          A 4-digit confirmation code was sent to your email
        </p>
        <div className="h-32"/>
        <form className="flex flex-col gap-8 items-center">
          <div className="flex gap-4 justify-center">
            {[0, 1, 2, 3].map((idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-[106px] h-[140px] text-5xl text-center border-4 border-[#6B7280] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A4D9B] bg-[#F9F9F9] mx-1"
                value={code[idx]}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  if (val.length <= 1) { // para ilimit sa one input lng
                    const newCode = [...code];
                    newCode[idx] = val;
                    setCode(newCode);
                    if (val && idx < 3) { // para ilipat ung focus kapag may input na ung current
                      document.getElementById(`code-input-${idx + 1}`)?.focus();
                    }
                  }
                }}
                id={`code-input-${idx}`}
                autoFocus={idx === 0}
              />
            ))}
          </div>

          <p className="text-center text-xl text-[#6B7280] mt-2">
            Didn't Receive a code?{" "}
            <a
              href="/employer-sign-in"
              className="text-[#16367D] font-semibold hover:underline"
            >
              Resend
            </a>
          </p>

          <div className="h-32" />
          <button
            type="button"
            onClick={() => navigate("/appcomreg")}
            className="bg-[#2A4D9B] text-white text-2xl rounded-lg font-bold hover:bg-[#16367D] transition w-[320px] h-[56px]"
          >
            Confirm Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmpComReg;
