import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Email() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendOTP = () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    axios
      .post("/send-otp", { email })
      .then((response) => {
        setMessage(response.data);
        navigate("/otp", { state: { email } });
      })
      .catch((error) => {
        if (error.response) {
          setMessage(error.response.data);
        } else {
          setMessage("An error occurred while sending the OTP.");
        }
      })
      .finally(() => {
        setLoading(false);
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
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Email Request
        </h1>
        <p className="text-gray-600 text-center mb-4">
          We will be sending you an OTP code to your email.
        </p>

        <div className="mb-4">
          <input
            id="otp-email"
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={handleEmailChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSendOTP}
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:opacity-50" // Reduced padding from py-3 to py-2
          disabled={loading} // Disable button while loading
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
}

export default Email;
