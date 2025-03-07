import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // For cookie handling

function Login() {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  // Check if token exists in cookies or localStorage
  const checkToken = () => {
    const tokenFromCookies = Cookies.get("token"); // Check in cookies
    const tokenFromLocalStorage = localStorage.getItem("authToken"); // Check in localStorage

    if (tokenFromCookies || tokenFromLocalStorage) {
      console.log("Token found:", tokenFromCookies || tokenFromLocalStorage);
      return true;
    } else {
      console.log("No token found.");
      return false;
    }
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://bioexplorer-backend.onrender.com/login",
        values,
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        alert("Login successful!");

        // Store token in cookies and localStorage
        const token = response.data.token; // Assuming the backend returns the token
        Cookies.set("token", token, {
          expires: 30,
          secure: false, // Required for HTTPS
          sameSite: "None", // Required for cross-origin requests
        });

        localStorage.setItem("authToken", token);

        // Log token to debug
        console.log("Saved Token in Cookies:", Cookies.get("token"));
        console.log(
          "Saved Token in LocalStorage:",
          localStorage.getItem("authToken")
        );

        // Store user info for easy access
        localStorage.setItem("contributor_firstname", response.data.firstname);
        localStorage.setItem("contributor_lastname", response.data.lastname);
        localStorage.setItem("contributor_email", response.data.email);

        // Navigate based on user status
        if (response.data.status === "admin") {
          navigate("/species-directory");
        } else if (response.data.status === "contributor") {
          navigate("/contributor-dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.Message || "An error occurred during login.";
      alert(errorMessage);
    }
  };

  const registerPage = () => navigate("/registration");
  const handleEmail = () => navigate("/email-request");

  return (
    <div
      className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-blue-100"
      style={{
        backgroundImage: "url('/images/durso.jpg')",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">LOGIN</h2>

        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your username"
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleEmail}
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Login
          </button>
        </form>

        {/* Register Redirect */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={registerPage}
            className="text-blue-500 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
