import React, { useState } from "react";
import axios from "axios";
import "./ChangePassword.css"; // Import the CSS file

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const token = localStorage.getItem("token"); // Get the JWT token from localStorage

    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        "/password-changes",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass JWT token for authorization
          },
          withCredentials: true, // Ensure cookies or credentials are passed
        }
      );
      setMessage(response.data.message);
      setError(""); // Clear any previous errors

      // Display an alert with the success message
      window.alert("Password has been changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
      setMessage(""); // Clear any previous success messages
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password">
        <label htmlFor="current-password">Current Password</label>
        <input
          id="current-password"
          type="password"
          placeholder="Enter your current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div className="change-password">
        <label htmlFor="new-password">New Password</label>
        <input
          id="new-password"
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="change-password">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          type="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button onClick={handlePasswordChange} className="change-password-button">
        Change Password
      </button>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
}

export default ChangePassword;
