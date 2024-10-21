import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Otp.css";

function Otphome() {
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // State to hold OTP values
  const [timer, setTimer] = useState(60); // State for countdown timer
  const [canResend, setCanResend] = useState(false); // State for resend button
  const [verificationMessage, setVerificationMessage] = useState(""); // State for verification message

  // Timer effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true); // Enable resend button after timer ends
    }
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Allow only one character

    setOtp(newOtp);

    // Move focus to the next input field
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

    // Send a request to the backend to resend the OTP
    axios
      .post("http://localhost:8080/send-otp", { email })
      .then((response) => {
        console.log("Response from resend OTP:", response.data);
        setVerificationMessage("OTP has been resent to your email.");
      })
      .catch((error) => {
        console.error("Error resending OTP:", error);
        setVerificationMessage("Error resending OTP.");
      });
  };

  const handleVerifyOTP = () => {
    const otpCode = otp.join(""); // Combine the OTP array into a single string

    // Send the OTP to the backend for verification
    axios
      .post("http://localhost:8080/verify-otp", { email, otp: otpCode })
      .then((response) => {
        if (response.data.success) {
          setVerificationMessage("OTP verified successfully!");
          navigate("/new-password", { state: { email } });
        } else {
          setVerificationMessage("Invalid OTP. Please try again.");
          setOtp(["", "", "", "", "", ""]); // Clear the OTP input fields for re-entry
        }
      })
      .catch((error) => {
        setVerificationMessage("An error occurred while verifying OTP.");
      });
  };

  return (
    <div className="otp-body">
      <div className="otp-container">
        <h1>Email Verification</h1>
        {email && (
          <p className="p-emailname">
            OTP has been sent to: <span className="email-tag">{email}</span>
          </p>
        )}
        <div className="otp-fields">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              name={`otp${index}`}
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleBackspace(e, index)} // Handle backspace for navigation
              maxLength="1"
              className="otp-input"
              inputMode="numeric" // Allow only numeric input
            />
          ))}
        </div>
        <button className="otp-button" onClick={handleVerifyOTP}>
          Verify Account
        </button>
        <div className="timer">
          <p>
            {canResend
              ? "You can resend the OTP."
              : `Resend OTP in ${timer} seconds`}
          </p>
          {canResend && (
            <p className="resend-button" onClick={handleResendOTP}>
              Resend OTP
            </p>
          )}
        </div>
        {verificationMessage && (
          <p className="v-emmage">{verificationMessage}</p>
        )}
      </div>
    </div>
  );
}

export default Otphome;
