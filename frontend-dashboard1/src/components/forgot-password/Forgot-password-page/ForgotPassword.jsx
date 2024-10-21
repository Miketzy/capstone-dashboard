import React, { useState } from "react";
import axios from "axios"; // Import axios for making API requests
import { useLocation, useNavigate } from "react-router-dom"; // Import hooks for routing
import "./ForgoyPassword.css"; // Import the CSS file

function ForgotPassword() {
  const location = useLocation(); // Access the location object to get email
  const navigate = useNavigate(); // Initialize navigate for redirection
  const email = location.state?.email; // Get the email passed from the OTP page
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirming password
  const [message, setMessage] = useState(""); // State for messages

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value); // Update new password state
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value); // Update confirm password state
  };

  const handleResetPassword = () => {
    // Validate input
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in all fields."); // Set message if fields are empty
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match."); // Set message if passwords don't match
      return;
    }

    // Send password reset request to backend
    axios
      .post("http://localhost:8080/reset-password", {
        // Fixed URL here
        email,
        password: newPassword,
      })
      .then((response) => {
        if (response.data.success) {
          setMessage("Password reset successfully!"); // Set success message
          // Optionally navigate to the login page or another page
          navigate("/");
        } else {
          setMessage(response.data.message); // Set error message from response
        }
      })
      .catch((error) => {
        console.error("Error resetting password:", error);
        setMessage("An error occurred while resetting the password."); // Set fallback error message
      });
  };

  return (
    <div className="forgot-body">
      <div className="forgot-password-container">
        <div className="forgot-password">
          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            placeholder="Enter your new password"
            value={newPassword} // Bind input value to state
            onChange={handleNewPasswordChange} // Update state on change
          />
        </div>
        <div className="forgot-password">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword} // Bind input value to state
            onChange={handleConfirmPasswordChange} // Update state on change
          />
        </div>
        <button
          className="forgot-password-button"
          onClick={handleResetPassword}
        >
          Reset Password
        </button>
        {message && <p>{message}</p>} {/* Display response message */}
      </div>
    </div>
  );
}

export default ForgotPassword;
