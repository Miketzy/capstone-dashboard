import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Email.css";

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
      .post("http://localhost:8080/send-otp", { email })
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
    <div className="email-request">
      <div className="email-request-container">
        <h1>EMAIL REQUEST</h1>
        <div className="email-send">
          <p>We will be sending you a OTP code to your email</p>
          <input
            id="otp-email"
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <button
          className="email-otp-button"
          onClick={handleSendOTP}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Sending..." : "Send"}
        </button>
        {message && <p aria-live="polite">{message}</p>}
      </div>
    </div>
  );
}

export default Email;
