import React, { useState } from "react";
import axios from "axios";
import API_URL from "../../../config";

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

    const token = localStorage.getItem("authToken"); // Get the JWT token from localStorage

    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/password-changes`,
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
    <div>
      <br />
      <br />
      <br />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Change Password
        </h2>
        <div className="mb-4">
          <label
            htmlFor="current-password"
            className="block text-gray-600 mb-1"
          >
            Current Password
          </label>
          <input
            id="current-password"
            type="password"
            placeholder="Enter your current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="new-password" className="block text-gray-600 mb-1">
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirm-password"
            className="block text-gray-600 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handlePasswordChange}
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Change Password
        </button>
        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
        {message && <p className="mt-3 text-green-500 text-sm">{message}</p>}
      </div>
    </div>
  );
}

export default ChangePassword;
