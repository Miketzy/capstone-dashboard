import React, { useState } from "react";
import "./login.css"; // Ensure the path is correct
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  // State to store form input values
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  // Hook to programmatically navigate
  const navigate = useNavigate();

  // Ensure credentials are sent with requests
  axios.defaults.withCredentials = true;

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation for form inputs
    if (!values.username || !values.password) {
      alert("Please enter both username and password.");
      return;
    }

    // Make POST request to login endpoint
    axios
      .post("http://localhost:8080/login", values)
      .then((res) => {
        // Check if login was successful
        if (res.data.Status === "Success") {
          // Navigate to species directory on successful login
          navigate("/species-directory");
        } else {
          // Alert user with the message from backend
          alert(res.data.Message);
        }
      })
      .catch((err) => {
        // Log error and alert user
        console.error("Login error:", err);
        alert("An error occurred during login. Please try again later.");
      });
  };

  // Render the login form
  return (
    <div className="body-login">
      <div className="container-login">
        <form className="form-login" onSubmit={handleSubmit}>
          <h2>LOGIN</h2>

          <div className="input-box">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
              required
            />
          </div>

          <div className="input-box">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
