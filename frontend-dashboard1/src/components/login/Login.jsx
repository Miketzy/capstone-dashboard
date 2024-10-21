import React, { useState } from "react";
import "./login.css"; // Ensure the path is correct
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  // Ensure credentials are sent with requests
  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/login", values);
      if (response.data) {
        alert("Login successful!");

        // Store the token in local storage
        localStorage.setItem("token", response.data.token); // Make sure your backend sends back the token

        // Store contributor's first name and last name in localStorage
        localStorage.setItem("contributor_firstname", response.data.firstname);
        localStorage.setItem("contributor_lastname", response.data.lastname);
        localStorage.setItem("contributor_email", response.data.email);

        // Redirect based on user status
        if (response.data.status === "admin") {
          console.log("Admin successfully logged in.");
          navigate("/species-directory");
        } else if (response.data.status === "contributor") {
          console.log("Contributor successfully logged in.");
          navigate("/contributor-dashboard");
        } else {
          console.log("Unknown status, redirecting to home.");
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error.response?.data?.Message || "An error occurred during login.";
      alert(errorMessage);
    }
  };

  const registerPage = () => {
    axios
      .get("http://localhost:8080/registerpage")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/registration");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleEmail = () => {
    axios
      .get("http://localhost:8080/email")
      .then((res) => {
        console.log("Email Request response:", res.data);
        if (res.data.Message === "Success") {
          navigate("/email-request");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

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
          <div className="forgot-password-login">
            <h4 onClick={handleEmail}>Forgot Password</h4>
          </div>

          <button type="submit">Login</button>

          <p className="login-register">
            Don't have an Account? <a onClick={registerPage}>Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
