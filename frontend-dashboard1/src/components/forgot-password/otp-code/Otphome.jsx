import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Otphome() {
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  // Timer effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < newOtp.length - 1) {
      const nextInput = document.querySelector(`input[name="otp${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index]) {
      const prevInput = document.querySelector(`input[name="otp${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResendOTP = () => {
    setTimer(60);
    setCanResend(false);

    axios
      .post("http://localhost:8080/send-otp", { email })
      .then((response) => {
        setVerificationMessage("OTP has been resent to your email.");
      })
      .catch((error) => {
        setVerificationMessage("Error resending OTP.");
      });
  };

  const handleVerifyOTP = () => {
    const otpCode = otp.join("");

    axios
      .post("/verify-otp", {
        email,
        otp: otpCode,
      })
      .then((response) => {
        if (response.data.success) {
          setVerificationMessage("OTP verified successfully!");
          navigate("/new-password", { state: { email } });
        } else {
          setVerificationMessage("Invalid OTP. Please try again.");
          setOtp(["", "", "", "", "", ""]);
        }
      })
      .catch(() => {
        setVerificationMessage("An error occurred while verifying OTP.");
      });
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gray-100 p-4"
      style={{
        backgroundImage: "url('/images/durso.jpg')",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Email Verification
        </h1>
        {email && (
          <p className="text-gray-600 text-center mb-6">
            OTP has been sent to: <span className="font-semibold">{email}</span>
          </p>
        )}
        <div className="flex justify-between mb-6">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              name={`otp${index}`}
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              maxLength="1"
              className="w-10 h-10 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              inputMode="numeric"
            />
          ))}
        </div>
        <button
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:opacity-50"
          onClick={handleVerifyOTP}
        >
          Verify Account
        </button>
        <div className="mt-4 text-center">
          <p>
            {canResend
              ? "You can resend the OTP."
              : `Resend OTP in ${timer} seconds`}
          </p>
          {canResend && (
            <p
              className="text-blue-500 cursor-pointer mt-2"
              onClick={handleResendOTP}
            >
              Resend OTP
            </p>
          )}
        </div>
        {verificationMessage && (
          <p className="mt-4 text-center text-red-500">{verificationMessage}</p>
        )}
      </div>
    </div>
  );
}

export default Otphome;
